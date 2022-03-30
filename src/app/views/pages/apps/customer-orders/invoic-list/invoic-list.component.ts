import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-invoic-list',
  templateUrl: './invoic-list.component.html',
  styleUrls: ['./invoic-list.component.scss']
})
export class InvoicListComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		this.setDataSourceAttributes();
  }
	dataSource: MatTableDataSource<any>;
	displayedColumns = ['check','id','date','customer','orders', 'total', 'status'];

  setDataSourceAttributes() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
  }
  total

  constructor(
		private router: Router,
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.invoices);
    this.total = this.invoices.length;
  }
  // new(){
	// 	this.router.navigate(['ecommerce/invoice/view']);

  // }
  detail(){
		this.router.navigate(['orders/invoice/']);
  }
  invoices:any = [{
    id: 0,
    date: '02/02/20',
    customer: 'Elizabeth Rodriguez',
    orders: 1,
    total: '3.50',
    status: 0,
  },{
    id: 1,
    date: '02/02/20',
    customer: 'Elizabeth Rodriguez',
    orders: 3,
    total: '3.50',
    status: 1,
  },{
    id: 2,
    date: '02/02/20',
    customer: 'Elizabeth Rodriguez',
    orders: 3,
    total: '3.50',
    status: 2,
  }]
}

