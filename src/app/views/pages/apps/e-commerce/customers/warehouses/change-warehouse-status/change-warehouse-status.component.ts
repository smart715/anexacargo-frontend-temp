import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/service/customer.service';
import { EmailService } from 'src/app/service/email.service';
import { NotificationService } from 'src/app/service/notification.service';
import { WarehouseService } from 'src/app/service/warehouse.service';

@Component({
  selector: 'kt-change-warehouse-status',
  templateUrl: './change-warehouse-status.component.html',
  styleUrls: ['./change-warehouse-status.component.scss']
})
export class ChangeWarehouseStatusComponent implements OnInit {
  statusForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ChangeWarehouseStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private customerService: CustomerService,
    private emailService: EmailService,
    private notificationService: NotificationService,

  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
    });
  }

  async changeStatus() {
    if (this.statusForm.invalid) {
      return;
    }
    else {
      console.log(this.statusForm.value.status);
      console.log(this.data);
      var scannedWarehousesByCustomer = this.data.reduce(function (obj, value) {
        var key = `${value.idcustomers}`;
        if (obj[key] == null) obj[key] = [];

        obj[key].push(value);
        return obj;
      }, {});

      if (this.statusForm.value.status == '1') {
        if (window.confirm("Are you sure want to publish?")) {
          console.log('scannedWarehousesByCustomer', scannedWarehousesByCustomer)
          for (var key of Object.keys(scannedWarehousesByCustomer)) {
            var html = '';
            var totalPrice = 0;
            const writeHtml = async () => {
              return Promise.all(scannedWarehousesByCustomer[key].map(warehouse => {
                html = html + '<tr><td style="border:1px solid black;">' + warehouse.tracking + '</td><td style="border:1px solid black;">' + warehouse.weight + '</td><td style="border:1px solid black;">' + this.getVolWeight(warehouse) + '</td><td style="border:1px solid black;"></td><td style="border:1px solid black;">' + warehouse.price + '</td></tr>';
                totalPrice = totalPrice + parseFloat(warehouse.price);
                this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, '1').then(async result => {
                  await this.warehouseService.createWarehouseLog('status changed into ready', warehouse.idwarehouse, window.localStorage.getItem('userID')).then(async result => {
                  })
                });
              }))
            }

            writeHtml().then(result => {
              this.ngOnInit();
              this.customerService.getCustomerByID(key).then((customer: any) => {
                let image_url = window.localStorage.getItem("image_url");
                this.customerService.getTableContent().then(result => {
                  let all_content = result['length'] ? result[0]['content'] : "", content1, content2, content3;
                  let table = '<table style="border:1px solid black;border-collapse:collapse;"><tr><th style="border:1px solid black;padding:16px;">Descripción</th><th style="border:1px solid black;padding:16px;">Peso(lbs)</th><th style="border:1px solid black;padding:16px;">Peso Vol.</th><th style="border:1px solid black; padding:16px;"> </th><th style="border:1px solid black; padding:16px;">Total</th></tr>' + html + '<tr><td style="border:1px solid black;height:18px"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td></tr><tr><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;">TOTAL</td><td style="border:1px solid black;">$' + totalPrice.toFixed(2) + '</td></tr></table>';
                  if (result['length'] && (all_content.includes('{username}') || all_content.includes('{table}'))) {
                    content1 = all_content.replaceAll("{username}", customer[0].firstName);
                    content2 = content1.replaceAll("{table}", table)
                  }
                  let imageURL = '<img alt="Anexacargo" src="' + image_url + '" style="width:75px;" />';

                  var style = "<style> .th .td {border: 1px solid black;}.th {padding: 16px;}.table {border: 1px solid black;border-collapse: collapse;}</style>"
                  var htmll = imageURL + ' ' + content2;
                  console.log("htmll", htmll);

                  // var style = "<style> .th .td {border: 1px solid black;}.th {padding: 16px;}.table {border: 1px solid black;border-collapse: collapse;}</style>"
                  // var htmll = '<div><img alt="Anexacargo" src="' + image_url + '" style="width:75px;" /><div style="margin-top: 20px;">Hola ' + customer[0].firstName + '</div><div style="margin-top: 10px;">Aexpress Cargo le informa que tiene mercancía disponible para retirar. A continuación los detalles de la mercancía recibida:</div><table style="border:1px solid black;border-collapse:collapse;"><tr><th style="border:1px solid black;padding:16px;">Descripción</th><th style="border:1px solid black;padding:16px;">Peso(lbs)</th><th style="border:1px solid black;padding:16px;">Peso Vol.</th><th style="border:1px solid black; padding:16px;"> </th><th style="border:1px solid black; padding:16px;">Total</th></tr>' + html + '<tr><td style="border:1px solid black;height:18px"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td></tr><tr><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;">TOTAL</td><td style="border:1px solid black;">$' + totalPrice.toFixed(2) + '</td></tr></table><div style="margin-top: 20px;">* Si desea solicitar o cotizar costo de entrega a domicilio, solicítalo a través de la app o responda a este mensaje con la dirección detallada y forma de pago</div><div style="margin-top: 20px;font-size:large;"><strong>DESCARGA NUESTRA APP</strong></div><div style="margin-top: 10px;">Recibe notificaciones al instante, realiza ordenes de domicilio y mucho más. Descargarla en link</div><div style="margin-top: 20px;font-size:large;"><strong>INFORMACIÓN DE PAGO:</strong></div><div style="margin-top: 10px;">Para su comodidad puede hacer los pagos con<strong> Mastercard, Visa o tarjeta Clave.</strong> También puederealizar su pago vía ACH o depósito a nuestra cuenta:</div><div style="margin-top: 10px;"><strong> Alisof, S.A.</strong> | Banco General | Cuenta de Ahorros</div><div style="margin-top: 10px;">Cuenta: 04-72-99-580423-8</div><div style="margin-top: 10px;"><strong> Enviar confirmación previa de pago al correo:</strong> cobros@Anexacargo.com</div><div style="margin-top: 20px;font-size:large;"><strong>HORARIOS DE ATENCIÓN</strong></div><div style="margin-top: 10px;">Lunes a Viernes: 8:00a.m. a 5:00p.m.</div><div style="margin-top: 10px;">Lunes a Viernes: 8:00a.m. a 5:00p.m.</div><div style="margin-top: 10px;"><strong>***No abrimos los Domingos***</strong></div></div>'
                  // console.log("htmll", htmll);





















                  this.notificationService.sendNotificationToSpecificUser(key, scannedWarehousesByCustomer[key].length + ' paquetes disponibles', 'Puedes retirar tus paquetes o pedirlos a domicilio').then(result => {
                    console.log(result);
                    // window.alert("Push notification and email sent");

                  }).catch(err => {
                    console.log(err);
                    // window.alert("Unfortunately notification not sent!");

                  })
                  this.emailService.sendmail({ email: customer[0].email, html: htmll, title: 'Tienes mercancía para retirar' }).then(result => {
                    console.log(result);
                  }).catch(err => {
                    console.log(err);
                  })
                  this.dialogRef.close();
                })
              });
            })
          }
        }

      }
      else {
        await this.data.map(async warehouse => {
          await this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, this.statusForm.value.status).then(async result => {
            await this.warehouseService.createWarehouseLog('status changed into ' + this.getStatusString(this.statusForm.value.status), warehouse.idwarehouse, window.localStorage.getItem('userID')).then(async result => {
            })
            console.log(result);
          }).catch(err => {
            console.log("Unfortunately bug occured!");
          })
        })
        this.dialogRef.close();
      }





















    }
  }

  getStatusString(status) {
    if (status == '0') {
      return "pending";
    }
    else if (status == '1') {
      return "ready";
    }
    else if (status == '2') {
      return "delivery";
    }
    else if (status == '3') {
      return "completed";
    }
  }
  getVolWeight(warehouse) {
    var volWeight;
    volWeight = (Number(warehouse?.length) * Number(warehouse?.height) * Number(warehouse?.width) / 166).toFixed(2);
    return volWeight;
  }
}
