import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { DaterangepickerComponent } from 'ngx-daterangepicker-material';
import { MessengerService } from 'src/app/service/messenger.service';
import { WarehouseService } from 'src/app/service/warehouse.service';

@Component({
  selector: 'kt-warehouses-log',
  templateUrl: './warehouses-log.component.html',
  styleUrls: ['./warehouses-log.component.scss']
})
export class WarehousesLogComponent implements OnInit {
  @Input() idwarehouse: any;

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['date', 'description', 'user'];
  logs;
  constructor(
    private messengerService : MessengerService,
    private warehouseService : WarehouseService,

    
  ) { }
  ngOnInit(): void {
    console.log(this.idwarehouse);
    this.warehouseService.getWarehouseLog(this.idwarehouse).then(result => {
      this.logs = result;
      
      for(var i  = 0 ; i < this.logs.length;i++){
        this.logs[i]["date"] =  moment(this.logs[i]["date"]).format("dd-mm-yy hh:mm:ss");
      }
      this.logs.map(log => {
        console.log(log);
        this.messengerService.getMessengerByID(log.user).then(result => {
          log.admin = result[0].name;
          this.dataSource = new MatTableDataSource(this.logs);
        })
      })
    })
  }

}

