import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { InvoiceService } from 'src/app/service/invoice.service';

@Component({
  selector: 'kt-invoices-new-payment',
  templateUrl: './invoices-new-payment.component.html',
  styleUrls: ['./invoices-new-payment.component.scss']
})
export class InvoicesNewPaymentComponent implements OnInit {

	paymentForm: FormGroup;
  max;

  constructor(
    public dialogRef: MatDialogRef<InvoicesNewPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    
  ) { }
  ngOnInit(): void {
    console.log("this.data", this.data);
    this.max = Number(this.data.total) - Number(this.data.paymentsTotal)
    this.paymentForm = this.fb.group({
      description: ['', Validators.required],
      pending: new FormControl({ value: this.max, disabled: true }),
      paid: new FormControl({ value: this.data.paymentsTotal, disabled: true }),
			new: ['', Validators.compose([
				Validators.required,
				Validators.min(0),
				Validators.max(this.max)
			])],
    });
  }

  save(){
    if(this.paymentForm.invalid){
      return;
    }
    else {
     this.invoiceService.newPayment({
      description: this.paymentForm.value.description,
      amount: Number(this.paymentForm.value.new).toFixed(2),
      user: window.localStorage.getItem("userID"),
      status: '0',
      idinvoice: this.data.idinvoice
    }).then(result=> {
       console.log(result);
       this.dialogRef.close();
     })
    }
  }

}
