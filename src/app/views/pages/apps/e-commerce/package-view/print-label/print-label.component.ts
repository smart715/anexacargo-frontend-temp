import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/service/orders.service';
import { CustomerService } from 'src/app/service/customer.service';


@Component({
  selector: 'kt-print-label',
  templateUrl: './print-label.component.html',
  styleUrls: ['./print-label.component.scss']
})
export class PrintLabelComponent implements OnInit {

  order;
  customer;
  image_url;
  constructor(
    public dialogRef: MatDialogRef<PrintLabelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ordersService: OrdersService,
    private customerService: CustomerService,

  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.image_url = window.localStorage.getItem("image_url");
    this.ordersService.getOrderByID(this.data.pack.idorders).then(result => {
      this.order = result[0];
      console.log(this.order);
      this.customerService.getCustomerByID(this.order.idcustomers).then(result => {
        this.customer = result[0];
      })
    })
  }
  print() {

  }
}
