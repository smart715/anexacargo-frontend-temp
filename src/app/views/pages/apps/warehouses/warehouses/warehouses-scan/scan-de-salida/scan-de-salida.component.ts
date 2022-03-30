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
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'kt-scan-de-salida',
  templateUrl: './scan-de-salida.component.html',
  styleUrls: ['./scan-de-salida.component.scss']
})
export class ScanDeSalidaComponent implements OnInit {
  @ViewChild('scanInput', { static: false }) scanInput: ElementRef;
  scanForm: FormGroup;
  scannedLog: any = [];
  statusTitle;
  messengers;
  idmessengers;
  orderWarehouses: any = [];// warehouses inside order;
  scannedWarehouse;
  scannedWarehouseList: any = [];

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private customerService: CustomerService,
    private emailService: EmailService,
    private notificationService: NotificationService,
    private messengerService: MessengerService,


  ) { }

  ngOnInit(): void {


    this.scanForm = this.fb.group({
      trackingControl: ['', Validators.required],
    });
    this.messengerService.getAllMessengers().then(result => {
      this.messengers = result;
      console.log(this.messengers);
    })
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

  publish() {
    if (this.idmessengers == undefined) {
      return;
    }
    else {
      console.log(this.idmessengers);
      console.log(this.scannedWarehouseList);

      const resultMap = async () => {
        return Promise.all(this.scannedWarehouseList.map(async warehouse => {
          await this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, '2').then(async result => {
            console.log(result);
            await this.warehouseService.createWarehouseLog('status changed into ' + this.getStatusString('2'), warehouse.idwarehouse, window.localStorage.getItem('userID')).then(async result => {
              await this.warehouseService.assigneWarehouse(warehouse.idwarehouse, this.idmessengers).then(result => {
                console.log(result);
              })
            })

          })
        }))
      }
      resultMap().then(result => {
        window.alert("Successfully published");
        this.scannedWarehouseList = [];
        this.scannedLog = [];
        this.orderWarehouses = [];
        this.changeDetectorRefs.detectChanges();
      })
    }
  }

  checkScanned(warehouse) {
    // if (warehouse.idwarehouse == this.scannedWarehouse.idwarehouse) {
    //   return true;

    // }
    // return false;
    // const resultMap = async () => {
    //   return Promise.all(this.scannedWarehouseList.map(scanned => {
    //     if (warehouse.idwarehouse == scanned.idwarehouse) {
    //       return true;
    //     }
    //   }))
    // }

    // resultMap().then(()=> {
    //   return false;
    // })
    if (this.scannedWarehouseList.filter(e => e.idwarehouse === warehouse.idwarehouse).length > 0) {
      return true;
    }
    return false;

  }

  scan(event) {


    this.statusTitle = 'not exist'
    this.scanInput.nativeElement.focus();
    var today = new Date();
    var vtoday = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US');
    var tracking = this.scanForm.value.trackingControl;
    var readyWarehouses = []; // ready warehouses by customer expcept orderWarehouese
    this.orderWarehouses = [];
    console.log(tracking);
    if (this.scanForm.invalid) {
      return;
    }
    else {
      this.warehouseService.getWarehouseByTracking(tracking).then(result => {

        this.scannedWarehouse = result[0];
        console.log("scannedWarehouse__________________________this.scannedWarehouses");

        console.log(this.scannedWarehouse);
        console.log(this.scannedWarehouse);
        if (this.scannedWarehouse == undefined) {
          this.statusTitle = 'not exist'
          this.changeDetectorRefs.detectChanges();
          return;

        }
        else {
          var status = this.scannedWarehouse.status;
          if (status == '0') {
            this.statusTitle = 'still pending';
            this.changeDetectorRefs.detectChanges();
            return;

          }
          else if (status == '1') {
            if (this.scannedWarehouseList.length == 0) {

            }
            else {
              if (this.checkScanned(this.scannedWarehouse)) {
                this.statusTitle = 'already scanned just before';
                this.changeDetectorRefs.detectChanges();
                return;
              }
            }
            this.statusTitle = 'aceptado';
            this.changeDetectorRefs.detectChanges();
            this.scannedWarehouseList.push(this.scannedWarehouse);

            this.customerService.getCustomerByID(this.scannedWarehouse.idcustomers).then(result => {
              this.scannedWarehouse.customer = result[0].firstName + " " + result[0].lastName
              // if (this.scannedWarehouse.idwarehouseOrder == ''){
              //   this.scannedWarehouse.idwarehouseOrder = '0';
              // }
              if (this.scannedWarehouse.idwarehouseOrder == '') {
                // this.orderWarehouses.push(this.scannedWarehouse);
                // this.changeDetectorRefs.detectChanges();
              }
              else {
                this.warehouseService.getWarehouseByOrderID(this.scannedWarehouse.idwarehouseOrder).then((result: any) => {
                  console.log(result);
                  this.orderWarehouses = result;
                  this.changeDetectorRefs.detectChanges();
                })
              }

              this.warehouseService.getReadyWarehousesByCustomer(this.scannedWarehouse.idcustomers).then((result: any) => {
                console.log(result);
                var TempreadyWarehouses = result;
                const resultMap = async () => {
                  return Promise.all(TempreadyWarehouses.map(warehouse => {
                    if (this.scannedWarehouse.idwarehouseOrder == '') {
                      // if (warehouse?.idwarehouse != this.scannedWarehouse.idwarehouse) {
                      readyWarehouses.push(warehouse);
                      this.changeDetectorRefs.detectChanges();
                      // }
                    }
                    else if (warehouse?.idwarehouseOrder != this.scannedWarehouse.idwarehouseOrder) {
                      readyWarehouses.push(warehouse);
                      this.changeDetectorRefs.detectChanges();
                    }
                  }))
                }
                resultMap().then(() => {
                  console.log(this.scannedLog);
                  this.checkScanLogDuplicate(this.scannedWarehouse.idwarehouse).then(result => {
                    console.log(result);
                    if (result == true) {
                      this.scannedLog.reverse();
                      this.scannedLog.push({ scannedWarehouse: this.scannedWarehouse, readyWarehouses: readyWarehouses, orderWarehouses: this.orderWarehouses });
                      this.scannedLog.reverse();
                      this.changeDetectorRefs.detectChanges();
                    }
                    console.log(this.scannedLog);
                    this.changeDetectorRefs.detectChanges();
                  });
                })
              })

            })
          }
          else if (status == '3') {
            this.statusTitle = 'warehouse already completed';
            this.changeDetectorRefs.detectChanges();
            return;

          }
          else if (status == '2') {
            this.statusTitle = 'warehouse already deliverying';
            this.changeDetectorRefs.detectChanges();
            return;

          }
        }

      })
    }
    this.scanForm.patchValue({ trackingControl: '' });

  }
  async checkScanLogDuplicate(idwarehouse) {
    const resultMap = async () => {
      return Promise.all(this.scannedLog.map((item: any) => {
        return new Promise((resolve) => {
          if (item.orderWarehouses.filter(e => e.idwarehouse == idwarehouse).length == 0 && item.readyWarehouses.filter(e => e.idwarehouse == idwarehouse).length == 0) {
            resolve(true);
          }
          else {
            resolve(false);
          }
        })
      }));
    };
    return new Promise((resolve) => {
      resultMap().then((result: any) => {
        result.map(flag => {
          if (flag == false) {
            resolve(false);
          }
        });
        resolve(true);
      })
    })
  }
}

