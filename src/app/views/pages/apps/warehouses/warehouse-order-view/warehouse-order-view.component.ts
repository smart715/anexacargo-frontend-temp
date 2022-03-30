import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { OrdersService } from 'src/app/service/orders.service';
import { StateAreaService } from 'src/app/service/state-area.service';
import { PackagesService } from 'src/app/service/packages.service';
import { PackageTypeService } from 'src/app/service/package-type.service';
import { CustomerService } from 'src/app/service/customer.service';
import { result } from 'lodash';
import { MessengerService } from 'src/app/service/messenger.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { CourierService } from 'src/app/service/courier.service';
import { WarehouseOrderService } from 'src/app/service/warehouse-order.service';


@Component({
  selector: 'kt-warehouse-order-view',
  templateUrl: './warehouse-order-view.component.html',
  styleUrls: ['./warehouse-order-view.component.scss']
})
export class WarehouseOrderViewComponent implements OnInit {
	@ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
	dataSourceLog: MatTableDataSource<any>;
  
	displayedColumns = ['tracking','warehouse','weight','volWeight','length', 'width', 'height', 'typeName', 'status'];
	displayedColumnsLog = ['date','description','user'];

  warehouseOrder;
  customer;
  mapLink;
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
    public warehouseService: WarehouseService,
    private courierService: CourierService,
    private warehouseOrderService: WarehouseOrderService,

    
    
		private changeDetectorRefs: ChangeDetectorRef,
    
    ) { }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this.warehouseOrder = JSON.parse(JSON.stringify(params));
      this.mapLink =  "http://maps.google.com/maps?z=12&t=m&q=loc:"+ this.warehouseOrder.lat +"+" + this.warehouseOrder.lng;
    });
    this.customerService.getCustomerByID(this.warehouseOrder.idcustomers).then(result => {
      this.customer = result[0];
      this.warehouseService.getWarehousesByOrderID(this.warehouseOrder.idwarehouseOrder).then((warehouses:any) => {
        console.log(warehouses);
        warehouses.map(warehouse => {
          warehouse.volWeight = (Number(warehouse?.length) * Number(warehouse?.height) * Number(warehouse?.width) / 166).toFixed(2);
          this.courierService.getCourierByID(warehouse.idcourier).then(result => {
            if (result[0].location == '0') {
              warehouse.typeName = "China";
            }
            else {
              if (result[0].type == '0') {
                warehouse.typeName = 'Air';
              }
              else {
                warehouse.typeName = 'Maritime';

              }
            };
          })
        })
        this.dataSource = new MatTableDataSource(warehouses);
        this.changeDetectorRefs.detectChanges();
      })
    })
  }

  goToMap(){
    window.open(this.mapLink, "_blank");
  }

  menuChange(event){
    console.log(event.target.outerText);
    var title = event.target.outerText
    if(window.confirm("Are you be sure to change order status?")){
      var idmessenger = window.localStorage.getItem('userID');

      if ( title == "Pendding" ) {
        this.warehouseOrderService.setWarehouseOrderStatus(this.warehouseOrder.idwarehouseOrder, '0', idmessenger).then(result => {
          console.log(result);
          this.warehouseOrder.status = '0';
          this.changeDetectorRefs.detectChanges();
        })
      }
      else if ( title == "In progress" ) {
        this.warehouseOrderService.setWarehouseOrderStatus(this.warehouseOrder.idwarehouseOrder, '1', idmessenger).then(result => {
          console.log(result);
          this.warehouseOrder.status = '1';
          this.changeDetectorRefs.detectChanges();

        })
      }
      else if ( title == "Completed" ) {
        this.warehouseOrderService.setWarehouseOrderStatus(this.warehouseOrder.idwarehouseOrder, '2', idmessenger).then(result => {
          this.warehouseOrder.status = '2';
          console.log(result);
          this.changeDetectorRefs.detectChanges();

        })
      }
      else if ( title == "Cancelled" ) {
        this.warehouseOrderService.setWarehouseOrderStatus(this.warehouseOrder.idwarehouseOrder, '3', idmessenger).then(result => {
          this.warehouseOrder.status = '3';
          this.changeDetectorRefs.detectChanges();

          console.log(result);
        })
      }
      window.alert("Successfully changed");
    }
  }



}
