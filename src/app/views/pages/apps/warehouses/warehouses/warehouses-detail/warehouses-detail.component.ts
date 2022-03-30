import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CourierService } from 'src/app/service/courier.service';
import { CustomerService } from 'src/app/service/customer.service';
import { EmailService } from 'src/app/service/email.service';
import { MessengerService } from 'src/app/service/messenger.service';
import { NotificationService } from 'src/app/service/notification.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'kt-warehouses-detail',
  templateUrl: './warehouses-detail.component.html',
  styleUrls: ['./warehouses-detail.component.scss']
})
export class WarehousesDetailComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  options: any = [];

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['date', 'description', 'user'];
  logs;
  modalFrom = new FormGroup({
    firstPriceInput: new FormControl,
    secondPriceInput: new FormControl,
    firstPriceWeight: new FormControl,
    secondPriceWeight: new FormControl,
  })
  warehouseFrom = new FormGroup({
    tracking: new FormControl,
    warehouse: new FormControl,
    courier: new FormControl,
    type: new FormControl,
    customer: new FormControl,
    customerID: new FormControl,
    registration: new FormControl,
    price: new FormControl,
    weight: new FormControl,
    volWeight: new FormControl,
    m3: new FormControl,
    taxes: new FormControl,
    cubit: new FormControl,
    idcustomers: new FormControl,
    firstName: new FormControl,
    lastName: new FormControl,
    wareWidth: new FormControl,
    wareHeight: new FormControl,
    wareLength: new FormControl,
  });
  warehouse;
  courier;
  customer;
  title;
  style;
  editFlag;
  tempValue: any;
  tempCustomer: any;
  tracking;
  weight;
  price_rate1;
  price_rate2;
  TotalPrice;
  firstPrice;
  secondPrice;
  thirdPrice;
  firstname;
  email;
  idcustomers
  PersonalId;

  modal = 'false';
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private courierService: CourierService,
    private customerService: CustomerService,
    private warehouseService: WarehouseService,
    private router: Router,
    private messengerService: MessengerService,
    private changeDetectorRefs: ChangeDetectorRef,
    private emailService: EmailService,
    private notificationService: NotificationService,

  ) { }

  async ngOnInit(): Promise<void> {

    this.editFlag = false;
    this.warehouseFrom = this.fb.group({
      tracking: ['', Validators.required],
      warehouse: ['', Validators.required],
      courier: ['', Validators.required],
      type: ['', Validators.required],
      customer: ['', Validators.required],
      customerID: ['', Validators.required],
      registration: ['', Validators.required],
      price: ['', Validators.required],
      weight: ['', Validators.required],
      volWeight: ['', Validators.required],
      m3: ['', Validators.required],
      taxes: ['', Validators.required],
      cubit: ['', Validators.required],
      idcustomers: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      wareWidth: ['', Validators.required],
      wareHeight: ['', Validators.required],
      wareLength: ['', Validators.required],

    });

    this.route.queryParams.subscribe(params => {
      this.warehouse = JSON.parse(JSON.stringify(params));
      console.log(JSON.parse(JSON.stringify(params)), 'JSON.parse(JSON.stringify(params))')
      this.initView();
    })
    this.warehouseService.getWarehouseModal(this.warehouse.idwarehouse).then(result => {
      const vWeight = (result[0].height * result[0].length * result[0].width / 166);
      this.weight = vWeight.toFixed(2) > parseFloat(result[0].weight).toFixed(2) ? vWeight : parseFloat(result[0].weight);
      this.TotalPrice = parseFloat(result[0].price).toFixed(2);
      this.tracking = result[0].tracking;
      this.firstPrice = parseFloat(result[0].firstPrice).toFixed(2) ?? 0.00;
      this.secondPrice = parseFloat(result[0].secondPrice).toFixed(2) ?? 0.00;
      this.thirdPrice = parseFloat(result[0].thirdPrice).toFixed(2) ?? 0.00;
      this.price_rate1 = (parseFloat(this.firstPrice) / parseFloat(this.weight)).toFixed(2);
      this.price_rate2 = (parseFloat(this.secondPrice) / parseFloat(this.weight)).toFixed(2);
      this.changeDetectorRefs.detectChanges();
    })
  }

  async initView() {
    this.warehouseService.getWarehouseLog(this.warehouse.idwarehouse).then(result => {
      this.logs = result;
      for (var i = 0; i < this.logs.length; i++) {
        this.logs[i]["date"] = formatDate(new Date(this.logs[i]["date"]), 'dd-MM-yyyy hh:mm:ss', 'en-US');
      }
      this.logs.map(log => {
        this.messengerService.getMessengerByID(log.user).then(result => {
          log.admin = result[0]?.name;
          this.dataSource = new MatTableDataSource(this.logs);
          this.changeDetectorRefs.detectChanges();
        })
      })
    })
    let filter = {}
    await this.customerService.getAll(filter).then(async (result: any) => {
      await result.map(result => {
        this.options.push({ firstName: result.firstName, lastName: result.lastName, idcustomers: result.idcustomers });
      })

    })
    if (this.warehouse.status == '0') {
      this.title = 'Pending';
      this.style = 'status0';
    }
    if (this.warehouse.status == '1') {
      this.title = 'Ready';
      this.style = 'status1';
    }
    if (this.warehouse.status == '2') {
      this.title = 'Delivery';
      this.style = 'status2';
    }
    if (this.warehouse.status == '3') {
      this.title = 'Completed';
      this.style = 'status3';
    }
    if (this.warehouse.status == '4') {
      this.title = 'Cancelled';
      this.style = 'status4';
    };
    ///
    var idcustomers = this.warehouse.idcustomers;
    this.customerService.getCustomerByID(idcustomers).then(result => {
      this.customer = result[0];
      this.firstname = result[0].firstName;
      this.email = result[0].email;
      this.idcustomers = result[0].idcustomers
      this.courierService.getCourierByID(this.warehouse.idcourier).then(result => {
        this.courier = result[0];
        var type;
        if (this.warehouse.type == 'China') {
          type = '2'
        }
        else if (this.warehouse.type == "Air") {
          type = '0'
        }
        else {
          type = '1'
        }
        this.warehouseFrom.patchValue({
          tracking: this.warehouse?.tracking,
          warehouse: this.warehouse?.warehouse,
          courier: this.courier?.courier, //?
          type: type,
          customer: this.customer?.firstName + " " + this.customer?.lastName,
          customerID: this.warehouse?.idcustomers,
          registration: formatDate(new Date(this.courier?.date), 'dd-MM-yyyy hh:mm:ss', 'en-US'),//?
          price: this.warehouse?.price,
          weight: this.warehouse?.weight,
          volWeight: this.getVolWeight(this.warehouse),
          m3: this.warehouse?.m3,
          taxes: this.warehouse?.taxes,
          cubit: this.warehouse?.cubit,
          idcustomers: this.warehouse?.idcustomers,
          firstName: this.warehouse?.firstName,
          lastName: this.warehouse?.lastName,
        })
        this.warehouse.idcustomers = this.warehouse.idcustomers < 10 ? '250' + this.warehouse?.idcustomers : '25' + this.warehouse?.idcustomers;

        this.myControl.setValue(this.warehouse?.idcustomers + " " + this.customer?.firstName + " " + this.customer?.lastName);
      })
    })

    const controls = this.warehouseFrom.controls;
    for (const name in controls) {
      controls[name].disable();
    }
    this.myControl.disable();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  getVolWeight(warehouse) {
    var volWeight;
    volWeight = (Number(warehouse?.length) * Number(warehouse?.height) * Number(warehouse?.width) / 166).toFixed(2);
    return volWeight;
  }

  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.firstName.toLowerCase().indexOf(filterValue) === 0 || option.lastName.toLowerCase().indexOf(filterValue) === 0 || option.idcustomers.toString().toLowerCase().indexOf(filterValue) === 0);

  }

  edit() {
    this.editFlag = true;
    const controls = this.warehouseFrom.controls;
    this.tempValue = this.warehouseFrom.value;
    this.tempCustomer = this.myControl.value;
    // console.log(this.tempValue);
    // for (const name in controls) {
    //   controls[name].enable();
    // }
    controls['tracking'].enable();
    controls['warehouse'].enable();
    // controls['customerID'].enable();
    // controls['price'].enable();
    controls['weight'].enable();
    // controls['volWeight'].enable();
    controls['m3'].enable();
    controls['taxes'].enable();
    controls['cubit'].enable();
    controls['wareWidth'].enable();
    controls['wareHeight'].enable();
    controls['wareLength'].enable();

    this.myControl.enable();


  }
  save() {
    this.myControl.disable();

    var description = '';
    this.editFlag = false;
    const controls = this.warehouseFrom.controls;
    if (this.tempCustomer != this.myControl.value) {
      description = description + "customer" + " : " + this.tempCustomer + "-->" + this.myControl.value + " | "
    }
    for (const name in controls) {
      controls[name].disable();
      if (this.tempValue[name] != this.warehouseFrom.controls[name].value) {
        description = description + name + " : " + this.tempValue[name] + "-->" + this.warehouseFrom.controls[name].value + " | "
      }
    }
    // console.log(this.tempValue);
    // console.log(this.warehouse,this.warehouseFrom.value);
    // for (const key of this.warehouseFrom.value) {
    //   // if(this.tempValue[key] != this.warehouseFrom.value[key]){
    //   //   console.log(key, this.tempValue[key], this.warehouseFrom.value[key]);
    //   // }
    // }
    let warehouseFormValue = this.warehouseFrom.value;
    if (this.warehouse.idcustomers.slice(2) < 10) {
      warehouseFormValue.idcustomers = this.warehouse.idcustomers.slice(3);
    }
    else {
      warehouseFormValue.idcustomers = this.warehouse.idcustomers.slice(2);
    }
    if (description.length > 0) {
      this.warehouseService.editWarehouse(this.warehouseFrom.value, this.warehouse.idwarehouse).then(async result => {
        await this.warehouseService.createWarehouseLog(description, this.warehouse.idwarehouse, window.localStorage.getItem('userID')).then(async result => {
          window.alert("Successfully updated!");
          // this.warehouse.idcustomers = warehouseFormValue.idcustomers;
          // this.warehouse.tracking = warehouseFormValue.tracking;
          // this.warehouse.warehouse = warehouseFormValue.warehouse;
          // this.warehouse.price = warehouseFormValue.price;
          // this.warehouse.weight = warehouseFormValue.weight;
          // this.warehouse.taxes = warehouseFormValue.taxes;
          // this.warehouse.cubit = warehouseFormValue.cubit;
          // this.initView();
          setTimeout(() => {
            this.router.navigate(['warehouse']);
          }, 1000);
        })
      })
    }
  }
  changeCustomer(values) {
    this.warehouseFrom.patchValue({ idcustomers: values.idcustomers })
    this.warehouseFrom.patchValue({ firstName: values.firstName })
    this.warehouseFrom.patchValue({ lastName: values.lastName })
  }
  menuChange(event) {
    var html = ''
    this.title = event.target.outerText;
    var status;
    if (this.title == 'Pending') {
      this.style = 'status0';
      status = '0'
    }
    if (this.title == 'Ready') {
      this.style = 'status1';
      status = '1'
    }
    if (this.title == 'Delivery') {
      this.style = 'status2';
      status = '2'
    }
    if (this.title == 'Completed') {
      this.style = 'status3';
      status = '3'
    }
    console.log(status, this.warehouse);
    this.warehouseService.setWarehouseStatus(this.warehouse.idwarehouse, status).then(async result => {
      console.log(result);
      console.log(result, status);
      await this.warehouseService.createWarehouseLog('status ' + this.getStatusString(this.warehouse.status) + ' --> ' + this.getStatusString(status), this.warehouse.idwarehouse, window.localStorage.getItem('userID')).then(async result => {
        console.log(result);
        window.alert("Successfully updated!");
        await this.warehouseService.getWarehouseLog(this.warehouse.idwarehouse).then(result => {
          this.logs = result;
          for (var i = 0; i < this.logs.length; i++) {
            this.logs[i]["date"] = formatDate(new Date(this.logs[i]["date"]), 'dd-MM-yyyy hh:mm:ss', 'en-US');
          }
          this.logs.map(log => {
            console.log(log);
            this.messengerService.getMessengerByID(log.user).then(result => {
              log.admin = result[0].name;
              this.dataSource = new MatTableDataSource(this.logs);
              this.changeDetectorRefs.detectChanges();
            })
          })
        })
      })

      if (result['status'] = 'ok' && status == '1') {
        let image_url = window.localStorage.getItem("image_url");
        this.customerService.getTableContent().then(result => {
          let all_content = result['length'] ? result[0]['content'] : "", content1, content2, content3;
          let table = '<table class="table table-striped table-bordered my-table" style="border:1px solid black;border-collapse:collapse; font-size:14px;"><tr style = "font-size: 11px;border:1px solid black;" ><th class="center" style="border:1px solid black;padding:16px;font-size:14px;"># </th><th class="hidden-xs" style="border:1px solid black;font-size:14px;"> Descripción </th>\
                  <th class="center" style="border:1px solid black;padding:16px;font-size:14px;">Peso/vol</th>\
                    <th class="center" style="border:1px solid black;padding:16px;font-size:14px;">Tarifa Peso / vol</th>\
                      <th class="center" style="border:1px solid black;padding:16px;font-size:14px;"> Total </th>\
                        </tr>\
                        <tbody style = "font-size: 10.5px;border:1px solid black;">\
                          <tr style="border:1px solid black;">\
                          <td class="center" style="border:1px solid black; font-size:14px;"> 1 </td>\
                            <td class="hidden-xs" style="border:1px solid black; font-size:14px;">\
                              Servicio de carga\
          '+ this.tracking + '\
          </td>\
            <td class="center"  style="border:1px solid black; font-size:14px;">'+ this.warehouse.weight + '</td>\
        <td class= "center" style="border:1px solid black; font-size:14px;" >'+ this.price_rate1 + '</td>\
        <td class= "center" style="border:1px solid black; font-size:14px;" > '+ this.warehouse.firstPrice + ' </td>\
          </tr>\
          <tr>\
          <td class="center" style="border:1px solid black; font-size:14px;"> 2 </td>\
            <td class="hidden-xs" style="border:1 solid black; font-size:14px;">\
              trámites de aduana\
                </td>\
                <td class="center" style="border:1px solid black; font-size:14px;" >'+ this.weight + '</td>\
    <td class= "center" style="border:1px solid black; font-size:14px;" >'+ this.price_rate2 + '</td>\
    <td style="border:1px solid black; font-size:14px;"> '+ this.secondPrice + '</td>\
      </tr>\
          <tr>\
          <td class="center" style="border:1px solid black; font-size:14px;"> 3 </td>\
            <td class="hidden-xs" style="border:1px solid black; font-size:14px;">\
                </td>\
                <td class="center" style="border:1px solid black; font-size:14px;" ></td>\
    <td class= "center" style="border:1px solid black; font-size:14px;" ></td>\
    <td style="border:1px solid black; font-size:14px;"> '+ this.TotalPrice + '</td>\
      </tr>\
              </tbody>\
              </table>';
          if (result['length'] && (all_content.includes('{username}') || all_content.includes('{table}'))) {
            content1 = all_content.replaceAll("{username}", this.firstname);
            content2 = content1.replaceAll("{table}", table)
          }
          let imageURL = '<img alt="Anexacargo" src="' + image_url + '" width = "136" height = "36"/>';
          var style = "<style> .th .td {border: 1px solid black;}.th {padding: 16px;}.table {border: 1px solid black;border-collapse: collapse;}</style>"
          var htmll = imageURL + ' ' + content2;
          var config = {
            email: this.email,
            title: 'Tienes mercancía para retirar',
            html: htmll
          }
          this.emailService.sendmail(config).then(result => {
            console.log(result);
            window.alert("email successfully delivered")
          }).catch(err => {
            console.log(err);
            window.alert("Unfortunately message did not delivered!");
          })

          this.notificationService.sendNotificationToSpecificUser(this.idcustomers, '1 paquetes disponibles', 'Puedes retirar tus paquetes o pedirlos a domicilio').then(result => {
            console.log(result);
            // window.alert("Push notification and email sent");

          }).catch(err => {
            console.log(err);
            // window.alert("Unfortunately notification not sent!");

          })
        })
      }

    }).catch(err => {
      window.alert("Unfortunately bug occured!");
    })
  }

  getStatusString(status) {
    if (status == '0') {
      return "pending";
    }
    else if (status == '1') {
      return "ready";
    }
    else if (status == '2') {
      return "delivery";
    }
    else if (status == '3') {
      return "completed";
    } else if (status == '4') {
      return "cancelled";
    }
  }

  redirectToCustomerView() {
    console.log("customerView");
    console.log(this.myControl.disabled);
    if (this.myControl.disabled) {
      var customer = { idcustomers: this.warehouse.idcustomers };
      let naviagtionExtras: NavigationExtras = {
        queryParams: customer
      }
      this.router.navigate(['ecommerce/customers/view'], naviagtionExtras);
    }

  }
  modalFunc() {
    this.warehouseService.getWarehouseModal(this.warehouse.idwarehouse).then(result => {
      const vWeight = (result[0].height * result[0].length * result[0].width / 166);
      this.weight = vWeight.toFixed(2) > parseFloat(result[0].weight).toFixed(2) ? vWeight : parseFloat(result[0].weight);
      this.TotalPrice = parseFloat(result[0].price).toFixed(2);
      this.tracking = result[0].tracking;
      this.firstPrice = parseFloat(result[0].firstPrice).toFixed(2) ?? 0.00;
      this.secondPrice = parseFloat(result[0].secondPrice).toFixed(2) ?? 0.00;
      this.thirdPrice = parseFloat(result[0].thirdPrice).toFixed(2) ?? 0.00;
      this.price_rate1 = (parseFloat(this.firstPrice) / parseFloat(this.weight)).toFixed(2);
      this.price_rate2 = (parseFloat(this.secondPrice) / parseFloat(this.weight)).toFixed(2);
      this.modal = 'true';
      this.changeDetectorRefs.detectChanges();
    })
  }
  cancel_modal() {
    this.modal = 'false';
    this.changeDetectorRefs.detectChanges();

  }
  firstPriceChange() {
    alert();
  }
  save_modal() {
    const controls = this.modalFrom.controls;
    const firstValue = controls['firstPriceInput'].value;
    const secondValue = controls['secondPriceInput'].value;
    const price = controls['firstPriceInput'].value * this.weight + controls['secondPriceInput'].value * this.weight;
    if (firstValue == '' || secondValue == '') {
      alert('Insert value!');
      return;
    }
    else {
      this.warehouseService.insertWarehouseModal(firstValue * this.weight, secondValue * this.weight, price, this.warehouse.idwarehouse).then(result => {
        if (result) {
          alert('success');
          this.warehouseFrom.patchValue({
            price: price
          })
          this.modal = 'false'
          this.changeDetectorRefs.detectChanges();
        }
      })
    }
  }

  cal_firstPrice() {
    const controls = this.modalFrom.controls;
    this.firstPrice = controls['firstPriceInput'].value * this.weight;
  }
  cal_secondPrice() {
    const controls = this.modalFrom.controls;
    this.secondPrice = controls['secondPriceInput'].value * this.weight;
  }
}
