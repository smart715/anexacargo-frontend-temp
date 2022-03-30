import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PackageModalComponent } from './../modal/package-modal/package-modal.component';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { OrdersService } from 'src/app/service/orders.service';
import { StateAreaService } from 'src/app/service/state-area.service';
import { PackagesService } from 'src/app/service/packages.service';
import { PackageTypeService } from 'src/app/service/package-type.service';
import { PrintLabelComponent } from './print-label/print-label.component';
import { CustomerService } from 'src/app/service/customer.service';
import { result } from 'lodash';
import { MessengerService } from 'src/app/service/messenger.service';


@Component({
  selector: 'kt-package-view',
  templateUrl: './package-view.component.html',
  styleUrls: ['./package-view.component.scss']
})
export class PackageViewComponent implements OnInit {
	@ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
	dataSourceLog: MatTableDataSource<any>;
  
	displayedColumns = ['tracking','weight','volWeight','length', 'width', 'height', 'typeName', 'status', 'log'];
	displayedColumnsLog = ['date','description','user'];

  _package;
  packages : any = [];
  order;
  tempResult;
  tempArea;
  constructor(
    public dialog: MatDialog,
		private route: ActivatedRoute,
		private ordersService: OrdersService,
    private stateAreaService: StateAreaService,
    private packagesService: PackagesService,
		private packageTypeService: PackageTypeService,
		private router: Router,
		private customerService: CustomerService,
    public messengerService: MessengerService,
    
    
		private changeDetectorRefs: ChangeDetectorRef,
    
    ) { }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this._package = params;
    });
    console.log("package",this._package);
    await this.ordersService.getOrderByID(this._package.idorders).then(order => {
      this.order = order[0];
      console.log("order",this.order);
      this.stateAreaService.getStateByID(this.order.deliveryAddressState).then(result => {
        this.tempResult = result[0];
        this.order.deliveryStateName = this.tempResult.name;
        this.stateAreaService.getAreaByID(this.order.deliveryAddressArea).then(result => {
          this.tempArea = result[0];
          this.order.deliveryAreaName = this.tempArea.name;
          this.packagesService.getPackagesByOrderID(this.order.idorders).then(packages => {
            this.packages = packages;
            console.log("this.packages",this.packages);
            this.packages.map(pkg => {
					    pkg.orderStatus = this.order.status;

              var len = 6 - pkg.idpackages.toString().length;
              var tmpString = 'H';
              for (var i = 0; i < len; i ++) {
                tmpString = tmpString + '0'
              }
              pkg.tracking = tmpString + pkg.idpackages;
              pkg.volWeight = Number(pkg.length)*Number(pkg.height)*Number(pkg.width)/166;
              pkg.volWeight = pkg.volWeight.toFixed(2);
              console.log("pkg.volWeight", pkg.volWeight);
              this.packageTypeService.getPackageTypeByID(pkg.type).then(typeName => {
                pkg.typeName = typeName[0]?.name;
                console.log("pkg.typeName", pkg.typeName);
                this.dataSource = new MatTableDataSource(this.packages);
                this.changeDetectorRefs.detectChanges();
              })
            })

          })
        })
      })
    })
    await this.ordersService.getOrderLog(this._package.idorders).then(logs => {
      this.logs = logs;
      this.logs.map(log => {
        this.messengerService.getMessengerByID(log.idmessengers).then(result => {
          log.user = result[0].name;
          if(log.status == '0'){
            log.description = 'Order Pending';
          }
          else if(log.status == '1'){
            log.description = 'Order in Progress';
          }
          else if(log.status == '2'){
            log.description = 'Order Completed';
          }
          else if(log.status == '3'){
            log.description = 'Order Cancelled';
          }
          this.dataSourceLog = new MatTableDataSource(this.logs);
        })
      })
    })
    
  }
  log(pack){
		const dialogRef = this.dialog.open(PackageModalComponent, { data: { pack } });

  }
  print(pack){
		const dialogRef = this.dialog.open(PrintLabelComponent, { data: { pack } });

  }
  menuChange(event){
    console.log(event.target.outerText);
    var title = event.target.outerText
    if(window.confirm("Are you be sure to change order status?")){
      var idmessenger = window.localStorage.getItem('userID');

      if ( title == "Pendding" ) {
        this.ordersService.setOrderStatus(this._package.idorders, '0', idmessenger).then(result => {
          console.log(result);
          this.ngOnInit();
        })
      }
      else if ( title == "In progress" ) {
        this.ordersService.setOrderStatus(this._package.idorders, '1', idmessenger).then(result => {
          console.log(result);
          this.ngOnInit();
        })
      }
      else if ( title == "Completed" ) {
        this.ordersService.setOrderStatus(this._package.idorders, '2', idmessenger).then(result => {
          console.log(result);
          this.ngOnInit();
        })
      }
      else if ( title == "Cancelled" ) {
        this.ordersService.setOrderStatus(this._package.idorders, '3', idmessenger).then(result => {
          console.log(result);
          this.ngOnInit();
        })
      }
      window.alert("Successfully changed");
    }
  }

  // menuChange(event) {
  //   if(window.confirm("Are you be sure to change invoice status?")){
  //     if (this.title == "OPEN") {
  //       this.buttonStyle = { 'color': '#3699FF', 'background-color': '#cbe2fe' };
  //       console.log("OPEN")
  //       this.invoiceService.changeInvoiceStatus(this.invoice, '0').then(result => {
  //         console.log(result);
  //       })
  //     }
  //     else {
  //       this.buttonStyle = { 'color': '#1bc5bd', 'background-color': '#c9f7f5' };
  //       console.log("Partial")
  //       this.invoiceService.changeInvoiceStatus(this.invoice, '1').then(result => {
  //         console.log(result);
  //       })
  //     }
  //     window.alert("Successfully changed");
  //     this.title = event.target.outerText;
  //   }
  // }
  edit(){
    this.customerService.getCustomerByID(this.order.idcustomers).then(result => {
      this.order.customer = result[0].firstName + " " + result[0].lastName;
      let naviagtionExtras: NavigationExtras = {
        queryParams: this.order
      }
      this.router.navigate(['ecommerce/orders/edit'], naviagtionExtras);
    })

  }




  logs: any = [
    {
      id: 1,
      date: '02/02/20 14:28pm',
      description: 'Order Completed',
      user: 'Mruiz',
    },
    {
      id: 2,
      date: '02/02/20 14:28pm',
      description: 'Order Completed',
      user: 'Mruiz',
    },
    {
      id: 3,
      date: '02/02/20 14:28pm',
      description: 'Order Completed',
      user: 'Mruiz',
    },
    {
      id: 4,
      date: '02/02/20 14:28pm',
      description: 'Order Completed',
      user: 'Mruiz',
    }

  ];
}
