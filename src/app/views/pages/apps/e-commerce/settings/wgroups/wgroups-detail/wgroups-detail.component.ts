import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { WGroupService } from 'src/app/service/w-group.service'
@Component({
  selector: 'kt-wgroups-detail',
  templateUrl: './wgroups-detail.component.html',
  styleUrls: ['./wgroups-detail.component.scss']
})
export class WgroupsDetailComponent implements OnInit {

  groupForm = new FormGroup({
    name: new FormControl,
    wPrice: new FormControl,
    vPrice: new FormControl,

    cubic: new FormControl,
    mWeight: new FormControl,
    bl: new FormControl,
    sed: new FormControl,


    // m3China: new FormControl,
  });

  wpgroupForm: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<WgroupsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private wGroupService: WGroupService,


  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.wpgroupForm = this.fb.group({
      groupForm: this.fb.array([])
    });
    const add = this.wpgroupForm.get('groupForm') as FormArray;
    let initData = this.data.group.obj_data ? JSON.parse(this.data.group.obj_data) : false;
    // this.groupForm = this.fb.group({
    //   name: ['', Validators.required],
    //   wPrice: ['', Validators.required],
    //   vPrice: ['', Validators.required],

    //   cubic: ['', Validators.required],
    //   mWeight: ['', Validators.required],
    //   bl: ['', Validators.required],
    //   sed: ['', Validators.required],


    //   m3China: ['', Validators.required],
    // });

    if (this.data.group != '') {
      if (initData) {
        initData.map((init_data) => {
          add.push(this.fb.group(init_data))
        })
      }
      else {
        add.push(this.fb.group({
          name: this.data.group.name,
          wPrice: this.data.group.wPrice,
          vPrice: this.data.group.vPrice,

          cubic: this.data.group.cubic,
          mWeight: this.data.group.mWeight,
          bl: this.data.group.bl,
          sed: this.data.group.sed,
          // m3China: this.data.group.m3China,
          lbs: this.data.group.lbs,

        }))
      }
    }
    else {
      add.push(this.fb.group({
        name: ['', Validators.required],
        wPrice: ['', Validators.required],
        vPrice: ['', Validators.required],
        cubic: ['', Validators.required],
        mWeight: ['', Validators.required],
        bl: ['', Validators.required],
        sed: ['', Validators.required],
        // m3China: ['', Validators.required],
        lbs: ['', Validators.required],
      }));

    }

  }
  addForm() {
    const add = this.wpgroupForm.get('groupForm') as FormArray;
    add.push(this.fb.group({
      name: ['', Validators.required],
      wPrice: ['', Validators.required],
      vPrice: ['', Validators.required],
      cubic: ['', Validators.required],
      mWeight: ['', Validators.required],
      bl: ['', Validators.required],
      sed: ['', Validators.required],
      // m3China: ['', Validators.required],
      lbs: ['', Validators.required],
    }));
    console.log(add)
  }
  getControls() {
    return (this.wpgroupForm.get('groupForm') as FormArray).controls;
  }
  deleteWarehouse(index: number) {
    const add = this.wpgroupForm.get('groupForm') as FormArray;
    add.removeAt(index)
  }
  cancel() {
    this.dialogRef.close();
  }

  save() {
    const get_form = this.wpgroupForm.get('groupForm') as FormArray;
    const group_controls = (this.wpgroupForm.get('groupForm') as FormArray).controls;
    const all_data = this.wpgroupForm.getRawValue().groupForm;
    for (let i in group_controls) {
      const controls = group_controls[i]["controls"];
      console.log(controls, 'controls')
      if (group_controls[i]["invalid"]) {
        if (group_controls.length > 1 && controls.name["invalid"]) {
          continue;
        }
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        )
        return
      }
    }
    // group_controls.map(async function(ch_control){
    //   if(ch_control.invalid){
    //     for(let i in ch_control.controls){
    //       if(!ch_control.controls[i].value){
    //         ch_control.controls[i].markAsTouched();
    //         return;
    //       }
    //     }
    //     // console.log(ch_control,ch_control.controls)

    //   }
    // })
    // for(let i in controls){
    //   console.log(controls[i].invalid)
    //   if(controls[i].invalid){
    //     let validSet = controls[i].controls;
    //     Object.keys(validSet).forEach(controlName=>validSet[controlName].markAsTouched());
    //     return;
    //      // Object.keys(controls[i].controls).forEach(controlName=>controls[i][controlName].markAsTouched());
    //     // return;
    //   }
    // }
    // if (get_form.invalid) {
    //   Object.keys(controls).forEach(controlName =>
    //     controls[controlName].markAsTouched()
    //   );
    //   return;
    // }
    // else {
    // }
    if (this.data.group != '') {
      // console.log('edit');
      this.wGroupService.editWGroup({
        idwGroup: this.data.group.idwGroup,
        name: all_data[0].name,
        wPrice: all_data[0].wPrice,
        vPrice: all_data[0].vPrice,

        cubic: all_data[0].cubic,
        mWeight: all_data[0].mWeight,
        bl: all_data[0].bl,
        sed: all_data[0].sed,


        // m3China: all_data[0].m3China,
        obj_data: JSON.stringify(all_data)
      }).then(result => {
        this.dialogRef.close();
      }).catch(err => {
        console.log(err);
      })
    }
    else {
      let groupdata = all_data[0];
      groupdata.obj_data = JSON.stringify(all_data);
      this.wGroupService.createWGroup(groupdata).then(result => {
        this.dialogRef.close();
      }).catch(err => {
        console.log(err)
      })
      // this.wGroupService.createWGroup({
      //   name: this.groupForm.value.name,
      //   wPrice: this.groupForm.value.wPrice,
      //   vPrice: this.groupForm.value.vPrice,

      //   cubic: this.groupForm.value.cubic,
      //   mWeight: this.groupForm.value.mWeight,
      //   bl: this.groupForm.value.bl,
      //   sed: this.groupForm.value.sed,


      //   m3China: this.groupForm.value.m3China,
      // }).then(result => {
      //   this.dialogRef.close();  
      // }).catch(err => {
      //   console.log(err);
      // })
    }
    /** check form */

  }
}

