import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from 'src/app/service/orders.service';
import { CustomerService } from 'src/app/service/customer.service';
import { PackagesService } from 'src/app/service/packages.service';
import { SelectionModel } from '@angular/cdk/collections';
import { WarehouseOrderService } from 'src/app/service/warehouse-order.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import promise from 'src/assets/plugins/formvalidation/src/js/validators/promise';

@Component({
	selector: 'kt-warehouse-order-list',
	templateUrl: './warehouse-order-list.component.html',
	styleUrls: ['./warehouse-order-list.component.scss']
})
export class WarehouseOrderListComponent implements OnInit {
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
	completed: number;
	cancelled: number;

	displayedColumns = ['id', 'date', 'customer', 'items', 'serviceCost', 'deliveryCost', 'status'];

	warehouseOrders: any;

	constructor(
		private router: Router,
		public dialog: MatDialog,
		private customerService: CustomerService,
		private changeDetectorRefs: ChangeDetectorRef,
		private warehouseOrderService: WarehouseOrderService,
		private warehouseService: WarehouseService,



	) { }

	async ngOnInit(): Promise<void> {
		this.pending = 0;
		this.inProgress = 0;
		this.completed = 0;
		this.cancelled = 0;
		this.total = 0;
		this.warehouseOrderService.getAllWarehouseOrder().then(result => {
			this.warehouseOrders = result;
			this.total = this.warehouseOrders.length;
			this.warehouseOrders.map(warehouseOrder => {
				console.log(111, warehouseOrder.deliveryCost);
				var deliveryCost = Number(warehouseOrder.deliveryCost).toFixed(2);
				warehouseOrder.deliveryCost = deliveryCost;
				this.warehouseService.getWarehousesByOrderID(warehouseOrder.idwarehouseOrder).then((warehouses: any) => {
					warehouseOrder.items = warehouses.length;
					var serviceCost = 0;
					const calcServiceCost = async () => {
						return Promise.all(warehouses.map(warehouse => {
							serviceCost = Number(serviceCost) + Number(warehouse.price);
						}))
					}
					calcServiceCost().then(result => {
						warehouseOrder.serviceCost = serviceCost.toFixed(2);
						this.customerService.getCustomerByID(warehouseOrder.idcustomers).then(result => {
							warehouseOrder.customer = result[0] ? result[0].firstName : '' + " " + result[0] ? result[0]?.lastName : '';
							this.dataSource = new MatTableDataSource(this.warehouseOrders);
							this.setDataSourceAttributes();
							// this.changeDetectorRefs.detectChanges();
							if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
								!(this.changeDetectorRefs as ViewRef).destroyed) {
								this.changeDetectorRefs.detectChanges();
							}
						})
					})
				})
			})
			console.log(result);
		});

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
			return (data.customer.trim().toLowerCase().indexOf(filterValue) !== -1)
		};
		this.dataSource.filter = filterValue;
	}
	orderView(order) {
		console.log(order);
		let naviagtionExtras: NavigationExtras = {
			queryParams: order
		}
		this.router.navigate(['warehouse/order/view'], naviagtionExtras);
	}
	// orderView(order) {
	// 	let naviagtionExtras: NavigationExtras = {
	// 		queryParams: order
	// 	}
	// 	this.router.navigate(['ecommerce/orders/edit'], naviagtionExtras);
	// }


}

