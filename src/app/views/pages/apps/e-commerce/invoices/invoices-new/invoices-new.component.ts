import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CustomerService } from 'src/app/service/customer.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingService } from 'src/app/service/setting.service';
import { result } from 'lodash';


@Component({
  selector: 'kt-invoices-new',
  templateUrl: './invoices-new.component.html',
  styleUrls: ['./invoices-new.component.scss']
})
export class InvoicesNewComponent implements OnInit {
	myControl = new FormControl();
	options: any = [];
  customers;

	invoicedOrderForm: FormGroup;
  addFlag : boolean;
  dataSource: MatTableDataSource<any>;
	displayedColumns = ['description', 'price', 'action'];
  invoicedOrders:any = [];

  subtotal;
  itbms;
  itbmsP;

  total;

	filteredOptions: Observable<string[]>;
  idcustomers;

  tempResult;
  idinvoice;
  invoice;
  editFlag;
  originInvoicedOrders:any = [];
  constructor(
    private route: ActivatedRoute,
		private fb: FormBuilder,
    private customerService: CustomerService,
		private invoiceService: InvoiceService,
		private settingService: SettingService,
    
		private changeDetectorRefs: ChangeDetectorRef,
		private router: Router,

  ) { }

  async ngOnInit(): Promise<void> {

    this.route.queryParams.subscribe(params => {
      this.invoice = params;
    });
    console.log("this.invoice", this.invoice)
    await this.settingService.getSettings().then(result => {
      this.itbmsP = result[0].itbms
    })
    if(this.invoice.idinvoice){
      console.log("edit");
      this.editFlag = true;
      // this.invoicedOrders.push({
      //   description : this.invoicedOrderForm.value.description,
      //   price : this.invoicedOrderForm.value.price,
      // })
      this.invoiceService.getinvoicedOrdersByidinvoice(this.invoice.idinvoice).then(async result => {
        this.invoicedOrders = result;
        await this.invoicedOrders.map(order => {
          this.originInvoicedOrders.push(order);
        })
        this.dataSource = new MatTableDataSource(this.invoicedOrders);
        this.calc();
        this.changeDetectorRefs.detectChanges();
      })
    }
    else {
      this.editFlag = false;
      console.log("new");
    }

    this.addFlag = false;

    this.subtotal = 0;
    this.itbms = 0;
    this.total = 0;

    this.invoicedOrderForm = this.fb.group({
			description: ['', Validators.required],
			price: ['', Validators.required],
		});
    this.dataSource = new MatTableDataSource(this.invoicedOrders);
    let filter = {}
    this.customerService.getAll(filter).then(result => {
      this.customers = result;
      this.customers.map(result => {
        this.options.push({ firstName: result.firstName, lastName: result.lastName, company: result.company, idcustomers: result.idcustomers });
        this.changeDetectorRefs.detectChanges();
      
      })
    })

    this.filteredOptions = this.myControl.valueChanges.pipe(
			startWith(''),
			map(value => this._filter(value))
		);
  }

  tryAdd(){
    this.addFlag = true;
  }

  add(){
    if(this.invoicedOrderForm.invalid){
      return;
    }
    else {
      this.invoicedOrders.push({
        description : this.invoicedOrderForm.value.description,
        price : Number(this.invoicedOrderForm.value.price).toFixed(2),
      })
      this.dataSource = new MatTableDataSource(this.invoicedOrders);
      this.calc();
      this.addFlag = false;

    }
  }

  delete(index){
    this.invoicedOrders.splice(index, 1);
    console.log(index,this.invoicedOrders);
    this.dataSource = new MatTableDataSource(this.invoicedOrders);
    this.calc();
  }

  async publish(){
    console.log(this.invoicedOrders);
    console.log("this.originInvoicedOrders",this.originInvoicedOrders);
    if(this.editFlag){
      if(this.invoicedOrders.length == 0){
        window.alert("can't publish empty invoice");
      }
      else {
        await this.originInvoicedOrders.map(invoicedOrder => {
          this.invoiceService.deleteInvoicedOrder(invoicedOrder.idinvoicedOrder).then(result => {
            console.log(result);
          })
        })
        await this.invoicedOrders.map(invoicedOrder => {
          this.invoiceService.createNewInvoicedOrder(invoicedOrder, this.invoice.idinvoice).then(result => {
            console.log(result);
          })
        })
        // window.alert("successfully saved!");
        this.router.navigate(['ecommerce/invoice']);
      }
    }
    else{
      if(this.invoicedOrders.length == 0){
        window.alert("can't publish empty invoice");
      }
      else if (this.myControl.value == undefined || this.myControl.value == "" || this.myControl.value == null) {
        window.alert("select customer");
      }
      else {
        this.invoiceService.createNewInvoice(this.idcustomers, '1', this.itbmsP).then(result => {
          console.log(result);
          this.tempResult = result;
          this.idinvoice = this.tempResult.insertId;
          this.invoicedOrders.map(async invoicedOrder => {
            await this.invoiceService.createNewInvoicedOrder(invoicedOrder, this.idinvoice).then(result => {
              console.log(result);
  
  
            })
          })
          // window.alert("successfully saved!");
          this.router.navigate(['ecommerce/invoice']);
        })
      }
    }
  }

  customerChange(option) {
		console.log(option);
		this.idcustomers = option.idcustomers;
	}

  async calc(){
    this.subtotal = 0;
    this.itbms = 0;
    this.total = 0;
    await this.invoicedOrders.map(invoicedOrder => {
      this.subtotal = Number(this.subtotal) + Number(invoicedOrder.price);
    })
    this.itbms = Number(Number(this.subtotal) * Number(this.itbmsP)/100);
    this.total = Number(this.subtotal) + Number(this.itbms);
    console.log(this.subtotal, this.itbms, this.total);
    this.subtotal = Number(this.subtotal).toFixed(2);
    this.itbms = Number(this.itbms).toFixed(2);
    this.total = Number(this.total).toFixed(2);

  }
  private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.options.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0);
	}
}
