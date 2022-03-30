

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomerGroupsService } from 'src/app/service/customer-groups.service';
import { result } from 'lodash';

@Component({
  selector: 'kt-add-customer-groups',
  templateUrl: './add-customer-groups.component.html',
  styleUrls: ['./add-customer-groups.component.scss']
})
export class AddCustomerGroupsComponent implements OnInit {

  customerGroupForm = new FormGroup({
    customerGroup: new FormControl
  });
  buttonName;
  tempResult;
  constructor(
    public dialogRef: MatDialogRef<AddCustomerGroupsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private customerGroupsService: CustomerGroupsService,

  ) { }

  ngOnInit(): void {
    this.customerGroupForm = this.fb.group({
      customerGroup: ['', Validators.required],
    });
    if (this.data.idcustomerGroup) {
      this.buttonName = 'save';
      this.customerGroupForm.get('customerGroup').setValue(this.data.name);
    }
    else {
      this.buttonName = 'add';
    }
  }
  add() {
    if (this.buttonName == 'add') {
      if (this.customerGroupForm.invalid) {
        window.alert("Please input the name of customer Group!")
      }
      else {
        this.customerGroupsService.createCustomerGroup(this.customerGroupForm.value).then(result => {
          this.tempResult = result;
          window.alert("Successfully added");
          this.dialogRef.close({ data: { idcustomerGroup: this.tempResult.insertId, name: this.customerGroupForm.value.customerGroup }, status: 'success' });

        })
      }
    }
    else {
      if (this.customerGroupForm.invalid) {
        window.alert("Please input the name of customer Group!")
      }
      else {
        this.customerGroupsService.editCustomerGroup(this.data.idcustomerGroup, this.customerGroupForm.value.customerGroup).then(result => {
          window.alert("Successfully saved");
          this.dialogRef.close();
        })
      }
    }
  }
}

