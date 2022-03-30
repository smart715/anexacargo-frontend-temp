import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CustomerService } from 'src/app/service/customer.service';
import { ImageService } from 'src/app/service/image.service';
import { SettingService } from 'src/app/service/setting.service';

@Component({
  selector: 'kt-welcom',
  templateUrl: './welcom.component.html',
  styleUrls: ['./welcom.component.scss']
})
export class WelcomComponent implements OnInit {
  contentData;
  constructor(
    private customerService: CustomerService,
    private settingService: SettingService,
    private changeDetectorRefs: ChangeDetectorRef,
    private uploader: ImageService,


  ) { }
  customer;
  idcustomer: string;
  firstname;
  lastname;
  aexid;
  content;
  content1;
  content2;
  content3;
  content4;
  image_url;
  showStatus;
  async ngOnInit(): Promise<void> {
    this.idcustomer = window.localStorage.getItem('idcustomers');
    this.settingService.getSettings().then(result => {
      this.showStatus = result[0].hideOrUnhide;
    });
    this.uploader.getImageUrl().then((result) => {
      // console.log(result)
      this.image_url = result[0]?.image_url;
      this.changeDetectorRefs.detectChanges();

      console.log(this.image_url)
    })
    await this.customerService.getCustomerByID(this.idcustomer).then(async customer => {
      this.firstname = customer[0].firstName;
      this.lastname = customer[0].lastName;
      this.aexid = "AEX" + customer[0].idcustomers
    })
    await this.customerService.getPsb().then(async result => {
      console.log(result, 'result')
      this.customer = {
        content: result[0]?.content
      }
      this.idcustomer = parseInt(this.idcustomer) < parseInt('10') ? '250' + this.idcustomer : '25' + this.idcustomer
      if (result[0]?.content.includes("{anexaid}") || result[0]?.content.includes("{lastname}") || result[0]?.content.includes("{name}")) {
        this.customer.content1 = this.customer.content.replaceAll("{anexaid}", this.idcustomer);
        this.customer.content2 = this.customer.content1.replaceAll("{lastname}", this.lastname);
        this.customer.content3 = this.customer.content2.replaceAll("{name}", this.firstname);
      } else {
        this.customer.content3 = result[0]?.content;
      }

      this.content4 = this.customer?.content3;
      this.changeDetectorRefs.detectChanges();
      // if (result) {
      // } else {
      //   this.content3 = "";
      // }

      // this.contentData.
    })
  }
  // async ngAfterViewInit(){

  // }
  navigateUrl(url) {
    window.open(url, "_blank");
  }

}