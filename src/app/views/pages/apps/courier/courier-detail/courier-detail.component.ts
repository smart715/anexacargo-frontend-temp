import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PackagesService } from 'src/app/service/packages.service';
import { WarehouseOrderService } from 'src/app/service/warehouse-order.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'kt-courier-detail',
  templateUrl: './courier-detail.component.html',
  styleUrls: ['./courier-detail.component.scss']
})
export class CourierDetailComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  // displayedColumns = ['weight', 'volWeight', 'length', 'width', 'height', 'tracking'];
	displayedColumns = ['tracking','warehouse','weight','volWeight','length', 'width', 'height'];

  order;
  warehouses;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private warehouseOrderService: WarehouseOrderService,
    private warehouseService: WarehouseService,
    private customerService: CustomerService,

		private changeDetectorRefs: ChangeDetectorRef,
    ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.order = JSON.parse(JSON.stringify(params));
      console.log(this.order);
    });
    this.warehouseService.getWarehousesByOrderID(this.order.idwarehouseOrder).then((warehouses:any) => {
      var price = 0;
      this.warehouses = warehouses;
      console.log(warehouses);
      warehouses.forEach(warehouse => {
        warehouse.volWeight = (Number(warehouse?.length) * Number(warehouse?.height) * Number(warehouse?.width) / 166).toFixed(2);
        price = price + parseFloat(warehouse.price);
      });
      this.order.serviceCost = price.toFixed(2);
      this.order.deliveryCost = parseFloat(this.order.deliveryCost).toFixed(2);
      this.changeDetectorRefs.detectChanges();
      this.customerService.getCustomerByID(this.order.idcustomers).then(customer => {
        this.order.name = customer[0].firstName;
        this.order.mobile = customer[0].mobile;
        this.changeDetectorRefs.detectChanges();
      });
        this.dataSource = new MatTableDataSource(this.warehouses);
        this.changeDetectorRefs.detectChanges();
    });

    // this.packagesService.getPackagesByOrderID(this.order.idorders).then(packages => {
    //   this.packages = packages;
    //   this.packages.map(pkg => {
    //     var len = 6 - pkg.idpackages.toString().length;
    //     var tmpString = 'H';
    //     for (var i = 0; i < len; i ++) {
    //       tmpString = tmpString + '0'
    //     }
    //     pkg.tracking = tmpString + pkg.idpackages;
    //     pkg.volWeight = (Number(pkg.length) * Number(pkg.length) * Number(pkg.length)/5000).toFixed(2);
    //     this.dataSource = new MatTableDataSource(this.packages);
    //     this.changeDetectorRefs.detectChanges();

    //   })
    // })

  }
  back() {
    this.router.navigate(['courier']);
  }
  edit() {
    let naviagtionExtras: NavigationExtras = {
      queryParams: this.order
    }
    this.router.navigate(['courier/edit'], naviagtionExtras);
  }
  // status() {
  //   if (window.confirm("Are you going to update information?")) {
  //     this.packages.map(_package => {
  //       var idmessenger = window.localStorage.getItem('userID');
  //       this.packagesService.setPackageStatus(_package, '1', idmessenger).then(result => {
  //       })
  //     })
  //     this.router.navigate(['courier']);
  //   }
  // }
  final() {
    let naviagtionExtras: NavigationExtras = {
      queryParams: this.order
    }
    this.router.navigate(['courier/final'], naviagtionExtras);
  }
}
