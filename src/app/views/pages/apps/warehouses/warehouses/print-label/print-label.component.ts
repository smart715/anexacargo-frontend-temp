import { Component, OnInit, Inject, ChangeDetectorRef, Pipe, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'src/app/service/orders.service';
import { CustomerService } from 'src/app/service/customer.service';
import { ImageService } from 'src/app/service/image.service';
import { SettingService } from 'src/app/service/setting.service';
import { async } from '@angular/core/testing';
import { NumberSymbol } from '@angular/common';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';


@Component({
  selector: 'kt-print-label',
  templateUrl: './print-label.component.html',
  styleUrls: ['./print-label.component.scss']
})

@Pipe({
  name: 'firstPrice'
})
export class PrintLabelComponent implements OnInit {
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;
  reportBase64String: any;
  order;
  customer;
  image_url;
  companyName;
  rucName;
  streetName;
  stateName;
  userName;
  email;
  TotalPrice;
  PersonalId;
  firstPrice;
  secondPrice;
  thirdPrice;
  nowDate;
  invoiceNumber;
  showOverlay;
  tracking;
  weight;
  volWeight;
  price_rate1;
  price_rate2;
  constructor(
    // public dialogRef: MatDialogRef<PrintLabelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ordersService: OrdersService,
    private customerService: CustomerService,
    private uploader: ImageService,
    private changeDetectorRefs: ChangeDetectorRef,
    private settingService: SettingService,
  ) {
  }
  ngOnInit(): void {
    this.showOverlay = true;

    const isMobile = window.navigator.userAgent.indexOf("mobile") > 0 ? true : false;
    console.log(this.data, 'data');
    const vWeight = (this.data.pack?.height * this.data.pack?.length * this.data.pack?.width / 166);
    this.weight = vWeight.toFixed(2) > parseFloat(this.data.pack?.weight).toFixed(2) ? vWeight : parseFloat(this.data.pack?.weight);
    this.volWeight = (Number(this.data.pack?.length) * Number(this.data.pack?.height) * Number(this.data.pack?.width) / 166).toFixed(2);
    this.TotalPrice = parseFloat(this.data.pack?.price).toFixed(2);
    this.tracking = this.data.pack?.tracking;
    this.firstPrice = parseFloat(this.data.pack?.firstPrice).toFixed(2) ?? 0.00;
    this.secondPrice = parseFloat(this.data.pack?.secondPrice).toFixed(2) ?? 0.00;
    this.thirdPrice = parseFloat(this.data.pack?.thirdPrice).toFixed(2) ?? 0.00;
    this.price_rate1 = (parseFloat(this.firstPrice) / parseFloat(this.weight)).toFixed(2);
    this.price_rate2 = (parseFloat(this.secondPrice) / parseFloat(this.weight)).toFixed(2);
    this.invoiceNumber = this.data.pack?.idwarehouse;
    this.nowDate = this.convertToDate(new Date().toLocaleDateString());
    this.userName = this.data.pack?.firstName + " " + this.data.pack?.lastName;
    this.customerService.getCustomerByID(this.data.pack.idcustomers).then(async result => {
      this.customer = result[0];
      console.log(this.customer, 'this.cumtomers');
      this.email = this.customer.email;

      console.log(isMobile, 'isMobile');
      this.PersonalId = this.customer.mobile;

      // this.PersonalId = (isMobile ? this.customer.mobile : this.customer.pID);
      this.changeDetectorRefs.detectChanges();
    })
    this.uploader.getImageUrl().then(result => {
      this.image_url = result[0]["image_url"];
      console.log(result)
      console.log(this.image_url)
      console.log(result[0]["image_url"])
      this.changeDetectorRefs.detectChanges();
    })
    this.settingService.getSettings().then(async (result) => {
      console.log('result', result);
      this.companyName = result[0]?.companyName;
      this.rucName = result[0]?.ruc;
      this.streetName = result[0]?.street;
      this.stateName = result[0]?.state;
      this.changeDetectorRefs.detectChanges();

    })
    setTimeout(() => {
      this.convetToPDF();
    }, 2000)
  }
  makeid(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  convertToDate(dateString) {
    // dateString is mm/dd/yyyy
    //  Convert a "dd/MM/yyyy" string into a Date object
    let d = dateString.split("/");
    let dat = (d[1] + '/' + d[0] + '/' + d[2]);
    return dat;
  }
  title = 'html-to-pdf-angular-application';
  public convetToPDF() {
    var data = document.getElementById('print');

    html2canvas(data).then(canvas => {
      // Few necessary setting options
      console.log(canvas, 'canvas')
      var imgWidth = 780;
      // var pageHeight = 300;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      // var heightLeft = imgHeight;
      domtoimage.toPng(data, { quality: 1 })
        .then((dataUrl) => {
          const contentDataURL = dataUrl;
          console.log(contentDataURL, 'dadaadfasdf')
          let pdf = new jspdf.jsPDF('p', 'pt', 'b5'); // A4 size page of PDF
          console.log(pdf, 'pdf')
          var position = 0;
          pdf.addImage(contentDataURL, 'PNG', -140, 20, imgWidth, imgHeight);
          const pdf_title = new Date().toLocaleDateString();
          pdf.save(pdf_title); // Generated PDF
          this.showOverlay = false
        });
    });
    // var pdf = new jspdf.jsPDF('p', 'pt', 'letter');
    // pdf.addHTML($('#content')[0], function () {
    //   pdf.save('Test.pdf'); //works and downloads the pdf
    //   pdf.output('dataurlnewwindow'); // gives error

    // });
  }
}