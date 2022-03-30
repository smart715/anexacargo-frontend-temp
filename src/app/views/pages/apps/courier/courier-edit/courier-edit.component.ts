import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PackagesService } from 'src/app/service/packages.service';
import { StateAreaService } from 'src/app/service/state-area.service';
import { OrdersService } from 'src/app/service/orders.service';
import { PackageTypeService } from 'src/app/service/package-type.service';
import { PriceService } from 'src/app/service/price.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'kt-courier-edit',
  templateUrl: './courier-edit.component.html',
  styleUrls: ['./courier-edit.component.scss']
})
export class CourierEditComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private packagesService: PackagesService,
    private stateAreaService: StateAreaService,
    private ordersService: OrdersService,
    private packageTypeService: PackageTypeService,
    private priceService: PriceService,
		private customerService: CustomerService,
		private changeDetectorRefs: ChangeDetectorRef,
    
    

  ) { }
  order;
  totalPrice;

  packages;
  states;
  areas;
  deliveryArea;
  deliveryState;
  tempResult;
  packageTypes;
  customerGroup;

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.order = JSON.parse(JSON.stringify(params));

      console.log(this.order);
      this.deliveryState = this.order.deliveryAddressState;
      this.deliveryArea = this.order.deliveryAddressArea;

    });
    this.customerService.getCustomerByID(this.order.idcustomers).then((result:any) => {
      this.customerGroup = result[0].customerGroup;
      console.log(this.customerGroup);
      this.packageTypeService.getAllPackageTypes().then(result => {
        this.packageTypes  = result;
        console.log(this.packageTypes);
        this.packageTypes.map(packageType => {
          packageType.idpackageType = packageType.idpackageType.toString();
        })
        this.packagesService.getPackagesByOrderID(this.order.idorders).then(result => {
          this.packages = result;
          this.stateAreaService.getAllStates().then(result => {
            this.states = result;
            this.states.map(state => {
              state.idstates = state.idstates.toString();
            })
            this.stateAreaService.getAreasByStatesID(this.order.deliveryAddressState).then(result => {
              this.areas = result;
              this.areas.map(area => {
                area.idareas = area.idareas.toString();
              })
            });
          });
        });
      })
    })



  }
  onStateChange(state) {
    this.stateAreaService.getAreasByStatesID(state.idstates).then(result => {
      this.areas = result;
      this.areas.map(area => {
        area.idareas = area.idareas.toString();
      })
      this.deliveryArea = this.areas[0].idareas
    });
  }
  back() {
    this.router.navigate(['courier']);
  }
  async save() {
    if (window.confirm("Are you going to update information?")) {
      var idorders = this.order.idorders;
      var deliveryAddress = { deliveryState: this.deliveryState, deliveryArea: this.deliveryArea }
      await this.ordersService.editOrderdeliveryCostByID(idorders, deliveryAddress, this.order.cost).then(result => {
        this.tempResult = result;
        if (this.tempResult.status == 'error') {
          window.alert("error occured!")
        }
        else {
          this.packages.map(_package => {
            this.packagesService.updatePackage(_package).then(result => {
            })
          })
          window.alert("successfully updated!")
        }
      });
      this.router.navigate(['courier']);

    }
  }

  calcPrice(){
    var pickUpAreaPrice : any;
		var deliveryAreaPrice : any;
    console.log(this.packages, this.deliveryArea, this.customerGroup, this.order);
    this.priceService.getPrice(this.customerGroup, this.deliveryArea, this.packages[0].type).then((result:any) => {
      deliveryAreaPrice = result[0];
      this.priceService.getPrice(this.customerGroup, this.order.pickUpAddressArea, this.packages[0].type).then((result:any) => {
        pickUpAreaPrice = result[0];
        

        var rWeight = 0;
        var vWeight = 0;
        var pickUpPrice = 0;
        var deliveryPrice = 0;
        this.totalPrice = 0;



        console.log(rWeight, vWeight);


        this.packages.map(_package => {
          rWeight = rWeight + Number(_package.weight);
          vWeight = vWeight + Number(_package.height)*Number(_package.width)*Number(_package.length)/166;
        })

        if(rWeight > vWeight){
          if(rWeight < 5){
            deliveryPrice = Number(deliveryAreaPrice.basePrice);
            console.log(pickUpPrice, deliveryPrice);

          }
          else {
            deliveryPrice = Number(deliveryAreaPrice.basePrice) + (rWeight - 5) * Number(deliveryAreaPrice.extraRW);
            console.log(pickUpPrice, deliveryPrice);

          }
        }
        else {
          if(vWeight < 5){
            deliveryPrice = Number(deliveryAreaPrice.basePrice);
            console.log(pickUpPrice, deliveryPrice);

          }
          else {
            deliveryPrice = Number(deliveryAreaPrice.basePrice) + (vWeight - 5) * Number(deliveryAreaPrice.extraRV);
            console.log(pickUpPrice, deliveryPrice);

          }
        }

        if(this.order.deliveryType == '0'){
          this.totalPrice = deliveryPrice;
        }
        else {
          pickUpPrice = Number(pickUpAreaPrice.pickup);
          this.totalPrice = deliveryPrice + pickUpPrice;
        }
        if(Number.isNaN(this.totalPrice)){
          this.totalPrice = 0;
          this.totalPrice = this.totalPrice.toFixed(2);
        }
        else {
          this.totalPrice = this.totalPrice.toFixed(2);
        }
        console.log(this.totalPrice);
        this.order.cost = this.totalPrice;
        this.changeDetectorRefs.detectChanges();




      })
    })
  }
}
