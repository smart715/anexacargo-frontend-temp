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
import { WarehouseAssignedToComponent } from '../warehouse-assigned-to/warehouse-assigned-to.component';
import { WarehouseService } from 'src/app/service/warehouse.service';

@Component({
  selector: 'kt-warehouse-scan-salida-entrega',
  templateUrl: './warehouse-scan-salida-entrega.component.html',
  styleUrls: ['./warehouse-scan-salida-entrega.component.scss']
})
export class WarehouseScanSalidaEntregaComponent implements OnInit {
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
  scanedWarehouseList = [];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    
    private messengerService: MessengerService,

		private changeDetectorRefs: ChangeDetectorRef,
		public dialog: MatDialog,
    private warehouseService: WarehouseService,
    
  ) { }

  ngOnInit(): void {
    this.scanedWarehouseList = [];
    this.tables = [];
    this.by = window.localStorage.getItem('userID');
    this.messengerService.getMessengerByID(this.by).then(result => {
      this.tempResult = result;
      this.by = this.tempResult[0].name;
    })
    this.scanForm = this.fb.group({
			tracking: ['', Validators.required],
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

  scan(event){
    this.scanInput.nativeElement.focus();
    var today = new Date();
    var vtoday = formatDate(today, 'dd-MM-yyyy hh:mm:ss a', 'en-US');
    var tracking = this.scanForm.value.tracking;
    var warehouse;
    if(this.scanForm.invalid){
      return;
    }
    console.log(tracking);

    this.warehouseService.getWarehouseByTracking(tracking).then(result=> {
      warehouse = result[0];
      if (warehouse){
        console.log(warehouse);
        warehouse.vtoday = vtoday;
        if (warehouse.status == '0'){
          this.statusTitle = "warehouse is pendding";
          this.changeDetectorRefs.detectChanges();
        }
        else if (warehouse.status == '1'){
          this.statusTitle = "aceptado";
          this.scanedWarehouseList.reverse()
          this.scanedWarehouseList.push(warehouse);
          this.scanedWarehouseList.reverse()

          this.changeDetectorRefs.detectChanges();

          if (this.data.flag == 'salida'){
            this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, '2').then(result=> {
              console.log(result);
            })
          }
          else {
            this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, '3').then(result=> {
              console.log(result);
            })
          }
        }
        else if (warehouse.status == '2'){
          if (this.data.flag == 'salida'){
            this.statusTitle = "already delivering";
            this.changeDetectorRefs.detectChanges();
          }
          else {
            this.statusTitle = "aceptado";
            this.scanedWarehouseList.reverse()
            this.scanedWarehouseList.push(warehouse);
            this.scanedWarehouseList.reverse()
            this.changeDetectorRefs.detectChanges();
            this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, '3').then(result=> {
              console.log(result);
            })
          }
        }
        else if (warehouse.statu == '3'){
          this.statusTitle = "already completed";
          this.changeDetectorRefs.detectChanges();
        }
      }
      else {
        this.statusTitle = "No existe";
        this.changeDetectorRefs.detectChanges();
      }
    })
    this.scanForm.patchValue({tracking: ''});
  }
}
