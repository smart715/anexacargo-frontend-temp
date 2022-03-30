import { HttpParams } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { conforms } from 'lodash';
import { CustomerGroupsService } from 'src/app/service/customer-groups.service';
import { CustomerService } from 'src/app/service/customer.service';
import { WGroupService } from 'src/app/service/w-group.service';
import {CustomerLogComponent as CustomerLog} from '../customer-log/customer-log.component';
@Component({
  selector: 'kt-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})

export class CustomerViewComponent implements OnInit,AfterViewInit  {
  @ViewChild(CustomerLog) child;

  customer;
  
  tempCustomer;
  changeStatus;
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private wGroupService: WGroupService,
    private customerGroupsService: CustomerGroupsService,
    private changeDetectorRefs: ChangeDetectorRef,

    public router: Router) { }

  customerID;
  
  status;
  statusClass;
  tempResult;
  disabledFlag = true; //flag to check if edit 
  // values of ngmodel
  firstName;
  lastName;
  email;
  phone;
  mobile;
  company;
  register;
  address;
  ruc;
  pID;
  customerGroup;
  idwGroup;
  customerGroups;
  wGroups;
  ngAfterViewInit() {
    console.log(this.child,'this.child');
  }
  ngOnInit(): void {


    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.customerID = params.anexaid;
      this.customer.idcustomers = params.anexaid;
    });
    // this.customer = this.router.lastSuccessfulNavigation.extras.state.Navigation;
    // this.customerID = this.customer.idcustomers;
    this.customerService.getCustomerByID(this.customerID).then((result: any) => {
      this.customer = result[0];
      result[0]
      if (result[0].status == '0') {
        this.status = "Active";
        this.statusClass = "status3";
      }
      else {
        this.statusClass = "status2"
        this.status = "InActive";
      }
      this.firstName = result[0].firstName;
      this.lastName = result[0].lastName;
      this.email = result[0].email;
      this.phone = result[0].phone;
      this.mobile = result[0].mobile;
      this.company = result[0].company;
      this.register = result[0].register;
      this.address = result[0].address;
      this.ruc = result[0].ruc;
      this.pID = result[0].pID;

      this.customerGroup = result[0].customerGroup;
      this.idwGroup = result[0].idwGroup;
      this.changeDetectorRefs.detectChanges();

    });
    this.customerGroupsService.getAllCustomerGroups().then(customerGroups => {
      this.customerGroups = customerGroups;
      this.customerGroups.map(customerGroup => {
        customerGroup.idcustomerGroup = customerGroup.idcustomerGroup.toString();
      })
    });
    this.wGroupService.getAllWGroup().then((result: any) => {
      this.wGroups = result;
      this.wGroups.map(wGroup => {
        wGroup.idwGroup = wGroup.idwGroup.toString();
      })
    });
  }

  back() {
    this.router.navigate(['ecommerce/customers']);
  }
  updateStatus(event) {
    if (confirm("Are you sure to change the status?")) {
      this.status = event.target.innerText;
      if (this.status == "Active") {
        this.statusClass = "status3"
        this.customerService.updateStatus(this.customer.idcustomers, '0').then(result => {
          this.tempResult = result;
          if (this.tempResult.status == 'ok') {
            window.alert("Successfully updated");
            this.customerService.createCustomerLog(window.localStorage.getItem('userID'), this.customer.idcustomers, 'status : inactive --> active').then(result => {
              console.log(result);
              this.ngOnInit();
            })
          }
          else {
            window.alert("Error Occured");
          }
        })
      }
      else {
        this.statusClass = "status2"
        this.customerService.updateStatus(this.customer.idcustomers, '1').then(result => {
          this.tempResult = result;
          if (this.tempResult.status == 'ok') {
            window.alert("Successfully updated");
            this.customerService.createCustomerLog(window.localStorage.getItem('userID'), this.customer.idcustomers, 'status :  active --> inactive').then(result => {
              console.log(result);
              this.ngOnInit();
            })
          }
          else {
            window.alert("Error Occured");
          }
        })
      }
    }
  }
  editProfile() {
    this.disabledFlag = false;
    this.tempCustomer = this.customer;
  }
  updateProfile() {
    this.disabledFlag = true;

    if ((this.tempCustomer.firstName == this.firstName) &&
      (this.tempCustomer.lastName == this.lastName) &&
      (this.tempCustomer.email == this.email) &&
      (this.tempCustomer.phone == this.phone) &&
      (this.tempCustomer.mobile == this.mobile) &&
      (this.tempCustomer.company == this.company) &&
      (this.tempCustomer.register == this.register) &&
      (this.tempCustomer.ruc == this.ruc) &&
      (this.tempCustomer.pID == this.pID) &&

      (this.tempCustomer.customerGroup == this.customerGroup) &&
      (this.tempCustomer.idwGroup == this.idwGroup) &&
      (this.tempCustomer.address == this.address)) {
    }
    else {
      if (confirm("Are you sure to update profile?")) {
        var temp = {
          address: this.address,
          ruc: this.ruc,
          pID: this.pID,

          company: this.company,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          mobile: this.mobile,
          phone: this.phone,
          register: this.register,
          idwGroup: this.idwGroup,
          customerGroup: this.customerGroup,

        }
        this.customerService.updateProfile(this.tempCustomer.idcustomers, temp).then(result => {
          console.log(result);
          this.tempResult = result;
          if (this.tempResult.status == 'ok') {
            window.alert("Successfully Updated!");
            var descriptions = '';
            for (var key of Object.keys(temp)) {
              // console.log(key);
              if (this.tempCustomer[key] != temp[key]) {
                console.log(key, this.tempCustomer[key], temp[key]);
                descriptions = descriptions + key + " : " + this.tempCustomer[key] + " --> " + temp[key] + " | ";
              }
            }
            console.log(descriptions);
            this.customerService.createCustomerLog(window.localStorage.getItem('userID'), this.tempCustomer.idcustomers, descriptions).then(result => {
              console.log(result);
              this.customer = this.tempCustomer;
              this.changeDetectorRefs.detectChanges();
              this.ngOnInit();

              const queryValue = this.router['location']._platformLocation.location.search.replace("?anexaid=","");
              let navigationExtras: NavigationExtras = {
                queryParams: {
                    "anexaid": queryValue
                }
            };
            this.changeStatus = true;
            this.child.changeStatus = true;
            this.child.changeDetectorRefs.detectChanges();
            this.changeDetectorRefs.detectChanges();
            console.log(this.child)
            // console.log(this.child,'this.child');
            this.router.onSameUrlNavigation = 'reload';

            // this.router.navigate(['ecommerce/customers/view'],navigationExtras)

            })
          }
          else {
            window.alert("Error occured!")
          }
        }).catch(err => {
          console.log(err);
          window.alert("Error occured!");
          this.ngOnInit();
        })
      }
    }
  }

}
