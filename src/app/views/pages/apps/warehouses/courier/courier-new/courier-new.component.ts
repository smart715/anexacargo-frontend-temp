import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CustomerService } from 'src/app/service/customer.service';
import { CourierService } from 'src/app/service/courier.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { Router } from '@angular/router';
import { WGroupService } from 'src/app/service/w-group.service';
import { SettingService } from 'src/app/service/setting.service';
import { PrintLabelComponent } from '../../../e-commerce/package-view/print-label/print-label.component';
import { stubString } from 'lodash';



@Component({
  selector: 'kt-courier-new',
  templateUrl: './courier-new.component.html',
  styleUrls: ['./courier-new.component.scss']
})
export class CourierNewComponent implements OnInit {

  courierType; //0:china, 1: usaAir, 2:usaMartime;
  firstPrice;
  secondPrice;
  thirdPrice;
  courierForm = new FormGroup({
    courier: new FormControl,
    location: new FormControl,
    type: new FormControl,
    cost: new FormControl,
  });
  warehouseForm: FormGroup;

  options: any = [];
  filteredOptions: Observable<string[]>[] = [];
  saveFlag: boolean;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private courierService: CourierService,
    private warehouseService: WarehouseService,
    private router: Router,
    private wGroupService: WGroupService,
    private settingService: SettingService,


  ) { }

  async ngOnInit() {
    this.saveFlag = true;
    this.courierForm = this.fb.group({
      courier: ['', Validators.required],
      location: ['', Validators.required],
      type: ['', Validators.required],
      cost: ['', Validators.required],
    });
    this.warehouseForm = this.fb.group({
      warehouses: this.fb.array([])
    });
    const add = this.warehouseForm.get('warehouses') as FormArray;
    add.push(this.fb.group({
      aexID: ['', Validators.required],
      warehouse: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      m3: ['', Validators.required],
      taxes: ['', Validators.required],
      tracking: ['', Validators.required],
      weight: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
      length: ['', Validators.required],
      price: ['', Validators.required],
      cubic: ['', Validators.required],
      bl: ['', Validators.required],
      sed: ['', Validators.required],
    }));
    let filter = {}
    await this.customerService.getAll(filter).then((result: any) => {
      result.map(customer => {
        this.options.push({ idcustomers: customer.idcustomers, firstName: customer.firstName, lastName: customer.lastName });
      })
    });

    var warehousesForm = (this.warehouseForm.get('warehouses') as FormArray).controls[0] as FormGroup;
    const controls = warehousesForm.controls;
    controls['price'].disable();
    this.filteredOptions[0] = controls.aexID.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.courierType = '1';
  }

  changeLocation() {
    this.getCourierType();
  }

  changeType() {
    this.getCourierType();
  }

  getControls() {
    return (this.warehouseForm.get('warehouses') as FormArray).controls;
  }

  getCourierType() {
    if (this.courierForm.value.location == '0') { //china
      this.courierType = '0';
    }
    else {
      if (this.courierForm.value.type == '0') {
        this.courierType = '1'; //Air
      }
      else {
        this.courierType = '2'; // Maritime

      }
    }
  }

  deleteWarehouse(index: number) {
    const add = this.warehouseForm.get('warehouses') as FormArray;
    add.removeAt(index)
  }

  addWarehouse(index) {
    if (this.checkWarehouseValid()) {
      const add = this.warehouseForm.get('warehouses') as FormArray;
      add.push(this.fb.group({
        aexID: ['', Validators.required],
        warehouse: [this.warehouseForm.value.warehouses[index].warehouse, Validators.required],
        m3: ['', Validators.required],
        taxes: ['', Validators.required],
        tracking: ['', Validators.required],
        weight: ['', Validators.required],
        width: ['', Validators.required],
        height: ['', Validators.required],
        length: ['', Validators.required],
        price: ['', Validators.required],
        cubic: ['', Validators.required],
        bl: [''],
        sed: [''],
      }));
      var warehousesForm = (this.warehouseForm.get('warehouses') as FormArray).controls[index + 1] as FormGroup;
      const controls = warehousesForm.controls;
      controls.price.disable();

      this.filteredOptions[index + 1] = controls.aexID.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    }
  }
  async save() {
    console.log(this.firstPrice, this.secondPrice, this.thirdPrice);
    if (this.checkCourierValid() && this.checkWarehouseValid()) {

      const saveCourier = async () => {
        this.saveFlag = true;

        await this.courierService.createCourier(this.courierForm.value).then(async (result: any) => {
          console.log(result.insertId);
          var idcourier = result.insertId;
          await this.warehouseForm.getRawValue().warehouses.map(async warehouse => {
            warehouse.idcourier = idcourier;
            console.log(warehouse);
            warehouse.aexID = warehouse.aexID.search('250') == 0 ? warehouse.aexID.substring(3) : warehouse.aexID.substring(2);
            await this.customerService.getCustomerByID(warehouse.aexID).then((result: any) => {
              if (result.length != 0) {
                warehouse.firstName = result[0].firstName;
                warehouse.lastName = result[0].lastName;
              }
            });
            warehouse.firstPrice = this.firstPrice;
            warehouse.secondPrice = this.secondPrice;
            warehouse.thirdPrice = this.thirdPrice;
            // return console.log(warehouse);
            await this.warehouseService.createWarehouse(warehouse).then(async (result: any) => {
              console.log(result.insertId);
              await this.warehouseService.createWarehouseLog("warehouse is created", result.insertId, window.localStorage.getItem('userID')).then(result => {
                console.log(result);
              })
              console.log(result);
            }).catch(err => {
              console.log(result);
              window.alert("Unfortunately error ocured!");
            })
          })
        }).catch(err => {
          console.log(err);
          window.alert("Unfortunately error ocured!");
        });
      };
      saveCourier().then(result => {
        setTimeout(() => {
          this.router.navigate(['warehouse']);
        }, 1000);
      })
    }
  }

  private _filter(value: string): string[] {
    // const filterValue = value.search("250") > 0 ? value.substring(3) : value.substring(2);
    const filterValue = value;
    console.log(filterValue);
    // filterValue = filterValue.substring(2);
    return this.options.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0 || option.lastName.toLowerCase().indexOf(filterValue) === 0 || ((option.idcustomers < 10 ? ('250' + option.idcustomers).toString() : ('25' + option.idcustomers).toString()).toLowerCase()).indexOf(filterValue) >= 0);
  }

  public checkWarehouseValid() {
    console.log(this.getControls(), this.courierType, 'this.courierType')
    for (let i = 0; i < this.getControls().length; i++) {
      var warehousesForm = (this.warehouseForm.get('warehouses') as FormArray).controls[i] as FormGroup;
      const controls = warehousesForm.controls;
      for (const name in controls) {
        if (this.courierType == '0') { //china
          if (controls[name].invalid) {
            if (name == 'tracking' || name == 'weight' || name == 'width' || name == 'height' || name == 'length' || name == 'cubic' || name == 'bl' || name == 'sed') {
            }
            else {
              controls[name].markAsTouched();
              return false;
            }
          }
        }
        else if (this.courierType == '1') {
          if (controls[name].invalid) {
            if (name == 'm3' || name == 'taxes' || name == 'cubic' || name == 'bl' || name == 'sed' || name == 'warehouse') {
            }
            else {
              controls[name].markAsTouched();
              return false;
            }
          }
        }
        else {

          if (controls[name].invalid) {

            if (name == 'weight' || name == 'm3' || name == 'taxes' || name == 'width' || name == 'height' || name == 'length' || name == 'bl' || name == 'sed' || name == 'warehouse') {
            }
            else {
              controls[name].markAsTouched();
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  public checkCourierValid() {
    const controls = this.courierForm.controls;
    console.log(controls);
    for (const name in controls) {
      if (this.courierType == '0') {
        if (controls[name].invalid) {
          if (name == 'type') {
          }
          else {
            controls[name].markAsTouched();
            return false;
          }
        }
      }
      else {
        if (controls[name].invalid) {
          // if ( == "weight") continue;
          controls[name].markAsTouched();
          return false;
        }
      }
    }
    return true;
  }

  calcWarehousePrice(warehouse) {
    this.saveFlag = true;
    // courierType; //0:china, 1: usaAir, 2:usaMartime;
    var warehousesForm = warehouse as FormGroup;
    var warehouse = warehousesForm.value;
    var customer;
    var wGroup;
    var price;
    console.log(warehouse.aexID, 'warehouse.aexID')
    warehouse.aexID = warehouse.aexID.search('250') == 0 ? warehouse.aexID.substring(3) : warehouse.aexID.substring(2);
    if (parseInt(warehouse.aexID)) {
      this.customerService.getCustomerByID(warehouse.aexID).then((result: any) => {
        if (result.length == 0) {
          // window.alert("please input valid value");
        }
        else {
          customer = result[0];

          console.log('customer ===> ', customer);
          warehousesForm.patchValue({ firstName: customer.firstName });
          warehousesForm.patchValue({ lastName: customer.lastName });
          if (customer.idwGroup) {
            this.wGroupService.getWGroupByID(customer.idwGroup).then((result: any) => {
              console.log(result)
              let anyValue = warehouse.weight;
              let anyStrings = "0";
              wGroup = result[0];
              let obj_data = wGroup?.obj_data ? JSON.parse(wGroup.obj_data) : false;
              let real_arr = [];
              if (obj_data) {
                for (let i in obj_data) {
                  if (obj_data[i]["lbs"] > anyValue) {
                    real_arr.push(obj_data[i]);
                  } else {
                    return window.alert("please input valid value");

                  }
                }
              }
              real_arr.sort(function (a, b) { return a.lbs - b.lbs });
              wGroup = real_arr[0];
              console.log(wGroup, real_arr)
              this.settingService.getSettings().then(async (result) => {
                console.log('result', result)
                if (this.courierType == '0') {//china
                  if (warehouse.m3) {
                    price = warehouse.m3 * parseFloat(wGroup.m3China) + parseFloat(warehouse.taxes);
                    try {
                      warehousesForm.patchValue({ price: price.toFixed(2) });
                    } catch (err) {
                      console.log(err);
                    }
                    this.saveFlag = false;

                  }
                }
                else if (this.courierType == '1') {//air
                  var volWeight: number;
                  var weight: number;
                  var extraWeight: number;
                  volWeight = (warehouse.width * warehouse.height * warehouse.length) / 166;
                  weight = warehouse.weight;
                  if ((volWeight - weight - 10) < 0) {
                    extraWeight = 0;
                  }
                  else {
                    extraWeight = volWeight - 10 - weight;
                  }
                  if (result[0]?.itbms > 0) {
                    if (!wGroup) return;
                    console.log(extraWeight, 'extraWeight');
                    if (weight > volWeight || weight == volWeight) {
                      //wgroup.bl is Air Pr Tramites
                      price = weight * wGroup.wPrice + (wGroup.bl * weight);
                      this.thirdPrice = price * parseFloat(result[0]?.itbms) / 100;
                      price = price + price * parseFloat(result[0]?.itbms) / 100;
                      this.firstPrice = weight * wGroup.wPrice;
                      this.secondPrice = weight * wGroup.bl;
                      warehousesForm.patchValue({ price: price.toFixed(2) });
                      this.saveFlag = false;
                    } else {
                      price = volWeight * wGroup.vPrice + (volWeight * wGroup.sed);
                      this.thirdPrice = price * parseFloat(result[0]?.itbms) / 100;
                      price = price + price * parseFloat(result[0]?.itbms) / 100;

                      this.firstPrice = volWeight * wGroup.vPrice;
                      this.secondPrice = volWeight * wGroup.sed;
                      warehousesForm.patchValue({ price: price.toFixed(2) });
                      this.saveFlag = false;
                    }
                  } else {
                    if (weight > volWeight || weight == volWeight) {
                      price = weight * wGroup.wPrice + (weight * wGroup.bl);
                      this.firstPrice = weight * wGroup.wPrice;
                      this.secondPrice = weight * wGroup.bl;
                      this.thirdPrice = 0;
                      warehousesForm.patchValue({ price: price.toFixed(2) });
                      this.saveFlag = false;
                    } else {
                      price = volWeight * wGroup.vPrice + (volWeight * wGroup.sed);
                      this.firstPrice = volWeight * wGroup.vPrice;
                      this.secondPrice = volWeight * wGroup.sed;
                      this.thirdPrice = 0;
                      warehousesForm.patchValue({ price: price.toFixed(2) });
                      this.saveFlag = false;
                    }
                  }
                }
                else {//maritime
                  if (warehouse.cubic) {
                    // var blSed: number = 0;
                    // if (warehouse.bl == true) {
                    //   blSed = blSed + parseFloat(wGroup.bl);
                    // }
                    // if (warehouse.sed == true) {
                    //   blSed = blSed + parseFloat(wGroup.sed);
                    // }
                    if (result[0]?.itbms > 0) {
                      price = warehouse.cubic * parseFloat(wGroup.cubic) + parseFloat(wGroup.mWeight);
                      this.thirdPrice = price * parseFloat(result[0]?.itbms) / 100;
                      price = price + price * parseFloat(result[0]?.itbms) / 100;

                      this.firstPrice = warehouse.cubic * parseFloat(wGroup.cubic);
                      this.secondPrice = parseFloat(wGroup.mWeight);



                      warehousesForm.patchValue({ price: price.toFixed(2) });
                      this.saveFlag = false;
                    } else {
                      price = warehouse.cubic * parseFloat(wGroup.cubic) + parseFloat(wGroup.mWeight);

                      this.firstPrice = warehouse.cubic * parseFloat(wGroup.cubic);
                      this.secondPrice = parseFloat(wGroup.mWeight);
                      this.thirdPrice = 0;


                      warehousesForm.patchValue({ price: price.toFixed(2) });
                      this.saveFlag = false;
                    }

                  }
                }
              });
            })
          }
        }
      });
    }

  }
}
