import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomerNewComponent } from '../customer-new/customer-new.component'
import { result } from 'lodash';
import { CustomerService } from 'src/app/service/customer.service';
import { OrdersService } from 'src/app/service/orders.service';
@Component({
  selector: 'kt-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
  dataSourceCustomer: MatTableDataSource<any>;
  displayedColumns = ['id', 'firstName', 'lastName', 'registered', 'status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  total_count: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  filterValue: string = "";
  customers;
  all_customers;
  tempresult;
  filterStatus: string = "";
  sort: string = 'desc';
  sortName: string = 'idcustomers';
  showOverlay: boolean = false;
  perPageSize;
  constructor(
    private customerService: CustomerService,
    private ordersService: OrdersService,

    private router: Router,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,

  ) { }
  setDataSourceAttributes() {
    this.dataSourceCustomer.paginator = this.paginator;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.filterValue = filterValue;
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.ngOnInit();
  }
  async ngOnInit(): Promise<void> {
    this.showOverlay = true;
    let filter = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      sortName: this.sortName,
      sort: this.sort,
      filterStatus: this.filterStatus,
      filterValue: this.filterValue,
    }
    await this.customerService.getAll(filter).then((result: any) => {
      this.total_count = result.length;
      this.all_customers = result;
    })
    await this.customerService.getCustomerByFilter(filter).then(async result => {
      this.customers = result;
      console.log(result, 'result')
      if (!this.customers.length) {
        this.showOverlay = false;
        this.dataSourceCustomer = new MatTableDataSource([]);
        return this.changeDetectorRefs.detectChanges();;
        // if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
        //   !(this.changeDetectorRefs as ViewRef).destroyed) {
        //   return this.changeDetectorRefs.detectChanges();
        // }
      }
      // var i = 0;
      let firstNumber = this.customers[0]["idcustomers"];
      await this.customers.map((customer, index) => {

        customer.indexcustomer = customer.idcustomers < 10 ? ("250" + customer.idcustomers) : ("25" + customer.idcustomers);
      })
      let tempData = [];
      for (var i = 0; i < filter.pageSize * filter.pageIndex; i++) {
        tempData.push({});
      }
      tempData = tempData.concat(this.customers);
      tempData.length = this.total_count;
      this.perPageSize = tempData.length > 10 ? 10 : tempData.length;
      this.dataSourceCustomer = new MatTableDataSource(tempData);
      this.setDataSourceAttributes();
      this.showOverlay = false;
      if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
        !(this.changeDetectorRefs as ViewRef).destroyed) {
        return this.changeDetectorRefs.detectChanges();
      }
    })
  }
  getServerData(event?: any) {
    this.dataSourceCustomer = new MatTableDataSource();
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.ngOnInit();
  }
  addCustomer() {
    // let naviagtionExtras: NavigationExtras = {
    //   queryParams: customer
    // }
    this.router.navigate(['ecommerce/customers/new']);
    // const dialogRef = this.dialog.open(CustomerNewComponent, { data: {} });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result?.status == "success") {
    //     this.customers.push({
    //       address: result.data.address,
    //       company: result.data.company,
    //       customerGroup: result.data.type,
    //       email: result.data.email,
    //       firstName: result.data.firstName,
    //       lastName: result.data.lastName,
    //       mobile: result.data.mobile,
    //       orders: '0',
    //       phone: result.data.phone,
    //       register: result.registered,
    //       ruc: result.data.phone,
    //       status: '0'
    //     })
    //     this.dataSourceCustomer = new MatTableDataSource(this.customers);
    //     this.setDataSourceAttributes();
    //   }
    // })
  }

  filterBystatus() {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.ngOnInit();
  }

  deleteCustomer(customer) {
    if (confirm("Can you be sure to delete this customer?")) {
      this.customerService.deleteCustomerByID(customer.idcustomers).then(result => {
        this.tempresult = result;
        if (this.tempresult.status == 'ok') {
          window.alert("Successfully Deleted!")
        }
        else {
          window.alert("Error occured!")
        }
      });
      const index: number = this.customers.indexOf(customer);
      if (index !== -1) {
        this.customers.splice(index, 1);
      }
      this.dataSourceCustomer = new MatTableDataSource(this.customers);
      this.setDataSourceAttributes();
    }
  }
  viewCustomer(customer) {
    console.log(customer)
    let naviagtionExtras: NavigationExtras = {
      queryParams: customer
    }
    // this.router.navigate(['ecommerce/customers/view'], naviagtionExtras);
    this.router.navigate(['ecommerce/customers/view'], {
      state: { Navigation: customer },
      queryParams: { anexaid: customer.idcustomers }
    });
  }
  exportToExcel() {
    var data = [];
    for (var i = 0; i < this.all_customers.length; i++) {
      var element: any = {};
      element['ID'] = "25" + (i + 1);
      element['First Name'] = this.all_customers[i].firstName;
      element['Last Name'] = this.all_customers[i].lastName;
      element['Email'] = this.all_customers[i].email;
      element['Phone'] = this.all_customers[i].phone;
      element['Registered'] = this.all_customers[i].register;
      element['Status'] = this.all_customers[i].status == '0' ? "Active" : "InActive";
      element['Last Name'] = this.all_customers[i].lastName;
      data.push(element);
    }
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
  }
}
