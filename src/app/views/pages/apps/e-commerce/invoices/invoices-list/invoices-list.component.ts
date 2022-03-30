import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationExtras } from '@angular/router';
import { InvoiceService } from 'src/app/service/invoice.service';
import { CustomerService } from 'src/app/service/customer.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { result } from 'lodash';


@Component({
  selector: 'kt-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.scss']
})
export class InvoicesListComponent implements OnInit {
  
	@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pipe: DatePipe;
	@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
		this.paginator = mp;
  }

  filterForm = new FormGroup({
    search: new FormControl(),
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  get fromDate() { return this.filterForm.get('fromDate').value; }
  get toDate() { return this.filterForm.get('toDate').value; }


	dataSource: MatTableDataSource<any>;
	displayedColumns = ['check','id','date','customer','orders', 'total', 'status'];

  setDataSourceAttributes() {
		this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.pipe = new DatePipe('en');
    this.dataSource.filterPredicate = (data, filter) =>{
      console.log("filterPredicate");
      this.pipe = new DatePipe('en');

      if (this.fromDate && this.toDate) {
        let newDate = new Date(data.date);
        console.log(newDate >= this.fromDate);

        return newDate >= this.fromDate && newDate <= this.toDate;
      }
      return true;
    }
  }
  total;
  allinvoices;
  userRole;
  payments;
  constructor(
    private router: Router,
    private invoiceService: InvoiceService,
    private customerService: CustomerService,

  ) {


  }

  ngOnInit(): void {
    this.userRole = window.localStorage.getItem('userRole');
    if(this.userRole == '1' || this.userRole == '10') {
      
      this.displayedColumns = ['check','id','date','customer','orders', 'total', 'status'];

      this.invoiceService.getAllInvoices().then(result => {
        console.log(result);
        this.allinvoices = result;
        this.allinvoices = this.allinvoices.reverse();
        this.total = this.allinvoices.length;
        this.allinvoices.map(invoice => {
          // invoice.date = new Date(invoice.date);
          // console.log("invoice.date", invoice.date);
          this.customerService.getCustomerByID(invoice.idcustomers).then(async result => {
            invoice.customer = result[0].firstName +" "+ result[0].lastName;





            this.invoiceService.getinvoicedOrdersByidinvoice(invoice.idinvoice).then(async result => {
              invoice.orders = result;
              invoice.total = 0;
              await invoice.orders.map(order => {
                invoice.total = Number(invoice.total) + Number(order.price);
                console.log("this.allinvoices",this.allinvoices);
              })
              invoice.total = (Number(Number(invoice.total).toFixed(2)) + Number((Number(invoice.total) * Number(invoice.itbmsP)/100).toFixed(2))).toFixed(2);
              

              if(invoice.status == '0'){
                invoice.paymentStatus = '0';
              }
              else {
                await this.invoiceService.getPaymentsByidinvoice(invoice.idinvoice).then(async payments => {
                  var inProgress = 0;
                  this.payments = payments;
                  this.payments.forEach(payment => {
                    if(payment.status == '0'){
                      inProgress = Number((Number(inProgress) + Number(payment.amount)).toFixed(2));
                    }
                  });
                  // await this.payments.map(payment => {
                  //   if(payment.status == '0'){
                  //     inProgress = Number((Number(inProgress) + Number(inProgress)).toFixed(2));
                  //   }
                  // })
                  if (inProgress == 0){
                    invoice.paymentStatus = '1';
                  }
                  else if (inProgress > 0 && inProgress < invoice.total) {
                    invoice.paymentStatus = '2';
                  }
                  else {
                    invoice.paymentStatus = '3';
                  }
                })
              }
              
              
              
              this.dataSource = new MatTableDataSource(this.allinvoices);
              this.setDataSourceAttributes();
            });
          });
        });
      });
    }
    else {
      this.displayedColumns = ['check','id','date','orders', 'total', 'status'];

      this.invoiceService.getInvoicesByCustomerID(window.localStorage.getItem('idcustomers')).then(result => {
        console.log(result);
        this.allinvoices = result;
        this.allinvoices = this.allinvoices.reverse();
        this.total = this.allinvoices.length;
        this.allinvoices.map(invoice => {
          // invoice.date = new Date(invoice.date);
          // console.log("invoice.date", invoice.date);
          this.customerService.getCustomerByID(invoice.idcustomers).then(async result => {
            invoice.customer = result[0].firstName +" "+ result[0].lastName;



            if(invoice.status == '0'){
              invoice.paymentStatus = '0';
            }
            else {
              await this.invoiceService.getPaymentsByidinvoice(invoice.idinvoice).then(async payments => {
                var inProgress = 0;
                this.payments = payments;
                await this.payments.map(payment => {
                  if(payment.status == '0'){
                    inProgress = Number((Number(inProgress) + Number(inProgress)).toFixed(2));
                  }
                })
                if (inProgress == 0){
                  invoice.paymentStatus = '1';
                }
                else if (inProgress > 0 && inProgress < invoice.total) {
                  invoice.paymentStatus = '2';
                }
                else {
                  invoice.paymentStatus = '3';
                }
              })
            }



            this.invoiceService.getinvoicedOrdersByidinvoice(invoice.idinvoice).then(async result => {
              invoice.orders = result;
              invoice.total = 0;
              await invoice.orders.map(order => {
                invoice.total = Number(invoice.total) + Number(order.price);
                console.log("this.allinvoices",this.allinvoices);
              })
              invoice.total = Number(invoice.total) + Number((invoice.total * Number(invoice.itbmsP)/100).toFixed(2));
              this.dataSource = new MatTableDataSource(this.allinvoices);
              this.setDataSourceAttributes();
            });
          });
        });
      })
    }



  }
  new(){
		this.router.navigate(['ecommerce/invoice/new']);
    // this.applyFilter();
  }

  detail(invoice){
    let naviagtionExtras: NavigationExtras = {
      queryParams: invoice
    }
		this.router.navigate(['ecommerce/invoice/detail'], naviagtionExtras);
  }

  edit(invoice){
    console.log(invoice);
    let naviagtionExtras: NavigationExtras = {
      queryParams: invoice
    }
		this.router.navigate(['ecommerce/invoice/new'], naviagtionExtras);

  }

  async exportToExcel() {
    var data = [];
    console.log("this.dataSource", this.dataSource.filteredData);
    this.dataSource.filteredData.forEach(row => {
      this.invoiceService.getPaymentsByidinvoice(row.idinvoice).then(payments => {
        console.log(payments);
        var _payments:any = payments;
        _payments.map(payment => {
          this.customerService.getCustomerByID(row.idcustomers).then(customers => {
            console.log(customers[0].firstName, customers[0].lastName, customers[0].company, customers[0].ruc);
            if (payment.status == '0'){
              data.push({
                id : payment.idpayment,
                date : payment.date,
                amount : payment.amount,
                customer : customers[0].firstName + ' ' + customers[0].lastName,
                company : customers[0].company,
                ruc : customers[0].ruc
              })
            }
          })
        })
      })
    })
    setTimeout(() => {
      const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
      const header = Object.keys(data[0]);
      let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');
  
      var a = document.createElement('a');
      var blob = new Blob(["\ufeff", csvArray], { type: 'text/csv; charset=utf-8;' }),
        url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = "CustomersList.csv";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, 500);
  }

  dateFilter(event) {
    this.dataSource.filter = ''+Math.random();
  }
	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches

		this.dataSource.filterPredicate = function(data, filter: string): boolean {
			console.log(data, filter);
			Object.keys(data).forEach(key => {
				if (data[key] == null || data[key] == undefined) {
					data[key] = '';
				}
			})
			return (data.customer.trim().toLowerCase().indexOf(filterValue) !== -1);
		};
		this.dataSource.filter = filterValue;
	}
}
