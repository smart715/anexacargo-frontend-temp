import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { StateAreaService } from 'src/app/service/state-area.service';

@Component({
  selector: 'kt-edit-pricing',
  templateUrl: './edit-pricing.component.html',
  styleUrls: ['./edit-pricing.component.scss']
})
export class EditPricingComponent implements OnInit {

  dialogString;
  stateForm = new FormGroup({
    state: new FormControl,
    stateStatus: new FormControl
  });


  constructor(
    public dialogRef: MatDialogRef<EditPricingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private stateAreaService: StateAreaService,

  ) { }

  ngOnInit(): void {
    this.stateForm = this.fb.group({
      state: ['', Validators.required],
      stateStatus: ['', Validators.required],
    });

    this.dialogString = this.data.dialog;
    if (this.dialogString == "editState") {
      this.stateForm.setValue({ state: this.data.state.name, stateStatus: this.data.state.status });
    }
  }

  addState() {
    if (this.dialogString == "addState") {
      if (this.stateForm.invalid) {
        window.alert("Please input all field correctly!")
      }
      else {
        this.stateAreaService.createState(this.stateForm.value).then(result => {
          window.alert("successfully saved!");
          this.dialogRef.close({flag: "saved"});

        })
      }
    }
    else if (this.dialogString == "editState") {

      if (this.stateForm.invalid) {
        window.alert("Please input all field correctly!")
      }
      else {
        this.stateAreaService.editState(this.data.state.idstates, this.stateForm.value.state, this.stateForm.value.stateStatus).then(result => {
          window.alert("successfully saved!");
          this.dialogRef.close({flag: "saved"});
        })
      }

    }
  }

}
