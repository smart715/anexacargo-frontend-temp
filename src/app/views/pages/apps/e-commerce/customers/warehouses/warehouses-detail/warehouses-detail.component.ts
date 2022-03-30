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

  });
  warehouse;
  courier;
  customer;
  title;
  style;
  editFlag;
  tempValue: any;
  tempCustomer: any;

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
    });
    this.route.queryParams.subscribe(params => {
      this.warehouse = JSON.parse(JSON.stringify(params));
      this.initView();
    })
  }

  async initView() {
    this.warehouseService.getWarehouseLog(this.warehouse.idwarehouse).then(result => {
      this.logs = result;
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
    if (this.warehouse.status == '3') {
      this.title = 'Cancelled';
      this.style = 'status4';
    };
    ///
    var idcustomers = this.warehouse.idcustomers.substring(3);
    this.customerService.getCustomerByID(idcustomers).then(result => {
      this.customer = result[0];
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
          customer: this.customer?.firstName + " " + this.customer.lastName,
          customerID: this.warehouse?.idcustomers,
          registration: this.courier?.date,//?
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
        this.myControl.setValue(this.warehouse?.idcustomers + " " + this.customer?.firstName + " " + this.customer.lastName);
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
    controls['price'].enable();
    controls['weight'].enable();
    // controls['volWeight'].enable();
    controls['m3'].enable();
    controls['taxes'].enable();
    controls['cubit'].enable();
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
    warehouseFormValue.idcustomers = this.myControl.value.substring(0, this.myControl.value.indexOf(' '));

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
        this.customerService.getCustomerByID(this.warehouse.idcustomers).then(customer => {
          let image_url = window.localStorage.getItem("image_url");
          var config = {
            email: customer[0].email,
            title: 'Tienes mercancía para retirar',
            html: '<div><img src="' + image_url + '" alt="Anexacargo" style="width:75px;" /><div style="margin-top: 20px;">Hola ' + customer[0].firstName + '</div><div style="margin-top: 10px;">Aexpress Cargo le informa que tiene mercancía disponible para retirar. A continuación los detalles de la mercancía recibida:</div><table><tr><th>Descripción</th><th>Peso Vol.</th><th>Peso(lbs)</th><th> </th><th>Total</th></tr><tr><td>1za5t360yw60156311</td><td>2.23</td><td>3.04</td><td></td><td>6.38</td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td>TOTAL</td><td>6.38</td></tr></table><div style="margin-top: 20px;">* Si desea solicitar o cotizar costo de entrega a domicilio, solicítalo a través de la app o responda a este mensaje con la dirección detallada y forma de pago</div><div style="margin-top: 20px;font-size:large;"><strong>DESCARGA NUESTRA APP</strong></div><div style="margin-top: 10px;">Recibe notificaciones al instante, realiza ordenes de domicilio y mucho más. Descargarla en link</div><div style="margin-top: 20px;font-size:large;"><strong>INFORMACIÓN DE PAGO:</strong></div><div style="margin-top: 10px;">Para su comodidad puede hacer los pagos con<strong> Mastercard, Visa o tarjeta Clave.</strong> También puederealizar su pago vía ACH o depósito a nuestra cuenta:</div><div style="margin-top: 10px;"><strong> Alisof, S.A.</strong> | Banco General | Cuenta de Ahorros</div><div style="margin-top: 10px;">Cuenta: 04-72-99-580423-8</div><div style="margin-top: 10px;"><strong> Enviar confirmación previa de pago al correo:</strong> cobros@Anexacargo.com</div><div style="margin-top: 20px;font-size:large;"><strong>HORARIOS DE ATENCIÓN</strong></div><div style="margin-top: 10px;">Lunes a Viernes: 8:00a.m. a 5:00p.m.</div><div style="margin-top: 10px;">Lunes a Viernes: 8:00a.m. a 5:00p.m.</div><div style="margin-top: 10px;"><strong>***No abrimos los Domingos***</strong></div></div>'
          }
          this.emailService.sendmail(config).then(result => {
            console.log(result);
            window.alert("email successfully delivered")
          }).catch(err => {
            console.log(err);
            window.alert("Unfortunately message did not delivered!");
          })

          this.notificationService.sendNotificationToSpecificUser(customer[0].idcustomers, '1 paquetes disponibles', 'Puedes retirar tus paquetes o pedirlos a domicilio').then(result => {
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
}
