import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewRef } from '@angular/core';
import { FakeApiService } from '../../../../../core/_base/layout/server/fake-api/fake-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, NavigationExtras } from '@angular/router';
import { OrdersService } from 'src/app/service/orders.service';
import { CustomerService } from 'src/app/service/customer.service';
import { PackagesService } from 'src/app/service/packages.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AssignPackageComponent } from './assign-package/assign-package.component';
@Component({
	selector: 'kt-package',
	templateUrl: './package.component.html',
	styleUrls: ['./package.component.scss']
})
export class PackageComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
		// this.setDataSourceAttributes();
	}

	dataSource: MatTableDataSource<any>;
	total: number;
	bodega: number;
	porEntregar: number;
	porRecoger: number;
	recogido: number;

	pageIndex: number = 0;
	length: number = 10;

	displayedColumns = ['check', 'tracking', 'date', 'customer', 'weight', 'assignedTo', 'status'];
	selection = new SelectionModel<any>(true, []);
	packages: any;
	checkedFlag;
	constructor(private fakeApi: FakeApiService,
		private router: Router,
		private customerService: CustomerService,
		private ordersService: OrdersService,
		private packagesService: PackagesService,
		private changeDetectorRefs: ChangeDetectorRef,
		public dialog: MatDialog,

	) { }

	ngOnInit(): void {
		this.checkedFlag = false;
		this.total = 0;
		this.bodega = 0;
		this.porEntregar = 0;
		this.porRecoger = 0;
		this.recogido = 0;
		this.packagesService.getAllPackages().then(async result => {
			this.packages = result;
			this.packages = this.packages.reverse();

			await this.packages.map(async result => {
				this.ordersService.getOrderByID(result.idorders).then(async results => {
					result.orderStatus = results[0].status;
					await this.packagesService.getCustomerByorderID(result.idorders).then(async results => {
						result.customer = results[0].firstName;
						await this.packagesService.getMessengerByorderID(result.idorders).then(results => {
							result.assignedTo = results[0]?.name;
							this.dataSource = new MatTableDataSource(this.packages);
							if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
								!(this.changeDetectorRefs as ViewRef).destroyed) {
								this.changeDetectorRefs.detectChanges();
							}
							this.setDataSourceAttributes();
						});
					});
				});

				if (result.status == 0) { this.porRecoger++ }
				if (result.status == 1) { this.recogido++ }
				if (result.status == 2) { this.bodega++ }
				if (result.status == 3) { this.porEntregar++ }
			})
			this.total = this.packages.length;


		})
	}

	onPaginateChange(event) {
		this.pageIndex = event.pageIndex;
		this.length = event.pageSize;
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
		const dialogRef = this.dialog.open(AssignPackageComponent, { data: this.selection.selected });
		dialogRef.afterClosed().subscribe(result => {
			this.ngOnInit();
		})
	}

	setDataSourceAttributes() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}
	packageView(_package) {
		console.log(_package);
		let naviagtionExtras: NavigationExtras = {
			queryParams: _package
		}
		this.router.navigate(['ecommerce/package/view'], naviagtionExtras);
	}
	scan(str) {

		let naviagtionExtras: NavigationExtras = {
			queryParams: { flag: str }
		}
		this.router.navigate(['ecommerce/package/scan'], naviagtionExtras);

	}
}
