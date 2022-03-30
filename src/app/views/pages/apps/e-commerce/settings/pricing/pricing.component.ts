import { Component, OnInit, ChangeDetectorRef, ViewRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StateAreaService } from 'src/app/service/state-area.service';
import { MatDialog } from '@angular/material/dialog';
import { EditPricingComponent } from './edit-pricing/edit-pricing.component';
import { EditAreaComponent } from './edit-area/edit-area.component';
import { CustomerGroupsService } from 'src/app/service/customer-groups.service';

import { PriceService } from 'src/app/service/price.service';
import { PackageTypeService } from 'src/app/service/package-type.service';

@Component({
  selector: 'kt-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  dataSourceAreas: MatTableDataSource<any>;
  dataSourceStates: MatTableDataSource<any>;

  displayedColumnsStates = ['name', 'areas', 'status', 'action'];
  displayedColumnsAreas = ['name', 'basePrice', 'extraRV', 'extraRW', 'pickup', 'status', 'action'];

  states;
  state;
  areas;
  tempAreas;
  customerGroups : any =[];
  packageTypes : any =[];

  idcustomerGroup;
  tempPrice;
  constructor(
    private stateAreaService: StateAreaService,
    private customerGroupsService: CustomerGroupsService,
    private priceService: PriceService,
    private packageTypeService: PackageTypeService,
    
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,

  ) { }

  async ngOnInit(): Promise<void> {
    await this.packageTypeService.getAllPackageTypes().then(result => {
      console.log(result);
      this.packageTypes = result;
      this.customerGroupsService.getAllCustomerGroups().then(result => {

        this.customerGroups = result;
        console.log(this.customerGroups);
        // this.customerGroups.push({idcustomerGroup: '0', name : "Standard"});
        this.idcustomerGroup = this.customerGroups[0]?.idcustomerGroup.toString();
        this.customerGroups.map(customerGroup => {
          customerGroup.idcustomerGroup = customerGroup.idcustomerGroup.toString();
        })

        this.stateAreaService.getAllStates().then(states => {

          this.states = states;
          this.state = this.states[0];
          if (!this.state) {
            return;
          }
          this.stateAreaService.getAreasByStatesID(this.states[0].idstates).then(async areas => {
            this.areas = areas;
            await this.customerGroupChange();
            if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
              !(this.changeDetectorRefs as ViewRef).destroyed) {
              this.changeDetectorRefs.detectChanges();
            }
            this.states.map(state => {
              this.stateAreaService.getAreasByStatesID(state.idstates).then(async areas => {
                this.tempAreas = areas;
                state.areasNum = this.tempAreas.length;

                


                this.dataSourceStates = new MatTableDataSource(this.states);
                // this.dataSourceAreas = new MatTableDataSource(this.areas);
                 if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
                  !(this.changeDetectorRefs as ViewRef).destroyed) {
                  return this.changeDetectorRefs.detectChanges();
                }
              })
            });
          })
        })
      })
    })



  }

  stateChange(state) {
    this.state = state;
    this.idcustomerGroup = this.customerGroups[0].idcustomerGroup.toString();
    this.stateAreaService.getAreasByStatesID(state.idstates).then(async areas => {
      this.areas = areas;
      await this.customerGroupChange();
    })
  }

  addState() {
    const dialogRef = this.dialog.open(EditPricingComponent, { data: { dialog: "addState" } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result?.flag == "saved"){
        this.ngOnInit();
        if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
          !(this.changeDetectorRefs as ViewRef).destroyed) {
          return this.changeDetectorRefs.detectChanges();
        }
      }
    })
  }
  editState(state) {
    const dialogRef = this.dialog.open(EditPricingComponent, { data: { dialog: "editState", state: state } });
    dialogRef.afterClosed().subscribe(result => {
      if(result?.flag == "saved"){
        this.ngOnInit();
        if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
          !(this.changeDetectorRefs as ViewRef).destroyed) {
          return this.changeDetectorRefs.detectChanges();
        }
      }
    })
  }
  addArea() {
    const dialogRef = this.dialog.open(EditAreaComponent, { data: { dialog: "addArea" } });
    dialogRef.afterClosed().subscribe(result => {
      if(result?.flag == "saved"){
        this.ngOnInit();
        if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
          !(this.changeDetectorRefs as ViewRef).destroyed) {
          return this.changeDetectorRefs.detectChanges();
        }
      }

    })
  }
  editArea(area) {
    const dialogRef = this.dialog.open(EditAreaComponent, { data: { dialog: "editArea", area: area, idcustomerGroup: this.idcustomerGroup } });
    dialogRef.afterClosed().subscribe(result => {
      if(result?.flag == "saved"){
        this.ngOnInit();
        if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
          !(this.changeDetectorRefs as ViewRef).destroyed) {
          return this.changeDetectorRefs.detectChanges();
        }
      }

    })
  }
  async customerGroupChange(){
    console.log(this.idcustomerGroup);
    console.log(this.areas);
    await this.areas.map(async area => {
      area.basePrice = '';
      area.extraRV = '';
      area.extraRW = '';
      area.pickup = '';
      for(var i = 0 ; i < this.packageTypes.length ; i ++){

        await this.priceService.getPrice(this.idcustomerGroup, area.idareas, this.packageTypes[i].idpackageType).then(price => {
          console.log(price);
          this.tempPrice = price;
          area.basePrice = area.basePrice + this.tempPrice[0]?.basePrice;
          area.extraRV = area.extraRV + this.tempPrice[0]?.extraRV;
          area.extraRW = area.extraRW + this.tempPrice[0]?.extraRW;
          area.pickup = area.pickup + this.tempPrice[0]?.pickup;
          if( i+1 != this.packageTypes.length){
            area.basePrice = area.basePrice + ' / ';
            area.extraRV = area.extraRV + ' / ';
            area.extraRW = area.extraRW + ' / ';
            area.pickup = area.pickup + ' / ';
          }
          this.dataSourceAreas = new MatTableDataSource(this.areas);
          if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
            !(this.changeDetectorRefs as ViewRef).destroyed) {
            return this.changeDetectorRefs.detectChanges();
          }
        })
        console.log("area", area);
      }

      // await this.packageTypes.forEach(async (packageType, index) => {
      //   console.log(index);

      //   await this.priceService.getPrice(this.idcustomerGroup, area.idareas, packageType.idpackageType).then(price => {
      //     console.log(price);
      //     this.tempPrice = price;
      //     area.basePrice = area.basePrice + this.tempPrice[0]?.basePrice;
      //     area.extraRV = area.extraRV + this.tempPrice[0]?.extraRV;
      //     area.extraRW = area.extraRW + this.tempPrice[0]?.extraRW;
      //     area.pickup = area.pickup + this.tempPrice[0]?.pickup;
      //     if( index+1 != this.packageTypes.length){
      //       area.basePrice = area.basePrice + ' / ';
      //       area.extraRV = area.extraRV + ' / ';
      //       area.extraRW = area.extraRW + ' / ';
      //       area.pickup = area.pickup + ' / ';
      //     }
      //     this.dataSourceAreas = new MatTableDataSource(this.areas);
      //     this.changeDetectorRefs.detectChanges();
      //   })
      //   console.log("area", area);
      // })

    })
    console.log("this.areas",this.areas);


  }

  deleteState(state){
    console.log(state);
    this.stateAreaService.deleteState(state).then(result => {
      console.log(result);
      this.ngOnInit();
      if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
        !(this.changeDetectorRefs as ViewRef).destroyed) {
        return this.changeDetectorRefs.detectChanges();
      }

    })
  }

  deleteArea(area){
    console.log(area);
    this.stateAreaService.deleteArea(area).then(result => {
      console.log(result);
      this.ngOnInit();
      if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
        !(this.changeDetectorRefs as ViewRef).destroyed) {
        return this.changeDetectorRefs.detectChanges();
      }

    })
  }
}
