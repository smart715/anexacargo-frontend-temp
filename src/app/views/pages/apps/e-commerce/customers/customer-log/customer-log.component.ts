import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from 'src/app/service/customer.service';
import { result } from 'lodash';
import { MessengerService } from 'src/app/service/messenger.service';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-customer-log',
  templateUrl: './customer-log.component.html',
  styleUrls: ['./customer-log.component.scss']
})
export class CustomerLogComponent implements OnInit {

  @Input() customerID: any;
  changeStatus = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['date', 'description', 'user'];
  logs;
  constructor(
    private customerService: CustomerService,
    private messengerService: MessengerService,
    private changeDetectorRefs: ChangeDetectorRef,
    public router: Router

  ) { }
  ngOnInit(): void {
    if(this.changeStatus){
      alert();
    }
    
    this.router.onSameUrlNavigation = 'reload';
    this.customerService.getLogsByCustomer(this.customerID).then(async result => {
      this.logs = result;
      this.logs.map(async log => {
        console.log(log);
        await this.messengerService.getMessengerByID(log.idmessengers).then(async result => {
          console.log(result,'result')
          log.admin = result[0]?.name??'';
          this.logs.push(log);
          // await this.customerService.getCustomerByID(log.idcustomers).then(async result => {

          //   log.admin = result[0].firstName;
          //   this.changeDetectorRefs.detectChanges();

          //   console.log(log)
          //   // this.logs = [];
          //   this.logs.push(log);
          // })
        })
      })
      console.log(this.logs)
      this.dataSource = new MatTableDataSource(this.logs);
    })
  }

}
