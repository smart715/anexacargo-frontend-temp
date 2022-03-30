import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationExtras } from '@angular/router';
import { OrdersService } from 'src/app/service/orders.service';
import { MessengerService } from 'src/app/service/messenger.service';
import { PackagesService } from 'src/app/service/packages.service';

@Component({
  selector: 'kt-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['id', 'date', 'type', 'items', 'messenger', 'status'];
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  total;

  customerID;
  orders;
  tempPackages;

  constructor(
    private router: Router,
    private ordersService: OrdersService,
    private messengerService: MessengerService,
    private packagesService: PackagesService,


  ) { }

  async ngOnInit(): Promise<void> {
    // this.customerID = "30";
    this.customerID = window.localStorage.getItem("idcustomers")
    await this.ordersService.getOrdersByCustomer(this.customerID).then(async result => {
      this.orders = result;
      this.orders = this.orders.reverse();
      await this.orders.map(async result => {
        await this.packagesService.getPackagesByOrderID(result.idorders).then(async resultpackages => {
          this.tempPackages = resultpackages;
          result.items = this.tempPackages.length;
          result.packages = this.tempPackages
          if (result.assignedTo) {
            await this.messengerService.getMessengerByID(result.assignedTo).then(async results => {
              result.messenger = results[0].name;
            })
          }
          this.dataSource = new MatTableDataSource(this.orders);
          this.setDataSourceAttributes();
          this.total = this.orders.length;
        })

      })
    })



  }
  detail(order) {
    let naviagtionExtras: NavigationExtras = {
      queryParams: order
    }
    this.router.navigate(['orders/detail'], naviagtionExtras);

  }
  createOrder() {
    this.router.navigate(['orders/']);

  }
}
