import { Component, OnInit, Inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PackagesService } from 'src/app/service/packages.service';
import { OrdersService } from 'src/app/service/orders.service';
import { MessengerService } from 'src/app/service/messenger.service';

import { formatDate } from '@angular/common';
import { result } from 'lodash';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { MatDialog } from '@angular/material/dialog';
import { AssignPackageComponent } from '../assign-package/assign-package.component';

@Component({
  selector: 'kt-package-scan',
  templateUrl: './package-scan.component.html',
  styleUrls: ['./package-scan.component.scss']
})
export class PackageScanComponent implements OnInit {
  @ViewChild('scanInput', {static: false}) scanInput: ElementRef;
  scanForm: FormGroup;

  data;
  backgroundColor;
  statusTitle;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['tracking','date','assignedTo','by'];
  tempResult;
  tempOrder;
  by;
  description:any = [];
  tables: any = [];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private packagesService: PackagesService,
    private ordersService: OrdersService,
    
    private messengerService: MessengerService,

		private changeDetectorRefs: ChangeDetectorRef,
		public dialog: MatDialog,
    
  ) { }

  ngOnInit(): void {
    this.tables = [];
    this.by = window.localStorage.getItem('userID');
    this.messengerService.getMessengerByID(this.by).then(result => {
      this.tempResult = result;
      this.by = this.tempResult[0].name;
    })
    this.scanForm = this.fb.group({
			idControl: ['', Validators.required],
    });
    this.route.queryParams.subscribe(params => {
      this.data = params;
      console.log(this.data);
      if (this.data.flag == "salida"){
        this.backgroundColor = '#1bc5bd';
      }
      else {
        this.backgroundColor = '#3699ff';
      }
    });
    this.dataSource = new MatTableDataSource(this.description);
    console.log("thisasdfasdf", this.statusTitle);
  }
  checkassignedTo(order, pack){
    var packages: any = [];
    packages.push(pack);
    console.log(order, pack);
    if(order.assignedTo == null || order.assignedTo == undefined || order.assignedTo == ""){
      console.log("no messenger");
      const dialogRef = this.dialog.open(AssignPackageComponent, { data: packages, disableClose: true });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result.assignedTo);
        order.assignedTo = result.assignedTo;
        this.scanLog(order, pack);
      })
    }
    else{
      this.scanLog(order, pack);
    }
  }

  scanLog(order, pack){
    var elLog : any = {
      assignedTo : '',
      idorders : '',
      packages : {}
    };
    this.messengerService.getMessengerByID(order.assignedTo).then((result:any) => {
      console.log(result[0].name);
      elLog['assignedTo'] = result[0].name;
      elLog.idorders = order.idorders;
      this.packagesService.getPackagesByOrderID(order.idorders).then((result:any) => {
        elLog.packages = result;
        console.log(elLog);
        this.tables.push(elLog);
        this.changeDetectorRefs.detectChanges();
      })
    })
  }

  scan(event){
    this.scanInput.nativeElement.focus();
    var today = new Date();
    var vtoday = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US');
    var idpackages = Number(this.scanForm.value.idControl.substring(1));
    // console.log(this.scanForm.value.idControl.length);
    if(this.scanForm.invalid){
      return;
    }
    else if ( !(this.scanForm.value.idControl.length == 7 && (this.scanForm.value.idControl.substring(0,1) == 'h' || this.scanForm.value.idControl.substring(0,1) == 'H'))){
      console.log("invalid");
      this.statusTitle = "No existe";
    }
    else{
      console.log(idpackages);
      console.log(this.data.flag);
      this.packagesService.getPackageByidpackages(idpackages).then(result => {
        console.log(result);
        this.tempResult = result;
        if(this.tempResult.length == 0){
          this.statusTitle = "No existe";
          this.changeDetectorRefs.detectChanges();
          this.scanForm.setValue({idControl: ''});
          return;
        }
        else {
          this.ordersService.getOrderByID(this.tempResult[0].idorders).then(async result => {
            console.log(result);
            this.tempOrder = result;
            if(this.tempOrder[0].status == '0'){
              // this.statusTitle = "Order is pending, need to be approved";
              this.statusTitle = "No existe";
              
              this.changeDetectorRefs.detectChanges();
              this.scanForm.setValue({idControl: ''});

              return;
            }
            else if (this.tempOrder[0].status == '2'){
              // this.statusTitle = "order fue entregado";
              this.statusTitle = "No existe";

              this.changeDetectorRefs.detectChanges();
              this.scanForm.setValue({idControl: ''});

              return;
            }
            else if (this.tempOrder[0].status == '3'){
              // this.statusTitle = "order esta cancelado";
              this.statusTitle = "No existe";

              this.changeDetectorRefs.detectChanges();
              this.scanForm.setValue({idControl: ''});

              return;
            }
            else {
              if (this.tempResult[0].status == '5'){
                this.statusTitle = "fue entregado";
                this.changeDetectorRefs.detectChanges();
                this.scanForm.setValue({idControl: ''});

                return;
              }
              else if (this.tempResult[0].status == '4'){
                this.statusTitle = "esta cancelado";
                this.changeDetectorRefs.detectChanges();
                this.scanForm.setValue({idControl: ''});

                return;
              }
              else if (this.tempResult[0].status == '3'){
                this.statusTitle = "esta por entregar";
                this.changeDetectorRefs.detectChanges();
                this.scanForm.setValue({idControl: ''});

                return;
              }
              else if (this.tempResult[0].status == '2'){
                if (this.data.flag == 'salida'){
                  var idmessenger = window.localStorage.getItem('userID');
                  await this.packagesService.setPackageStatus(this.tempResult[0], '3', idmessenger).then(result => {
                    this.checkassignedTo(this.tempOrder[0], this.tempResult[0]);
                    console.log(result);
                    this.statusTitle = "aceptado";
                    this.description.push({
                      tracking: this.tempResult[0].idpackages,
                      date: vtoday,
                      assignedTo: 'mriz',
                      by: this.by
                    })
                    this.dataSource = new MatTableDataSource(this.description);
                    this.scanForm.setValue({idControl: ''});

                    this.changeDetectorRefs.detectChanges();
                  })
                }
                else {
                  this.statusTitle = "ya esta en bodega";
                  this.changeDetectorRefs.detectChanges();
                  this.scanForm.setValue({idControl: ''});

                  return;
                }
              }
              else if (this.tempResult[0].status == '1'){
                if (this.data.flag == 'salida'){


                  var idmessenger = window.localStorage.getItem('userID');
                  await this.packagesService.setPackageStatus(this.tempResult[0], '3', idmessenger).then(result => {
                    this.checkassignedTo(this.tempOrder[0], this.tempResult[0]);

                    console.log(result);
                    this.statusTitle = "aceptado";
                    this.description.push({
                      tracking: this.tempResult[0].idpackages,
                      date: vtoday,
                      assignedTo: 'mriz',
                      by: this.by
                    })
                    this.dataSource = new MatTableDataSource(this.description);
                    this.scanForm.setValue({idControl: ''});

                    this.changeDetectorRefs.detectChanges();
                  })



                  // this.statusTitle = "need to be scaned by 'scan de recepcion' first";
                  // this.changeDetectorRefs.detectChanges();
                  // this.scanForm.setValue({idControl: ''});

                  return;
                }
                else {

                  var idmessenger = window.localStorage.getItem('userID');
                  await this.packagesService.setPackageStatus(this.tempResult[0], '2', idmessenger).then(result => {
                    this.checkassignedTo(this.tempOrder[0], this.tempResult[0]);

                    console.log(result);
                    this.statusTitle = "aceptado";
                    this.description.push({
                      tracking: this.tempResult[0].idpackages,
                      date: vtoday,
                      assignedTo: 'mriz',
                      by: this.by
                    })
                    this.dataSource = new MatTableDataSource(this.description);
                    this.scanForm.setValue({idControl: ''});

                    this.changeDetectorRefs.detectChanges();
                  })
                }
              }
              else {
                // this.statusTitle = "RETIRAR EN MI DIRECCIÓN";
                this.statusTitle = "No existe";

                this.changeDetectorRefs.detectChanges();
                this.scanForm.setValue({idControl: ''});

                return;
              }
            }
          })
        }
      })
    }
  }

  getCheck(int){
    
    if(this.data.flag == "salida") {
      if(Number(int) < 3){
        return false;
      }
      else {
        return true;
      }
    }
    else {
      if(Number(int) < 2){
        return false;
      }
      else {
        return true;
      }
    }
  }
}
