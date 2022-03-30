import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PackagesService } from 'src/app/service/packages.service';
import { OrdersService } from 'src/app/service/orders.service';

@Component({
  selector: 'kt-public-tracking',
  templateUrl: './public-tracking.component.html',
  styleUrls: ['./public-tracking.component.scss']
})
export class PublicTrackingComponent implements OnInit {
  trackingID;
  scanForm: FormGroup;
  statusTitle;
  statusText;
  statusTitleReady;
  statusTextReady;
  stepperFlag = false;
  tempResult;
  accepted;
  pickedUp;
  bodega;
  porEntregar;
  image_url;
  loader = 'false';
  constructor(
    private fb: FormBuilder,
    private packagesService: PackagesService,
    private ordersService: OrdersService,
    private changeDetectorRefs: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    this.image_url = window.localStorage.getItem("image_url");
    this.stepperFlag = false;
    this.scanForm = this.fb.group({
      idControl: ['', Validators.required],
    });
  }
  track() {
    this.statusTitle = undefined;
    this.statusTextReady = undefined;
    this.statusTitleReady = undefined;
    this.statusText = undefined;
    this.accepted = undefined;
    this.pickedUp = undefined;
    this.bodega = undefined;
    this.porEntregar = undefined;
    this.stepperFlag = false;
    console.log(this.trackingID);
    if (this.scanForm.invalid) {
      return;
    }
    // else if (!(this.scanForm.value.idControl.length == 7 && (this.scanForm.value.idControl.substring(0, 1) == 'h' || this.scanForm.value.idControl.substring(0, 1) == 'H'))) {
    //   console.log("invalid");
    //   this.statusTitle = "No existe";
    //   this.changeDetectorRefs.detectChanges();

    // }
    else {
      this.loader = 'true';
      var idpackages = this.scanForm.value.idControl;
      // var idpackages = Number(this.scanForm.value.idControl.substring(1));
      console.log("idpackages", this.scanForm.value);
      this.packagesService.getPackageByidpackages(idpackages).then(result => {
        console.log(result);
        this.tempResult = result;
        if (this.tempResult.length == 0) {
          this.loader = 'false';
          this.statusTitle = "No existe";
          this.changeDetectorRefs.detectChanges();
        }
        else {
          if (this.tempResult[0].status == "1") {
            this.loader = 'false';
            this.statusTitleReady = "Disponible";
            this.statusTextReady = "Tu paquete está listo para retirar"
            this.changeDetectorRefs.detectChanges();

          }
          else if (this.tempResult[0].status == "0") {
            this.loader = 'false';
            this.statusTitle = "En panamá";
            this.statusText = "Tu paquete se encuentra en Panamá y pronto estará disponible";
            this.changeDetectorRefs.detectChanges();

          }
          else if (this.tempResult[0].status == "3") {
            this.loader = 'false';
            this.statusTitle = "Completed";
            this.statusText = "Este paquete ya fue";
            this.changeDetectorRefs.detectChanges();

          }
          else if (this.tempResult[0].status == "2") {
            this.loader = 'false';
            this.statusTitle = "Delivery";
            this.changeDetectorRefs.detectChanges();

          }
          else if (this.tempResult[0].status == "4") {
            this.loader = 'false';
            this.statusTitle = "Cancel";
            this.changeDetectorRefs.detectChanges();

          }
          // console.log(this.tempResult[0].idwarehouse)
          // this.ordersService.getOrderLog(this.tempResult[0].idwarehouse).then(result => {
          //   console.log(result);
          //   var orderLogs: any;
          //   orderLogs = result;
          //   orderLogs.map(log => {
          //     if (log.status == '1') {
          //       this.accepted = log.date;
          //       this.stepperFlag = true;
          //       this.changeDetectorRefs.detectChanges();

          //     }
          //   })
          // console.log(this.tempResult[0].status);
          // this.packagesService.getPackageLog(idpackages).then(result => {
          //   console.log("log", result);
          //   var logs: any;
          //   logs = result;
          //   logs.map(log => {
          //     if (log.status == '1') {
          //       this.pickedUp = log.date;
          //       this.stepperFlag = true;
          //       this.changeDetectorRefs.detectChanges();

          //     }
          //     else if (log.status == '2') {
          //       this.bodega = log.date;
          //       this.stepperFlag = true;
          //       this.changeDetectorRefs.detectChanges();

          //     }
          //     else if (log.status == '3') {
          //       this.porEntregar = log.date;
          //       this.stepperFlag = true;
          //       this.changeDetectorRefs.detectChanges();

          //     }
          // else if (log.status == '4') {
          //   this.pickedUp = log.date;

          // }
          // else if (log.status == '5') {
          //   this.pickedUp = log.date;

          // }
          //     })
          // })
          // })


        }
      })
    }
  }
}
