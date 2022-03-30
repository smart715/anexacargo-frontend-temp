
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FakeApiService } from '../../../../../../core/_base/layout/server/fake-api/fake-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OrderEditComponent } from '../order-edit/order-edit.component'
import { OrdersService } from 'src/app/service/orders.service';
import { CustomerService } from 'src/app/service/customer.service';
import { PackagesService } from 'src/app/service/packages.service';
import { SelectionModel } from '@angular/cdk/collections';
import { AssignOrderComponentComponent } from './assign-order-component/assign-order-component.component';

@Component({
	selector: 'kt-orders-list',
	templateUrl: './orders-list.component.html',
	styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		// this.setDataSourceAttributes();
	}

	dataSource: MatTableDataSource<any>;
	total: number;
	pending: number;
	inProgress: number;
	pickUp: number;

	pageIndex: number = 0;
	length: number = 10;

	displayedColumns = ['check', 'id', 'date', 'customer', 'items', 'cost', 'billing', 'status'];
	selection = new SelectionModel<any>(true, []);

	orders: any;
	openOrders = [];
	closedOrders = [];
	title: any;
	openFlag: number;
	completed: number;
	cancelled: number;
	packages;
	checkedFlag;

	constructor(private fakeApi: FakeApiService,
		private router: Router,
		public dialog: MatDialog,
		private ordersService: OrdersService,
		private customerService: CustomerService,
		private changeDetectorRefs: ChangeDetectorRef,
		private packagesService: PackagesService,

	) { }

	async ngOnInit(): Promise<void> {
		this.checkedFlag = false;
		this.orders = [];
		this.pending = 0;
		this.inProgress = 0;
		this.completed = 0;
		this.cancelled = 0;
		this.openFlag = 1;
		this.title = "Open Orders"
		this.total = 0;

		await this.ordersService.getAllOrders().then(async result => {
			this.orders = result;
			this.orders = this.orders.reverse();
			console.log(this.orders);
			await this.orders.map(async result => {
				await this.customerService.getCustomerByID(result.idcustomers).then(result1 => {
					result['customer'] = result1[0]?.firstName;
					this.packagesService.getPackagesByOrderID(result.idorders).then(packages => {
						this.packages = packages;
						result['items'] = this.packages.length;
						this.dataSource = new MatTableDataSource(this.openOrders);
						this.setDataSourceAttributes();
						this.changeDetectorRefs.detectChanges();
					})

				})
				if (result.status == '0') {
					this.pending++;
					this.openOrders.push(result);
				}
				else if (result.status == '1') {
					this.inProgress++;
					this.openOrders.push(result);

				}
				else if (result.status == '2') {
					this.completed++;
					this.closedOrders.push(result);
				}
				else if (result.status == '3') {
					this.cancelled++;
					this.closedOrders.push(result);
				}
				this.total = this.openOrders.length;

			})


		})
	}


	onPaginateChange(event) {
		this.pageIndex = event.pageIndex;
		this.length = event.pageSize;
	}

	setDataSourceAttributes() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;

	}
	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

		this.dataSource.filterPredicate = function (data, filter: string): boolean {
			console.log(data, filter);
			Object.keys(data).forEach(key => {
				if (data[key] == null || data[key] == undefined) {
					data[key] = '';
				}
			})
			return (data.customer.trim().toLowerCase().indexOf(filterValue) !== -1) ||
				(data.billing.trim().toLowerCase().indexOf(filterValue) !== -1) ||
				(data.deliveryAddressNote.trim().toLowerCase().indexOf(filterValue) !== -1) ||
				(data.deliveryName.trim().toLowerCase().indexOf(filterValue) !== -1) ||
				(data.deliveryPhone.trim().toLowerCase().indexOf(filterValue) !== -1) ||
				(data.pickUpAddress.trim().toLowerCase().indexOf(filterValue) !== -1) ||
				(data.idorders.toString().trim().toLowerCase().indexOf(filterValue) !== -1) ||
				(data.pickupAddressNote.trim().toLowerCase().indexOf(filterValue) !== -1);
		};
		this.dataSource.filter = filterValue;
	}
	packageView(order) {
		console.log(order);
		this.packagesService.getPackagesByOrderID(order.idorders).then(result => {
			result[0].customer = order.customer;
			let naviagtionExtras: NavigationExtras = {
				queryParams: result[0]
			}
			this.router.navigate(['ecommerce/package/view'], naviagtionExtras);
		})

	}
	orderView(order) {
		// const dialogRef = this.dialog.open(OrderEditComponent, { data: { order: order } });
		let naviagtionExtras: NavigationExtras = {
			queryParams: order
		}
		this.router.navigate(['ecommerce/orders/edit'], naviagtionExtras);
	}

	menuChange(event) {
		this.title = event.target.outerText;
		if (this.title == "Open Orders") {
			this.openFlag = 1;
			this.dataSource = new MatTableDataSource(this.openOrders);
			this.setDataSourceAttributes();
			this.total = this.openOrders.length;
			this.displayedColumns = ['check', 'id', 'date', 'customer', 'items', 'cost', 'billing', 'status'];
		}
		else if (this.title == "Closed Orders") {
			this.openFlag = 2;
			this.dataSource = new MatTableDataSource(this.closedOrders);
			this.setDataSourceAttributes();
			this.total = this.closedOrders.length;
			this.displayedColumns = ['id', 'date', 'customer', 'items', 'cost', 'billing', 'status'];

		}
		else {
			this.openFlag = 0;
			this.dataSource = new MatTableDataSource(this.orders);
			this.setDataSourceAttributes();
			this.total = this.orders.length;
			this.displayedColumns = ['id', 'date', 'customer', 'items', 'cost', 'billing', 'status'];

		}
	}
	newOrder() {
		// const dialogRef = this.dialog.open(OrderEditComponent, { data: {} });
		// let naviagtionExtras: NavigationExtras = {
		// 	queryParams: customer
		//   }
		this.router.navigate(['ecommerce/orders/edit']);
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row));
	}

	selfToggle(_package) {
		this.selection.toggle(_package)
		if (this.selection.selected.length == 0) {
			this.checkedFlag = false;
		}
		else {
			this.checkedFlag = true;
		}
	}

	assignPackage() {
		console.log(this.selection.selected);
		const dialogRef = this.dialog.open(AssignOrderComponentComponent, { data: this.selection.selected });
		dialogRef.afterClosed().subscribe(result => {
			this.ngOnInit();
		})
	}

}
