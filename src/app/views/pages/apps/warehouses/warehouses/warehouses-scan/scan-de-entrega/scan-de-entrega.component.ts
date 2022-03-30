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
  selector: 'kt-scan-de-entrega',
  templateUrl: './scan-de-entrega.component.html',
  styleUrls: ['./scan-de-entrega.component.scss']
})
export class ScanDeEntregaComponent implements OnInit {
  @ViewChild('scanInput', { static: false }) scanInput: ElementRef;
  scanForm: FormGroup;
  scannedLog: any = [];

  statusTitle;
  scannedWarehouseList: any = [];

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

    this.scanForm = this.fb.group({
      trackingControl: ['', Validators.required],
    });

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

  scan(event) {
    this.statusTitle = 'not exist'
    this.scanInput.nativeElement.focus();
    var today = new Date();
    var vtoday = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US');
    var tracking = this.scanForm.value.trackingControl;
    var deliveryWarehousesByCustomer;
    var scannedWarehouse
    console.log(tracking);
    if (this.scanForm.invalid) {
      return;
    }
    else {
      this.warehouseService.getWarehouseByTracking(tracking).then(async result => {
        scannedWarehouse = result[0];
        console.log(scannedWarehouse);
        if (scannedWarehouse == undefined) {
          this.statusTitle = 'not exist'
          this.changeDetectorRefs.detectChanges();

        }
        else {
          var status = scannedWarehouse.status;
          if (status == '0') {
            this.statusTitle = 'still pending';
            this.changeDetectorRefs.detectChanges();
          }
          // else if (status == '1') {
          //   this.statusTitle = 'aceptado';
          //   deliveryWarehousesByCustomer = [scannedWarehouse];
          //   this.scannedLog.push({ deliveryWarehousesByCustomer: deliveryWarehousesByCustomer, scannedWarehouse: scannedWarehouse });
          //   this.changeDetectorRefs.detectChanges();

          // }
          else if (status == '3') {
            this.statusTitle = 'warehouse already completed';
            this.changeDetectorRefs.detectChanges();
          }
          else if (status == '2' || status == '1') {
            this.statusTitle = 'aceptado';
            this.scannedWarehouseList.push(scannedWarehouse);
            this.changeDetectorRefs.detectChanges();

            await this.warehouseService.getDeliveryWarehousesByCustomer(scannedWarehouse.idcustomers).then(async result => {
              console.log(result);
              deliveryWarehousesByCustomer = result;
              await this.customerService.getCustomerByID(scannedWarehouse.idcustomers).then(async result => {
                console.log(result);
                scannedWarehouse.customer = result[0]?.firstName + " " + result[0]?.lastName;
                await this.checkScanLogDuplicate(scannedWarehouse.idwarehouse).then(result => {
                  if (result == true) {
                    this.scannedLog.reverse();
                    this.scannedLog.push({ deliveryWarehousesByCustomer: deliveryWarehousesByCustomer, scannedWarehouse: scannedWarehouse });
                    this.scannedLog.reverse();
                    this.changeDetectorRefs.detectChanges();
                  }
                  this.changeDetectorRefs.detectChanges();
                });
                this.changeDetectorRefs.detectChanges();
                this.warehouseService.setWarehouseStatus(scannedWarehouse.idwarehouse, '3').then(async result => {
                  await this.warehouseService.createWarehouseLog('status changed into ' + this.getStatusString('3'), scannedWarehouse.idwarehouse, window.localStorage.getItem('userID')).then(async result => {
                  })
                  console.log(result);
                });
              })


            });
          }
        }

      })
    }
    this.scanForm.patchValue({ trackingControl: '' });

  }
  checkScanned(warehouse) {
    if (this.scannedWarehouseList.filter(e => e.idwarehouse === warehouse.idwarehouse).length > 0) {
      return true;
    }
    return false;

  }

  async checkScanLogDuplicate(idwarehouse) {
    const resultMap = async () => {
      return Promise.all(this.scannedLog.map((item: any) => {
        return new Promise((resolve) => {
          if (item.deliveryWarehousesByCustomer.filter(e => e.idwarehouse == idwarehouse).length == 0) {
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

