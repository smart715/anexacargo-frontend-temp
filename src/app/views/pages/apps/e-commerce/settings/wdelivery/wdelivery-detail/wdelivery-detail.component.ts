import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { WDeliveryService } from 'src/app/service/w-delivery.service'

@Component({
  selector: 'kt-wdelivery-detail',
  templateUrl: './wdelivery-detail.component.html',
  styleUrls: ['./wdelivery-detail.component.scss']
})
export class WdeliveryDetailComponent implements OnInit {

  groupForm = new FormGroup({
    name: new FormControl,
    price: new FormControl
  });



  constructor(
    public dialogRef: MatDialogRef<WdeliveryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private wDeliveryService: WDeliveryService,

    
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
    });

    if (this.data.group != '') {
      console.log('edit');
      this.groupForm.setValue({
        name: this.data.group.name,
        price: this.data.group.price,
      })
    }
    else {
      console.log('new');

    }
  }

  cancel() {
    this.dialogRef.close();
  }

  save() {
    const controls = this.groupForm.controls;
		/** check form */
		if (this.groupForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
    else {
      if (this.data.group != '') {
        console.log('edit');
        this.wDeliveryService.editWDelivery({
          idwDelivery: this.data.group.idwDelivery,
          name: this.groupForm.value.name,
          price: this.groupForm.value.price,
        }).then(result => {
          this.dialogRef.close();
        }).catch(err => {
          console.log(err);
        })
      }
      else {
        console.log('new');
        this.wDeliveryService.createWDelivery({
          name: this.groupForm.value.name,
          price: this.groupForm.value.price,
        }).then(result => {
          this.dialogRef.close();
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
}


