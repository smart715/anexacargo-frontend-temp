import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MessengerService } from 'src/app/service/messenger.service';
import { OrdersService } from 'src/app/service/orders.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { result } from 'lodash';

@Component({
  selector: 'kt-warehouse-assigned-to',
  templateUrl: './warehouse-assigned-to.component.html',
  styleUrls: ['./warehouse-assigned-to.component.scss']
})
export class WarehouseAssignedToComponent implements OnInit {

  tempResult;
  allMessengers =[];
  messengerForm: FormGroup;
  packages;


  constructor(
    private messengerService: MessengerService,
    private ordersService: OrdersService,

    public dialogRef: MatDialogRef<WarehouseAssignedToComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
    
  ) { }

  ngOnInit(): void {
    this.packages = this.data;
    console.log(this.packages);
    this.messengerForm = this.fb.group({
			messenger: ['', Validators.required],
    });
    console.log("this.data",this.data);
    this.messengerService.getAllMembers().then(result => {
      this.tempResult = result;
      this.tempResult.map(messenger => {
        console.log(messenger);
        if(messenger.role == '2' && messenger.status == '0'){
          this.allMessengers.push(messenger);
        }
      })
    })
  }
  async assignPackage(){
    if (this.messengerForm.invalid){
      return;
    }
    else {
      console.log(this.messengerForm.value.messenger);
      await this.packages.map(async _package => {
        console.log(_package);
        await this.ordersService.assignOrder(_package.idorders, this.messengerForm.value.messenger).then(result => {
          console.log(result);
        }).catch(err => {
          window.alert("error occured")
        })
      })
      this.dialogRef.close({assignedTo: this.messengerForm.value.messenger});
    }
  }

}
