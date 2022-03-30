import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StateAreaService } from 'src/app/service/state-area.service';
import { CustomerGroupsService } from 'src/app/service/customer-groups.service';
import { PriceService } from 'src/app/service/price.service';
import { PackageTypeService } from 'src/app/service/package-type.service';


CustomerGroupsService
@Component({
  selector: 'kt-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.scss']
})
export class EditAreaComponent implements OnInit {

  areaForm = new FormGroup({
    state: new FormControl,
    area: new FormControl,
    areaStatus: new FormControl,
  });
  priceForm: FormGroup;

  states: any = [];
  editState;
  customerGroup;
  packageTypes : any =[];

  constructor(
    public dialogRef: MatDialogRef<EditAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private stateAreaService: StateAreaService,
    private customerGroupsService: CustomerGroupsService,
    private priceService: PriceService,
    private packageTypeService: PackageTypeService,


    

  ) { }

  async ngOnInit(): Promise<void> {
    this.priceForm = this.fb.group({
      price: this.fb.array([]) 
    });
    console.log(this.data);
    const add = this.priceForm.get('price') as FormArray;
    if (this.data.dialog == 'editArea') {

    }

    if (this.data.dialog == 'addArea') {
      this.areaForm = this.fb.group({
        state: ['', Validators.required],
        area: ['', Validators.required],
        areaStatus: ['', Validators.required],
      });
      this.stateAreaService.getAllStates().then(states => {
        this.states = states;
        this.states.map(state => {
          state.idstates = state.idstates.toString();
        })
      })
    }
    else {
      await this.packageTypeService.getAllPackageTypes().then(async result => {
        this.packageTypes = result;
          for(var i=0; i< this.packageTypes.length; i++){
            add.push(this.fb.group({
              basePrice: ['', Validators.required],
              extraRV: ['', Validators.required],
              extraRW: ['', Validators.required],
              pickup: ['', Validators.required],
            }));
            await this.priceService.getPrice(this.data.idcustomerGroup, this.data.area.idareas, this.packageTypes[i].idpackageType).then(result => {
              console.log(result);
              var price:any = result;
              var priceFormGroup = (this.priceForm.get('price') as FormArray).controls[i] as FormGroup;
              console.log(price);
              console.log("priceFormGroup",priceFormGroup);
              priceFormGroup.patchValue({ 
                basePrice: price[0]?.basePrice, 
                extraRV:  price[0]?.extraRV, 
                extraRW:  price[0]?.extraRW, 
                pickup:  price[0]?.pickup, 
              });
            })
          }
      })
      this.areaForm = this.fb.group({
        area: ['', Validators.required],
        areaStatus: ['', Validators.required],
      });
      this.stateAreaService.getStateByID(this.data.area.idstates).then(state => {
        this.editState = state[0].name;
        this.customerGroupsService.getCustomerGroupByID(this.data.idcustomerGroup).then(result => {
          this.customerGroup = result;
          this.customerGroup = this.customerGroup[0].name;
        });
      })
      this.areaForm.setValue({ area: this.data.area.name, areaStatus: this.data.area.status});
    }

  }

  addArea() {
    if (this.areaForm.invalid) {
      window.alert("Please input all field correctly!")
    }
    else {
      this.stateAreaService.createArea(this.areaForm.value).then(result => {
        window.alert("successfully saved!");
        this.dialogRef.close({flag: "saved"});
      })
    }
  }

  async editArea() {
    if (this.areaForm.invalid || this.priceForm.invalid) {
      window.alert("Please input all field correctly!")
    }
    else {
      var area = this.areaForm.value;
      area.idareas = this.data.area.idareas;
      await this.stateAreaService.editArea(area).then(async result => {
        console.log(result);
        for(var i=0 ; i<this.packageTypes.length; i++){
          var priceFormGroup = (this.priceForm.get('price') as FormArray).controls[i] as FormGroup;
          console.log(priceFormGroup.value);

          await this.priceService.editPrice(this.data.idcustomerGroup,this.packageTypes[i].idpackageType, area.idareas, priceFormGroup.value).then(result => {
            console.log(result);
            this.dialogRef.close({flag: "saved"});
          });
        }
      })
    }
  }

  getControls() {
    return (this.priceForm.get('price') as FormArray).controls;
  }

}
