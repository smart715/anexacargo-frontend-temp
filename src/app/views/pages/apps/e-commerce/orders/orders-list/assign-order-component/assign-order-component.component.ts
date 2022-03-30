import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessengerService } from 'src/app/service/messenger.service';
import { OrdersService } from 'src/app/service/orders.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'kt-assign-order-component',
  templateUrl: './assign-order-component.component.html',
  styleUrls: ['./assign-order-component.component.scss']
})

export class AssignOrderComponentComponent implements OnInit {

  tempResult;
  allMessengers =[];
  messengerForm: FormGroup;
  orders;


  constructor(
    private messengerService: MessengerService,
    private ordersService: OrdersService,

    public dialogRef: MatDialogRef<AssignOrderComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
    
  ) { }

  ngOnInit(): void {
    this.orders = this.data;
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
  async assignOrders(){
    if (this.messengerForm.invalid){
      return;
    }
    else {
      console.log(this.messengerForm.value.messenger);
      await this.orders.map(async order => {
        await this.ordersService.assignOrder(order.idorders, this.messengerForm.value.messenger).then(result => {
          console.log(result);
        }).catch(err => {
          window.alert("error occured")
        })
      })
      this.dialogRef.close();
    }
  }

}
