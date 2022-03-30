import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { StateAreaService } from 'src/app/service/state-area.service';
import { OrdersService } from 'src/app/service/orders.service';
import { PackagesService } from 'src/app/service/packages.service';
import { PackageTypeService } from 'src/app/service/package-type.service';

import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { PriceService } from 'src/app/service/price.service';

@Component({
  selector: 'kt-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss']
})
export class OrderCreateComponent implements OnInit {
  pickUpAddressForm: FormGroup;
  deliveryAddressForm: FormGroup;
  packageForm: FormGroup;







  typeOfService: boolean;
  weightType: string;
  lengthType: string;
  states;
  pickUpAreas;
  deliveryAreas;


  pickUpAddress;
  pickUpState;
  pickUpArea;

  deliveryAddress;
  deliveryState;
  deliveryArea;

  deliveryName;
  deliveryPhone;

  packages = [];
  packageTypes;
  order: any = {};

  totalPrice;

  tempResult;

  idcustomers;

  deliveryNoteFlag;
  pickUpNoteFlag;
  customerGroup;
  constructor(
    private stateAreaService: StateAreaService,
    private ordersService: OrdersService,
    private packagesService: PackagesService,
    private packageTypeService: PackageTypeService,
		private priceService: PriceService,

    private router: Router,
		private fb: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
    private el: ElementRef,
  ) { }

  ngOnInit(): void {
    if(window.localStorage.getItem('customerGroup')){
      this.customerGroup = window.localStorage.getItem('customerGroup');
    }
    else {
      this.customerGroup = '1';
    }
    console.log(this.customerGroup);
    this.deliveryNoteFlag = false;
    this.pickUpNoteFlag = false;
    this.deliveryAddressForm = this.fb.group({
			deliveryAddress: ['', Validators.required],
			deliveryAddressState: ['', Validators.required],
			deliveryAddressArea: ['', Validators.required],
			deliveryName: ['', Validators.required],
      deliveryPhone: ['', Validators.required],
      deliveryAddressNote: ['']
    });
    this.pickUpAddressForm = this.fb.group({
			pickUpAddress: ['', Validators.required],
			pickUpAddressState: ['', Validators.required],
      pickUpAddressArea: ['', Validators.required],
      pickupAddressNote: ['']
    });
    this.packageForm = this.fb.group({
      packages: this.fb.array([]) 
    });

    const add = this.packageForm.get('packages') as FormArray;
    add.push(this.fb.group({
      weight: ['', Validators.required],
      length: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
      type: ['', Validators.required],
    }))

    this.stateAreaService.getAllStates().then(result => {
      this.tempResult = result;
      this.states = [];
      this.tempResult.map((state, index)=> {
        if(state.status == '0'){
          this.states.push(state);
        }
        this.changeDetectorRefs.detectChanges();

      })

      this.packageTypeService.getAllPackageTypes().then(result => {
        this.packageTypes  = result;
        console.log(this.packageTypes);

      })
    });
    this.weightType = 'kg';
    this.lengthType = 'cm';

    this.typeOfService = false;
    this.totalPrice = 0;
    this.totalPrice = Number(this.totalPrice).toFixed(2);
  }

  getControls() {
    return (this.packageForm.get('packages') as FormArray).controls;
  }

  serviceType(str) {
    if (str == '1') {
      this.typeOfService = true;
    }
    else {
      this.typeOfService = false;
    }
    this.calcPrice();
  }
  changeWeightType(str) {
    this.weightType = str;
  }
  changelengthType(str) {
    this.lengthType = str;
  }
  onStateChange(state, str) {

    if (str == 'p') {
      this.stateAreaService.getAreasByStatesID(state.idstates).then(result => {
        this.tempResult = result;
        this.pickUpAreas = [];
        this.tempResult.map((area, index)=> {
          if(area.status == '0'){
            this.pickUpAreas.push(area);
          }
          this.changeDetectorRefs.detectChanges();
  
        })
        // this.pickUpAreas = result;
      });
      this.pickUpState = state;
      this.pickUpAddress = this.pickUpState.name;
    }
    else {
      this.stateAreaService.getAreasByStatesID(state.idstates).then(result => {
        this.tempResult = result;
        this.deliveryAreas = [];
        this.tempResult.map((area, index)=> {
          if(area.status == '0'){
            this.deliveryAreas.push(area);
          }
          this.changeDetectorRefs.detectChanges();
  
        })
        // this.deliveryAreas = result;
      });
      this.deliveryState = state;
      this.deliveryAddress = this.deliveryState.name;
    }
  }

  addPackage() {
    if (this.packageForm.invalid){
      return;
    }
    else {
      const add = this.packageForm.get('packages') as FormArray;
      add.push(this.fb.group({
        weight: ['', Validators.required],
        length: ['', Validators.required],
        width: ['', Validators.required],
        height: ['', Validators.required],
        type: ['', Validators.required],
      }))
    }
  }

  deletePackage(index: number) {
    console.log(index);
    const add = this.packageForm.get('packages') as FormArray;
    add.removeAt(index)
  }

  processOrder(){

    console.log("this.weightType",this.weightType);
    console.log("this.lengthType",this.lengthType);
    this.order.deliveryAddressNote = this.deliveryAddressForm.value.deliveryAddressNote;
    this.order.pickupAddressNote = this.pickUpAddressForm.value.pickupAddressNote;

    this.idcustomers = window.localStorage.getItem("idcustomers");
    if(this.typeOfService){
      if(this.deliveryAddressForm.valid && this.packageForm.valid){
        const now = (new Date().getMonth() + 1).toString() + '/' + new Date().getDate().toString() + '/' + new Date().getFullYear().toString();
        this.order.date = now;
        this.order.deliveryAddressState = this.deliveryAddressForm.value.deliveryAddressState;
        this.order.deliveryAddressArea = this.deliveryAddressForm.value.deliveryAddressArea;
        this.order.deliveryAddress = this.deliveryAddressForm.value.deliveryAddress;
        this.order.deliveryName = this.deliveryAddressForm.value.deliveryName;
        this.order.deliveryPhone = this.deliveryAddressForm.value.deliveryPhone;
        this.order.pickUpAddressState = '';
        this.order.pickUpAddressArea = '';
        this.order.pickUpAddress = '';

        this.order.cost = this.totalPrice;
        this.order.idcustomers = this.idcustomers;
        this.order.deliveryType = '0';
      }
      else{
        for (const key of Object.keys(this.deliveryAddressForm.controls)) {
          if (this.deliveryAddressForm.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
         }
        }
        console.log((this.packageForm.get('packages') as FormArray).controls[0]);
        var packageFormGroup = (this.packageForm.get('packages') as FormArray).controls[0] as FormGroup;
        for (const key of Object.keys(packageFormGroup.controls)) {
          if (packageFormGroup.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
         }
        }
        return;
      }
    }
    else{
      if(this.deliveryAddressForm.valid && this.pickUpAddressForm.valid && this.packageForm.valid){
        const now = (new Date().getMonth() + 1).toString() + '/' + new Date().getDate().toString() + '/' + new Date().getFullYear().toString();
        this.order.date = now;
        this.order.pickUpAddressState = this.pickUpAddressForm.value.pickUpAddressState;
        this.order.pickUpAddressArea = this.pickUpAddressForm.value.pickUpAddressArea;
        this.order.deliveryAddressState = this.deliveryAddressForm.value.deliveryAddressState;
        this.order.deliveryAddressArea = this.deliveryAddressForm.value.deliveryAddressArea;
        this.order.deliveryAddress = this.deliveryAddressForm.value.deliveryAddress;
        this.order.pickUpAddress = this.pickUpAddressForm.value.pickUpAddress;
        this.order.deliveryName = this.deliveryAddressForm.value.deliveryName;
        this.order.deliveryPhone = this.deliveryAddressForm.value.deliveryPhone;
        this.order.cost = this.totalPrice;
        this.order.idcustomers = this.idcustomers;
        this.order.deliveryType = '1';
      }
      else{
        for (const key of Object.keys(this.deliveryAddressForm.controls)) {
          if (this.deliveryAddressForm.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
         }
        }
        for (const key of Object.keys(this.pickUpAddressForm.controls)) {
          if (this.pickUpAddressForm.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
         }
        }
        console.log((this.packageForm.get('packages') as FormArray).controls[0]);
        var packageFormGroup = (this.packageForm.get('packages') as FormArray).controls[0] as FormGroup;
        for (const key of Object.keys(packageFormGroup.controls)) {
          if (packageFormGroup.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
         }
        }
        return;
      }
    }
    this.packages = this.packageForm.value.packages;
    console.log("this.order",this.order);
    console.log("this.packages",this.packages);
    this.ordersService.createNewOrder(this.order).then(async result => {
      this.tempResult = result;
      if (this.tempResult.insertId) {
        await this.packages.map(result => {
          result.idorders = this.tempResult.insertId;
          result.weightUnit = this.weightType;
          result.lengthUnit = this.lengthType;
          if (this.order.deliveryType == '0') {
            result.status = '2'
          }
          else {
            result.status = '0'
          }
          this.packagesService.createNewPackage(result).then(result => {
            this.router.navigate(['orders/myOrder']); // Main page
          }).catch(err => {
            window.alert("error occured")
          })
        })
        window.alert("successfully created, (dummy comments by admin)")

      }
      else {
        window.alert("error occured")
      }
    })
  }

  calcPrice(){
    var pickUpAreaPrice : any;
		var deliveryAreaPrice : any;
    if(
      // this.pickUpAddressForm.value.pickUpAddressArea != null && this.pickUpAddressForm.value.pickUpAddressArea != undefined && this.pickUpAddressForm.value.pickUpAddressArea != ""    &&
 this.deliveryAddressForm.value.deliveryAddressArea != null && this.deliveryAddressForm.value.deliveryAddressArea != undefined && this.deliveryAddressForm.value.deliveryAddressArea != ""
    && this.packageForm.value.packages[0].type != null && this.packageForm.value.packages[0].type != undefined && this.packageForm.value.packages[0].type != ''
    ) {
      console.log(this.customerGroup);
      console.log(this.pickUpAddressForm.value.pickUpAddressArea);
      console.log(this.deliveryAddressForm.value.deliveryAddressArea);
      console.log(this.packageForm.value.packages[0].type);
      this.priceService.getPrice(this.customerGroup, this.pickUpAddressForm.value.pickUpAddressArea, this.packageForm.value.packages[0].type).then((result:any) => {
        pickUpAreaPrice = result[0];
        this.priceService.getPrice(this.customerGroup, this.deliveryAddressForm.value.deliveryAddressArea, this.packageForm.value.packages[0].type).then((result:any) => {
          deliveryAreaPrice = result[0];
          


          var rWeight = 0;
          var vWeight = 0;
          var pickUpPrice = 0;
          var deliveryPrice = 0;
          this.totalPrice = 0;



          console.log(rWeight, vWeight);


          this.packageForm.value.packages.map(_package => {
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

          if(this.typeOfService){
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
          this.changeDetectorRefs.detectChanges();
          console.log(this.totalPrice);





        })
      })
    }

	}

  addNotes(str){
		if(str == 'delivery'){
			this.deliveryNoteFlag = true;
		}
		else if (str == 'deliveryDone'){
			this.deliveryNoteFlag = false;
		}
		else if (str == 'pickup'){
			this.pickUpNoteFlag = true;
		}
		else{
			this.pickUpNoteFlag = false;
		}
	}

}
