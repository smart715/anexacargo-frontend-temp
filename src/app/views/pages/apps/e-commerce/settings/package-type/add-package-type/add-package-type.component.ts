import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PackageTypeService } from 'src/app/service/package-type.service';
import { result } from 'lodash';

@Component({
  selector: 'kt-add-package-type',
  templateUrl: './add-package-type.component.html',
  styleUrls: ['./add-package-type.component.scss']
})
export class AddPackageTypeComponent implements OnInit {

  packageTypeForm = new FormGroup({
    packageType: new FormControl
  });
  buttonName;
  tempResult;
  constructor(
    public dialogRef: MatDialogRef<AddPackageTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private packageTypeService: PackageTypeService,

  ) { }

  ngOnInit(): void {
    this.packageTypeForm = this.fb.group({
      packageType: ['', Validators.required],
    });
    if (this.data.idpackageType) {
      this.buttonName = 'save';
      this.packageTypeForm.get('packageType').setValue(this.data.name);
    }
    else {
      this.buttonName = 'add';
    }
  }
  addPackageType() {
    if (this.buttonName == 'add') {
      if (this.packageTypeForm.invalid) {
        window.alert("Please input the name of package type!")
      }
      else {
        this.packageTypeService.createPackageType(this.packageTypeForm.value).then(result => {
          this.tempResult = result;
          window.alert("Successfully added");
          this.dialogRef.close({ data: { idpackageType: this.tempResult.insertId, name: this.packageTypeForm.value.packageType }, status: 'success' });

        })
      }
    }
    else {
      if (this.packageTypeForm.invalid) {
        window.alert("Please input the name of package type!")
      }
      else {
        this.packageTypeService.editPackageType(this.data.idpackageType, this.packageTypeForm.value.packageType).then(result => {
          window.alert("Successfully saved");
          this.dialogRef.close();
        })
      }
    }
  }
}
