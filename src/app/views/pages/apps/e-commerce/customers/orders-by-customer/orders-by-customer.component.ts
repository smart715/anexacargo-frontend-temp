import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { OrdersService } from 'src/app/service/orders.service'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'kt-orders-by-customer',
  templateUrl: './orders-by-customer.component.html',
  styleUrls: ['./orders-by-customer.component.scss']
})
export class OrdersByCustomerComponent implements OnInit {
  dataSourceOrders: MatTableDataSource<any>;
  displayedColumns = ['select', 'id', 'date', 'weight', 'volweight', 'cost', 'assignedTo', 'status', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  @Input() customerID: any;
  ordersByCustomer;
  filterStatus
  constructor(
    private ordersService: OrdersService,
  ) { }
  setDataSourceAttributes() {
    this.dataSourceOrders.paginator = this.paginator;
    this.dataSourceOrders.sort = this.sort;
  }
  applyFilter(filterValue: string) {

    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();

    this.dataSourceOrders.filterPredicate = (data: { tracking: string, date: string, weight: string, volweight: string, cost: string, assignedTo: string }, filterValue: string) =>
      (data.tracking.trim().toLowerCase().indexOf(filterValue) !== -1) ||
      (data.assignedTo.trim().toLowerCase().indexOf(filterValue) !== -1) ||
      (data.date.trim().toLowerCase().indexOf(filterValue) !== -1);

    if (this.dataSourceOrders.paginator) {
      this.dataSourceOrders.paginator.firstPage();
    }

    this.dataSourceOrders.filter = filterValue;
  }
  ngOnInit(): void {
    console.log(12312312,this.customerID)
    this.ordersService.getOrdersByCustomer(this.customerID).then(result => {
      this.ordersByCustomer = result;
      // generate Tracking
      var i = 0;
      this.ordersByCustomer.map(result => {
        var tempTracking = "H"
        for (var j = 0; j < (6 - this.ordersByCustomer[i].idorders.toString().length); j++) {
          tempTracking = tempTracking + '0';
        }
        this.ordersByCustomer[i].tracking = tempTracking + this.ordersByCustomer[i].idorders;
        i++;
      })
      // generate Tracking
      this.dataSourceOrders = new MatTableDataSource(this.ordersByCustomer);
      this.setDataSourceAttributes();

    })
  }
  filterBystatus() {
    this.dataSourceOrders.filterPredicate = (data: { status: string }, filterValue: string) => data.status.trim().toLowerCase().indexOf(this.filterStatus) !== -1;
    const tableFilters = [];
    tableFilters.push({ id: 'status', value: this.filterStatus });
    this.dataSourceOrders.filter = JSON.stringify(tableFilters);
    if (this.dataSourceOrders.paginator) {
      this.dataSourceOrders.paginator.firstPage();
    }

  }
  vieworder(order) {

  }

  deleteorder(order) {

  }
}
