// Angular
import { Component, OnInit, Inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/service/customer.service';
import { OrdersService } from 'src/app/service/orders.service';
import { PackagesService } from 'src/app/service/packages.service';
import { StateAreaService } from 'src/app/service/state-area.service';
import { Router, ActivatedRoute } from '@angular/router';
import { result } from 'lodash';
import { PackageTypeService } from 'src/app/service/package-type.service';
import { PriceService } from 'src/app/service/price.service';

@Component({
	selector: 'kt-order-edit',
	templateUrl: './order-edit.component.html'
})
export class OrderEditComponent implements OnInit {

	myControl = new FormControl();
	options: any = [];
	allCustomers;
	filteredOptions: Observable<string[]>;
	deliveryType;

	order :any = {deliveryType: ''};
	packages :any = [];
	states;
	deliveryAreas;
	pickUpAreas;
	deliveryArea;
	pickUpArea;

	weightType;
	lengthType;

	deletedPackage = [];

	tempResult;
	data;
	customerFix = "tetete";
	editFlag = true;

	totalPrice : number = 0;
	packageTypes;

	deliveryNoteFlag;
	pickUpNoteFlag;

	deliveryAddressNote;
	pickupAddressNote;
	tempStates;
	tempPAreas;
	tempDAreas;
	customerGroup;
	constructor(
		// public dialogRef: MatDialogRef<OrderEditComponent>,
		// @Inject(MAT_DIALOG_DATA) public data: any,
		private router: Router,
		private customerService: CustomerService,
		private ordersService: OrdersService,
		private packagesService: PackagesService,
		private stateAreaService: StateAreaService,
		private route: ActivatedRoute,
		private changeDetectorRefs: ChangeDetectorRef,
		private packageTypeService: PackageTypeService,
		private priceService: PriceService,

	) { }

	async ngOnInit(): Promise<void> {
		this.deliveryNoteFlag = false;
		this.pickUpNoteFlag = false;
		this.customerGroup = '1';
		await this.route.queryParams.subscribe(params => {
			this.data = params;
			
		});
		console.log(this.data);
		this.packageTypeService.getAllPackageTypes().then(packageTypes => {
			this.packageTypes = packageTypes;
			this.packageTypes.map(type => {
				type.idpackageType = type.idpackageType.toString();
			})
		})
		this.weightType = 'kg';
		this.lengthType = 'cm';
		console.log(this.data);
		if (this.data.customer) {
			this.customerFix = this.data.customer;
			this.editFlag = true;
			this.order = JSON.parse(JSON.stringify(this.data));
			console.log(this.order);
			this.packagesService.getPackagesByOrderID(this.order.idorders).then(packages => {
				this.packages = packages;
				let filter = {}
				this.customerService.getAll(filter).then(result => {
					this.allCustomers = result;
					this.allCustomers.map(result => {
						this.options.push({ firstName: result.firstName, lastName: result.lastName, company: result.company, idcustomers: result.idcustomers, customerGroup: result?.customerGroup });
						this.changeDetectorRefs.detectChanges();
					})
					this.stateAreaService.getAllStates().then(async states => {
						this.states = [];
						this.tempStates = states;
						console.log(this.tempStates)

						await this.tempStates.map(state => {
							console.log(state.status)
							if(state.status == '0'){
								state.idstates = state.idstates.toString();
								this.states.push(state);
							}
							this.changeDetectorRefs.detectChanges();
						})
						await this.stateAreaService.getAreasByStatesID(this.order.deliveryAddressState).then(async areas => {
							this.tempDAreas = areas;
							this.deliveryAreas = [];
							await this.tempDAreas.map(area => {
								if(area.status == '0'){
									area.idareas = area.idareas.toString();
									this.deliveryAreas.push(area);
								}
								this.changeDetectorRefs.detectChanges();
							})
						})
						await this.stateAreaService.getAreasByStatesID(this.order.pickUpAddressState).then(async areas => {
							this.tempPAreas = areas;
							this.pickUpAreas = [];
							await this.tempPAreas.map(area => {
								if(area.status == '0'){
									area.idareas = area.idareas.toString();
									this.pickUpAreas.push(area);
								}
								this.changeDetectorRefs.detectChanges();
							})
						})
					})
				})
			})


		}
		else {
			this.editFlag = false;
			this.order = {
				billing: "",
				cost: "",
				customer: "",
				date: "",
				deliveryAddress: "",
				deliveryAddressArea: "0",
				deliveryAddressState: "0",
				deliveryName: "",
				deliveryPhone: "",
				deliveryType: "0",
				idcustomers: "",
				items: "",
				pickUpAddress: "",
				pickUpAddressArea: "0",
				pickUpAddressState: "0",
				status: "0",
				unit: "",
				volWeight: "",
				weight: ""
			}
			this.packages = [{
				cost: "",
				height: "",
				length: "",
				lengthUnit: "",
				status: "",
				type: "",
				weight: "",
				weightUnit: "",
				width: "",
			}]

			this.stateAreaService.getAllStates().then(states => {
				this.states = [];
				this.tempStates = states;
				this.tempStates.map(state => {
					console.log(state.status)
					if(state.status == '0'){
						state.idstates = state.idstates.toString();
						this.states.push(state);
					}
					this.changeDetectorRefs.detectChanges();
				})

				this.stateAreaService.getAreasByStatesID(this.order.deliveryAddressState).then(areas => {
					this.tempDAreas = areas;
					this.deliveryAreas = [];
					this.tempDAreas.map(area => {
						if(area.status == '0'){
							area.idareas = area.idareas.toString();
							this.deliveryAreas.push(area);
						}
						this.changeDetectorRefs.detectChanges();
					})
				})
				this.stateAreaService.getAreasByStatesID(this.order.pickUpAddressState).then(areas => {
					this.tempPAreas = areas;
					this.pickUpAreas = [];
					this.tempPAreas.map(area => {
						if(area.status == '0'){
							area.idareas = area.idareas.toString();
							this.pickUpAreas.push(area);
						}
						this.changeDetectorRefs.detectChanges();
					})
				})
			})

			let filter = {}
			await this.customerService.getAll(filter).then(async result => {
				this.allCustomers = result;
				await this.allCustomers.map(result => {
					this.options.push({ firstName: result.firstName, lastName: result.lastName, company: result.company, idcustomers: result.idcustomers , customerGroup: result?.customerGroup });
				})

			})
		}
		this.filteredOptions = this.myControl.valueChanges.pipe(
			startWith(''),
			map(value => this._filter(value))
		);
	}

	changeWeightType(str) {
		this.weightType = str;
	}

	changelengthType(str) {
		this.lengthType = str;
	}

	addPackage() {
		if ((this.packages[this.packages.length - 1].weight != 0) &&
			(this.packages[this.packages.length - 1].length != 0) &&
			(this.packages[this.packages.length - 1].width != 0) &&
			(this.packages[this.packages.length - 1].height != 0) &&
			(this.packages[this.packages.length - 1].weight != null) &&
			(this.packages[this.packages.length - 1].length != null) &&
			(this.packages[this.packages.length - 1].width != null) &&
			(this.packages[this.packages.length - 1].height != null)) {
			this.packages.push({
				weight: 0,
				length: 0,
				width: 0,
				height: 0,
				type: '0',
				weightUnit: 'kg',
				lengthUnit: 'cm'
			});
		}
		else {
			window.alert("Please input all fields correctly before add another package!")
		}
	}

	customerChange(option) {
		console.log(option.customerGroup);
		if(option.customerGroup != null && option.customerGroup != undefined && option.customerGroup != '') {
			this.customerGroup = option.customerGroup;
		}
		this.order.idcustomers = option.idcustomers;
	}

	deletePackage(_package) {
		const index: number = this.packages.indexOf(_package);
		if (index !== -1) {
			this.packages.splice(index, 1);
			this.deletedPackage.push(_package);
		}
	}

	save() {
		this.order.items = this.packages.length;
		if (this.order.idorders) {
			this.order.pickupAddressNote = this.pickupAddressNote;
			this.order.deliveryAddressNote = this.deliveryAddressNote;

			this.ordersService.updateOrder(this.order).then(result => {
				this.packages.map(_package => {
					if (this.deletePackage.length >= 1) {
						this.deletedPackage.map(_package => {
							this.packagesService.deletePackage(_package).then(result => {
								console.log("111111111111")
							})
						});
					}
					if (_package.idpackages) {
						this.packagesService.updatePackage(_package).then(result => {
							console.log("2222222222222222222")

						})
					}
					else {
						_package.idorders = this.order.idorders;
						_package.status = this.packages[0].status;
						_package.cost = '';
						this.packagesService.createNewPackage(_package).then(result => {
							console.log("3333333333333333333")
						})
					}
				})

				window.alert("successfully saved!");
				this.router.navigate(['/ecommerce/orders']);

				// this.dialogRef.close();
			})
		}
		else {
			this.order.pickupAddressNote = this.pickupAddressNote;
			this.order.deliveryAddressNote = this.deliveryAddressNote;

			this.ordersService.createNewOrder(this.order).then(async result => {
				this.tempResult = result;
				await this.packages.map(_package => {
					_package.idorders = this.tempResult.insertId;
					if (this.order.deliveryType == '0') {
						_package.status = '2'
					}
					else {
						_package.status = '0'
					}
					_package.cost = '';
					this.packagesService.createNewPackage(_package).then(result => {

					})
				})
				window.alert("successfully saved!");
				this.router.navigate(['/ecommerce/orders']);
			})
		}
	}

	cancel() {
		this.router.navigate(['/ecommerce/orders']);
	}

	StateChange(state, str) {
		if (str == 'p') {
			this.stateAreaService.getAreasByStatesID(state.idstates).then(result => {
				// this.pickUpAreas = result;
				this.tempPAreas = result;
				this.pickUpAreas = [];
				this.tempPAreas.map(area => {
					if(area.status == '0'){
						area.idareas = area.idareas.toString();
						this.pickUpAreas.push(area);
					}
					this.changeDetectorRefs.detectChanges();
				})
			})
		}
		else {
			this.stateAreaService.getAreasByStatesID(state.idstates).then(result => {
				// this.deliveryAreas = result;
				this.tempDAreas = result;
				this.deliveryAreas = [];
				this.tempDAreas.map(area => {
					if(area.status == '0'){
						area.idareas = area.idareas.toString();
						this.deliveryAreas.push(area);
					}
					this.changeDetectorRefs.detectChanges();
				})
			})
		}

	}

	async calcPrice(){
		var pickUpAreaPrice : any;
		var deliveryAreaPrice : any;
		if(
			// this.pickUpArea?.idareas != undefined && 
			this.deliveryArea?.idareas != undefined && this.packages[0]?.type != null && this.packages[0]?.type != undefined && this.packages[0]?.type != ''){ 
			console.log(this.customerGroup);
			console.log(this.pickUpArea?.idareas);
			console.log(this.deliveryArea?.idareas);
			console.log(this.packages[0]?.type);
			await this.priceService.getPrice(this.customerGroup,this.pickUpArea?.idareas,this.packages[0]?.type).then(async (result:any) => {
				pickUpAreaPrice = result[0];
				console.log("pickUpAreaPrice",pickUpAreaPrice);

				await this.priceService.getPrice(this.customerGroup,this.deliveryArea?.idareas,this.packages[0]?.type).then((result:any) => {
					deliveryAreaPrice = result[0];
					console.log("deliveryAreaPrice",deliveryAreaPrice);


					var rWeight:number = 0;
					var vWeight:number = 0;
					var pickUpPrice:number = 0;
					var deliveryPrice:number = 0;
					this.totalPrice = 0;
					this.packages.map(_package => {
						rWeight = rWeight + parseInt(_package.weight);
						vWeight = vWeight + Number(_package.height)*Number(_package.width)*Number(_package.length)/166;
					})

					console.log(rWeight, vWeight);

					if(rWeight > vWeight){
						if(rWeight < 5){
							deliveryPrice = Number(deliveryAreaPrice?.basePrice);
						}
						else {
							deliveryPrice = Number(deliveryAreaPrice?.basePrice) + (rWeight - 5) * Number(deliveryAreaPrice?.extraRW);
						}
					}
					else {
						if(vWeight < 5){
							deliveryPrice = Number(deliveryAreaPrice?.basePrice);
						}
						else {
							deliveryPrice = Number(deliveryAreaPrice?.basePrice) + (vWeight - 5) * Number(deliveryAreaPrice?.extraRV);
						}
					}
					
					if(this.order.deliveryType == '0'){
						this.totalPrice = deliveryPrice;
					}
					else {
						pickUpPrice = Number(pickUpAreaPrice?.pickup);
						this.totalPrice = deliveryPrice + pickUpPrice;
					}
					console.log(this.totalPrice);
					this.order.cost = this.totalPrice.toFixed(2);
					this.changeDetectorRefs.detectChanges();


				})
			})
		}


	}

	basePrice(str, area){
		if (str == 'delivery'){
			this.deliveryArea = area;
		}
		else {
			this.pickUpArea = area;
		}
		this.calcPrice();
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

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.options.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0);
	}
}
