import { Component, OnInit, Inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PackagesService } from 'src/app/service/packages.service';
import { OrdersService } from 'src/app/service/orders.service';
import { MessengerService } from 'src/app/service/messenger.service';

import { formatDate } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { WarehouseOrderService } from 'src/app/service/warehouse-order.service';
import { CustomerService } from 'src/app/service/customer.service';
import { EmailService } from 'src/app/service/email.service';
import { result } from 'lodash';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'kt-warehouse-scan-ready',
  templateUrl: './warehouse-scan-ready.component.html',
  styleUrls: ['./warehouse-scan-ready.component.scss']
})
export class WarehouseScanReadyComponent implements OnInit {
  @ViewChild('scanInput', { static: false }) scanInput: ElementRef;
  scanForm: FormGroup;

  data;
  backgroundColor;
  statusTitle;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['tracking', 'date', 'assignedTo', 'by'];
  tempResult;
  tempOrder;
  by;
  description: any = [];
  tables: any = [];
  scanedWarehouse: any = [];
  scanedCourierWarehouse: any = [];

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private customerService: CustomerService,
    private emailService: EmailService,
    private notificationService: NotificationService,


  ) { }

  ngOnInit(): void {
    this.scanedWarehouse = [];
    this.scanedCourierWarehouse = [];

    this.scanForm = this.fb.group({
      trackingControl: ['', Validators.required],
    });

  }

  scan(event) {
    this.statusTitle = 'not exist'
    this.scanInput.nativeElement.focus();
    var today = new Date();
    var vtoday = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US');
    var tracking = this.scanForm.value.trackingControl;
    var warehouse;   //warehouse
    var courierWarehouses; // warehouses inside same courier
    console.log(tracking);
    if (this.scanForm.invalid) {
      return;
    }
    else {
      this.warehouseService.getWarehouseByTracking(tracking).then(result => {
        warehouse = result[0];
        console.log(warehouse);

        if (warehouse) {






          if (this.scanedWarehouse.filter(x => x.idwarehouse == warehouse.idwarehouse).length != 0) {
            this.statusTitle = 'already scaned';
            this.changeDetectorRefs.detectChanges();
          }
          else {
            if (warehouse.status == '0') {
              this.statusTitle = 'aceptado';
              warehouse.vtoday = vtoday;
              this.scanedWarehouse.reverse();
              this.scanedWarehouse.push(warehouse);
              this.scanedWarehouse.reverse();
              this.changeDetectorRefs.detectChanges();
              this.customerService.getCustomerByID(warehouse.idcustomers).then((result: any) => {
                warehouse.customer = result[0].firstName + " " + result[0].lastName;
                this.changeDetectorRefs.detectChanges();

              })
              // this.warehouseService.getWarehousebyCourierID(warehouse.idcourier).then(warehouses => {
              //   courierWarehouses = warehouses;
              //   console.log(courierWarehouses);
              //   courierWarehouses.forEach(warehouseTemp => {
              //     if (warehouseTemp.idwarehouse == warehouse.idwarehouse){
              //       warehouseTemp.scannedFlag = true;
              //     }
              //     else {
              //       if (warehouseTemp.status == '0') {
              //         warehouseTemp.scannedFlag = false;
              //       }
              //       else {
              //         warehouseTemp.scannedFlag = true;
              //       }
              //     }
              //   })
              //   this.scanedCourierWarehouse.push(courierWarehouses);
              //   console.log(this.scanedCourierWarehouse);

              //   this.changeDetectorRefs.detectChanges();

              // })
            }
            else if (warehouse.status == '1') {
              this.statusTitle = 'already ready';
              this.changeDetectorRefs.detectChanges();
            }
            else if (warehouse.status == '2') {
              this.statusTitle = 'warehouse is deliverying';
              this.changeDetectorRefs.detectChanges();
            }
            else if (warehouse.status == '3') {
              this.statusTitle = 'warehouse is completed';
              this.changeDetectorRefs.detectChanges();
            }
          }
        }
        else {
          this.statusTitle = 'not exist';
          this.changeDetectorRefs.detectChanges();
        }
      })
    }
    this.scanForm.patchValue({ trackingControl: '' });

  }

  publish() {
    console.log(this.scanedWarehouse);
    var scannedWarehousesByCustomer = this.scanedWarehouse.reduce(function (obj, value) {
      var key = `${value.idcustomers}`;
      if (obj[key] == null) obj[key] = [];

      obj[key].push(value);
      return obj;
    }, {});

    console.log(scannedWarehousesByCustomer);

    const setStatus = async () => {
      return Promise.all(this.scanedWarehouse.map(warehouse => {
        this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, '1').then(async result => {
          console.log(result);
          await this.warehouseService.createWarehouseLog("warehouse scanned by Ready", warehouse.idwarehouse, window.localStorage.getItem('userID')).then(result => {
            console.log(result);
          })
        });
      }))
    }
    setStatus().then(data => {
      if (window.confirm("Are you sure want to publish?")) {
        for (var key of Object.keys(scannedWarehousesByCustomer)) {
          console.log(key);

          var html = '';
          var totalPrice = 0;
          const writeHtml = async () => {
            return Promise.all(scannedWarehousesByCustomer[key].map(warehouse => {
              html = html + '<tr><td style="border:1px solid black;">' + warehouse.tracking + '</td><td style="border:1px solid black;">' + warehouse.weight + '</td><td style="border:1px solid black;">' + this.getVolWeight(warehouse) + '</td><td style="border:1px solid black;"></td><td style="border:1px solid black;">' + warehouse.price + '</td></tr>';
              totalPrice = totalPrice + parseFloat(warehouse.price);
              this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, '1').then(result => {
                console.log(result);
              });
            }))
          }

          writeHtml().then(result => {
            this.ngOnInit();
            let image_url = window.localStorage.getItem("image_url");
            this.customerService.getCustomerByID(key).then((customer: any) => {
              this.customerService.getTableContent().then(result => {
                console.log(result)
                let all_content = result['length'] ? result[0]['content'] : "", content1, content2, content3;
                let table = '<table style="border:1px solid black;border-collapse:collapse;"><tr><th style="border:1px solid black;padding:16px;">Descripción</th><th style="border:1px solid black;padding:16px;">Peso(lbs)</th><th style="border:1px solid black;padding:16px;">Peso Vol.</th><th style="border:1px solid black; padding:16px;"> </th><th style="border:1px solid black; padding:16px;">Total</th></tr>' + html + '<tr><td style="border:1px solid black;height:18px"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td></tr><tr><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;">TOTAL</td><td style="border:1px solid black;">$' + totalPrice.toFixed(2) + '</td></tr></table>';
                if (result['length'] && (all_content.includes('{username}') || all_content.includes('{table}'))) {
                  content1 = all_content.replaceAll("{username}", customer[0].firstName);
                  content2 = content1.replaceAll("{table}", table)
                } else {
                  content2 = all_content
                }
                let imageURL = '<img alt="Anexacargo" src="' + image_url + '" style="width:75px;" />';
                var htmll = imageURL + ' ' + content2;

                // var style = "<style> .th .td {border: 1px solid black;}.th {padding: 16px;}.table {border: 1px solid black;border-collapse: collapse;}</style>"
                // var htmll = '<div><img alt="Anexacargo" src="' + image_url + '" style="width:75px;" /><div style="margin-top: 20px;">Hola ' + customer[0].firstName + '</div><div style="margin-top: 10px;">Aexpress Cargo le informa que tiene mercancía disponible para retirar. A continuación los detalles de la mercancía recibida:</div><table style="border:1px solid black;border-collapse:collapse;"><tr><th style="border:1px solid black;padding:16px;">Descripción</th><th style="border:1px solid black;padding:16px;">Peso(lbs)</th><th style="border:1px solid black;padding:16px;">Peso Vol.</th><th style="border:1px solid black; padding:16px;"> </th><th style="border:1px solid black; padding:16px;">Total</th></tr>' + html + '<tr><td style="border:1px solid black;height:18px"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td></tr><tr><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;">TOTAL</td><td style="border:1px solid black;">$' + totalPrice.toFixed(2) + '</td></tr></table><div style="margin-top: 20px;">* Si desea solicitar o cotizar costo de entrega a domicilio, solicítalo a través de la app o responda a este mensaje con la dirección detallada y forma de pago</div><div style="margin-top: 20px;font-size:large;"><strong>DESCARGA NUESTRA APP</strong></div><div style="margin-top: 10px;">Recibe notificaciones al instante, realiza ordenes de domicilio y mucho más. Descargarla en link</div><div style="margin-top: 20px;font-size:large;"><strong>INFORMACIÓN DE PAGO:</strong></div><div style="margin-top: 10px;">Para su comodidad puede hacer los pagos con<strong> Mastercard, Visa o tarjeta Clave.</strong> También puederealizar su pago vía ACH o depósito a nuestra cuenta:</div><div style="margin-top: 10px;"><strong> Alisof, S.A.</strong> | Banco General | Cuenta de Ahorros</div><div style="margin-top: 10px;">Cuenta: 04-72-99-580423-8</div><div style="margin-top: 10px;"><strong> Enviar confirmación previa de pago al correo:</strong> cobros@Anexacargo.com</div><div style="margin-top: 20px;font-size:large;"><strong>HORARIOS DE ATENCIÓN</strong></div><div style="margin-top: 10px;">Lunes a Viernes: 8:00a.m. a 5:00p.m.</div><div style="margin-top: 10px;">Lunes a Viernes: 8:00a.m. a 5:00p.m.</div><div style="margin-top: 10px;"><strong>***No abrimos los Domingos***</strong></div></div>'
                console.log("htmll", htmll);
                this.notificationService.sendNotificationToSpecificUser(key, scannedWarehousesByCustomer[key].length + ' paquetes disponibles', 'Puedes retirar tus paquetes o pedirlos a domicilio').then(result => {
                  console.log(result);
                  window.alert("Push notification and email sent");

                }).catch(err => {
                  console.log(err);
                  // window.alert("Unfortunately notification not sent!");

                })
                this.emailService.sendmail({ email: customer[0].email, html: htmll, title: 'Tienes mercancía para retirar' }).then(result => {
                  console.log(result);
                })
              });
            })
          })
        }
      }
    })



  }
  getVolWeight(warehouse) {
    var volWeight;
    volWeight = (Number(warehouse?.length) * Number(warehouse?.height) * Number(warehouse?.width) / 166).toFixed(2);
    return volWeight;
  }
}

