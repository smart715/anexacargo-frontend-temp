import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/service/customer.service';
import { EmailService } from 'src/app/service/email.service';
import { NotificationService } from 'src/app/service/notification.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { SettingService } from 'src/app/service/setting.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
@Component({
  selector: 'kt-change-warehouse-status',
  templateUrl: './change-warehouse-status.component.html',
  styleUrls: ['./change-warehouse-status.component.scss']
})
export class ChangeWarehouseStatusComponent implements OnInit {
  statusForm: FormGroup;
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
  price_rate1;
  price_rate2;
  pdf;
  contentDataURL
  constructor(
    public dialogRef: MatDialogRef<ChangeWarehouseStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private changeDetectorRefs: ChangeDetectorRef,
    private customerService: CustomerService,
    private emailService: EmailService,
    private notificationService: NotificationService,
    private settingService: SettingService,
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
    });
    this.settingService.getSettings().then(async (result) => {
      console.log('result', result);
      this.companyName = result[0]?.companyName;
      this.rucName = result[0]?.ruc;
      this.streetName = result[0]?.street;
      this.stateName = result[0]?.state;
      this.changeDetectorRefs.detectChanges();
    })

  }

  async changeStatus() {
    if (this.statusForm.invalid) {
      return;
    }
    else {
      console.log(this.statusForm.value.status);
      console.log(this.data);
      var scannedWarehousesByCustomer = this.data.reduce(function (obj, value) {
        var key = `${value.idcustomers}`;
        if (obj[key] == null) obj[key] = [];

        obj[key].push(value);
        return obj;
      }, {});

      if (this.statusForm.value.status == '1') {
        if (window.confirm("Are you sure want to publish?")) {
          console.log('scannedWarehousesByCustomer', scannedWarehousesByCustomer)
          for (var key of Object.keys(scannedWarehousesByCustomer)) {
            var html = '';
            var totalPrice = 0;
            const writeHtml = async () => {
              return Promise.all(scannedWarehousesByCustomer[key].map(warehouse => {
                html = html + '<tr><td style="border:1px solid black;">' + warehouse.tracking + '</td><td style="border:1px solid black;">' + warehouse.weight + '</td><td style="border:1px solid black;">' + this.getVolWeight(warehouse) + '</td><td style="border:1px solid black;"></td><td style="border:1px solid black;">' + warehouse.price + '</td></tr>';
                totalPrice = totalPrice + parseFloat(warehouse.price);
                this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, '1').then(async result => {
                  await this.warehouseService.createWarehouseLog('status changed into ready', warehouse.idwarehouse, window.localStorage.getItem('userID')).then(async result => {
                  })
                });
              }))
            }
            writeHtml().then(async result => {
              this.ngOnInit();
              await this.customerService.getCustomerByID(key).then(async result => {
                this.email = result[0].email;
                this.PersonalId = result[0].mobile;

                // this.PersonalId = (isMobile ? this.customer.mobile : this.customer.pID);
                this.changeDetectorRefs.detectChanges();
              })
              await this.warehouseService.getWarehousePdf(key).then((result: any) => {
                console.log(result)
                const vWeight = (result[0].height * result[0].length * result[0].width / 166);
                this.weight = vWeight.toFixed(2) > parseFloat(result[0].weight).toFixed(2) ? vWeight : parseFloat(result[0].weight);
                this.TotalPrice = parseFloat(result[0].price).toFixed(2);
                this.tracking = result[0].tracking;
                this.firstPrice = parseFloat(result[0].firstPrice).toFixed(2) ?? 0.00;
                this.secondPrice = parseFloat(result[0].secondPrice).toFixed(2) ?? 0.00;
                this.thirdPrice = parseFloat(result[0].thirdPrice).toFixed(2) ?? 0.00;
                this.price_rate1 = (parseFloat(this.firstPrice) / parseFloat(this.weight)).toFixed(2);
                this.price_rate2 = (parseFloat(this.secondPrice) / parseFloat(this.weight)).toFixed(2);
                this.invoiceNumber = result[0].idwarehouse;
                this.nowDate = this.convertToDate(new Date().toLocaleDateString());
                this.userName = result[0].firstName + " " + result[0].lastName;
                this.changeDetectorRefs.detectChanges();
              })
              await this.customerService.getCustomerByID(key).then(async (customer: any) => {
                var data = document.getElementById('print');
                await html2canvas(data).then(async canvas => {
                  // Few necessary setting options
                  // console.log(canvas, 'canvas')
                  var imgWidth = 780;
                  // // var pageHeight = 300;
                  var imgHeight = canvas.height * imgWidth / canvas.width;
                  // // var heightLeft = imgHeight;
                  this.contentDataURL = canvas.toDataURL('image/jpeg', 1.0)
                  this.pdf = new jspdf.jsPDF('p', 'pt', 'b5'); // A4 size page of PDF
                  var position = 0;
                  await this.pdf.addImage(this.contentDataURL, 'PNG', -140, 20, imgWidth, imgHeight);
                  // this.pdf.getFileFromVFS()
                  // this.pdf.save('mypdf');
                  // domtoimage.toPng(data, { quality: 1 })
                  //   .then((dataUrl) => {
                  //     this.contentDataURL = dataUrl;
                  //     console.log(dataUrl);
                  //     // let pdf = new jspdf.jsPDF('p', 'pt', 'b5'); // A4 size page of PDF
                  //     // console.log(pdf, 'pdf')
                  //     // var position = 0;
                  //     this.pdf.addImage(this.contentDataURL, 'PNG', -140, 20, imgWidth, imgHeight);
                  //     // console.log(pdf, '123123123123123123123123123123123');
                  //     this.pdf.save('mypdf');
                  // });
                })
                let image_url = window.localStorage.getItem("image_url");
                this.customerService.getTableContent().then(result => {
                  let all_content = result['length'] ? result[0]['content'] : "", content1, content2, content3;
                  let table = '<table style="border:1px solid black;border-collapse:collapse;"><tr><th style="border:1px solid black;padding:16px;">Descripción</th><th style="border:1px solid black;padding:16px;">Peso(lbs)</th><th style="border:1px solid black;padding:16px;">Peso Vol.</th><th style="border:1px solid black; padding:16px;"> </th><th style="border:1px solid black; padding:16px;">Total</th></tr>' + html + '<tr><td style="border:1px solid black;height:18px"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td></tr><tr><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;">TOTAL</td><td style="border:1px solid black;">$' + totalPrice.toFixed(2) + '</td></tr></table>';
                  if (result['length'] && (all_content.includes('{username}') || all_content.includes('{table}'))) {
                    content1 = all_content.replaceAll("{username}", customer[0].firstName);
                    content2 = content1.replaceAll("{table}", table)
                  }
                  let imageURL = '<img alt="Anexacargo" src="' + image_url + '" width = "136" height = "36"/>';
                  var style = "<style> .th .td {border: 1px solid black;}.th {padding: 16px;}.table {border: 1px solid black;border-collapse: collapse;}</style>"
                  var htmll = imageURL + ' ' + content2;
                  // var style = "<style> .th .td {border: 1px solid black;}.th {padding: 16px;}.table {border: 1px solid black;border-collapse: collapse;}</style>"
                  // var htmll = '<table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td class="o_hide" align = "center" style = "display: none;font-size: 0;max-height: 0;width:0;line-height: 0;overflow: hidden;mso-hide: all;visibility: hidden;" > Email Summary(Hidden)</td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td class="o_bg-light o_px-xs o_pt-lg o_xs-pt-xs" align = "center" style = "background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-top: 32px;" ><table class="o_block" width = "100%" cellspacing = "0" cellpadding = "0" border = "0" role = "presentation" style = "max-width: 632px;margin: 0 auto;"><tbody><tr><td class="o_bg-white o_px o_py-md o_br-t o_sans o_text" align = "center" style = "font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;background-color: #ffffff;border-radius: 4px 4px 0px 0px;padding-left: 16px;padding-right: 16px;padding-top: 24px;padding-bottom: 24px;" ><p style="margin-top: 0px;margin-bottom: 0px;" ><a class="o_text-primary" href = "" style = "text-decoration: none;outline: none;color: #126de5;"><img src=' + image_url + ' width = "136" height = "36" alt = "SimpleApp" style = "max-width: 136px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;"></a></p></td></tr></tbody></table></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td class="o_bg-light o_px-xs" align = "center" style = "background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;" ><table class="o_block" width = "100%" cellspacing = "0" cellpadding = "0" border = "0" role = "presentation" style = "max-width: 632px;margin: 0 auto;"><tbody><tr><td class="o_bg-ultra_light o_px-md o_py-xl o_xs-py-md o_sans o_text-md o_text-light" align = "center" style = "font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 19px;line-height: 28px;background-color: #ebf5fa;color: #82899a;padding-left: 24px;padding-right: 24px;padding-top: 30px;padding-bottom: 30px;" ><h2 class="o_heading o_text-dark o_mb-xxs" style = "font-family: Helvetica, Arial, sans-serif;font-weight: bold;margin-top: 0px;margin-bottom: 4px;color: #242b3d;font-size: 30px;line-height: 39px;" > Tienes paquetes disponibles! </h2></td></tr></tbody></table></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody><tr><td class="o_bg-light o_px-xs" align = "center" style = "background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;" ><table class="o_block" width = "100%" cellspacing = "0" cellpadding = "0" border = "0" role = "presentation" style = "max-width: 632px;margin: 0 auto;" ><tbody><tr><td class="o_bg-white o_px-md" align = "center" style = "background-color: #ffffff;padding-left: 24px;padding-right: 24px;" ><table cellspacing="0" cellpadding = "0" border = "0" role = "presentation" ><tbody><tr><td width="500" class="o_py o_sans o_text o_text-light o_bb-light" align = "left" style = "font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 16px;line-height: 24px;color: #82899a;padding-top: 16px;padding-bottom: 5px;" >' + content2 + '</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table><table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation"><tbody ><tr><td class="o_bg-light o_px-xs o_pb-lg o_xs-pb-xs" align = "center" style = "background-color: #dbe5ea;padding-left: 8px;padding-right: 8px;padding-bottom: 32px;"><table class="o_block" width = "100%" cellspacing = "0" cellpadding = "0" border = "0" role = "presentation" style = "max-width: 632px;margin: 0 auto;" ><tbody><tr><td class="o_bg-white o_br-b o_sans" style = "font-size: 8px;line-height: 8px;height: 8px;font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;background-color: #ffffff;border-radius: 0px 0px 4px 4px;" >&nbsp;</td></tr><tr><td class="o_px-md o_py-lg o_br-b o_sans o_text-xs o_text-light" align = "center" style = "font-family: Helvetica, Arial, sans-serif;margin-top: 0px;margin-bottom: 0px;font-size: 14px;line-height: 21px;color: #82899a;border-radius: 0px 0px 4px 4px;padding-left: 24px;padding-right: 24px;padding-top: 32px;padding-bottom: 32px;" ><p class="o_mb" style = "margin-top: 0px;margin-bottom: 16px;" > <a class="o_text-primary" href = "" style = "text-decoration: none;outline: none;color: #126de5;" > <img src="https://appapi.anexacargo.com/uploads/logo_icon-light.png" width = "36" height = "36" alt = "SimpleApp" style = "max-width: 36px;-ms-interpolation-mode: bicubic;vertical-align: middle;border: 0;line-height: 100%;height: auto;outline: none;text-decoration: none;" ></a></p><p class="o_mb" style = "margin-top: 0px;margin-bottom: 16px;" > Anexacargo Panamá </p> <p class="o_mb" style = "margin-top: 0px;margin-bottom: 16px;" >Bella vista, Via Argentina, <br>Ciudad de Panamá</p><p style = "margin-top: 0px;margin-bottom: 0px;" ><a class="o_text-light o_underline" href = "https://www.facebook.com/Anexa-Cargo-106564958532273" style = "text-decoration: underline;outline: none;color: #82899a;" > Facebook </a><span class="o_hide-xs">&nbsp; • &nbsp;</span> <br class="o_hide-lg" style = "display: none;font-size: 0;max-height: 0;width: 0;line-height: 0;overflow: hidden;mso-hide: all;visibility: hidden;" ><a class="o_text-light o_underline" href = "https://www.instagram.com/anexacargopty/" style = "text-decoration: underline;outline: none;color: #82899a;" > Instagram </a> <span class="o_hide-xs">&nbsp; • &nbsp;</span> <br class="o_hide-lg" style = "display: none;font-size: 0;max-height: 0;width: 0;line-height: 0;overflow: hidden;mso-hide: all;visibility: hidden;" ></p></td></tr></tbody></table><div class="o_hide-xs" style = "font-size: 64px; line-height: 64px; height: 64px;" >&nbsp; </div></td></tr></tbody></table>'
                  // var style = "<style> .th .td {border: 1px solid black;}.th {padding: 16px;}.table {border: 1px solid black;border-collapse: collapse;}</style>"
                  // var htmll = '<div><img alt="Anexacargo" src="' + image_url + '" style="width:75px;"/><div style="margin-top: 20px;">Hola ' + customer[0].firstName + '</div><div style="margin-top: 10px;">Aexpress Cargo le informa que tiene mercancía disponible para retirar. A continuación los detalles de la mercancía recibida:</div><table style="border:1px solid black;border-collapse:collapse;"><tr><th style="border:1px solid black;padding:16px;">Descripción</th><th style="border:1px solid black;padding:16px;">Peso(lbs)</th><th style="border:1px solid black;padding:16px;">Peso Vol.</th><th style="border:1px solid black; padding:16px;"> </th><th style="border:1px solid black; padding:16px;">Total</th></tr>' + html + '<tr><td style="border:1px solid black;height:18px"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td></tr><tr><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;"></td><td style="border:1px solid black;">TOTAL</td><td style="border:1px solid black;">$' + totalPrice.toFixed(2) + '</td></tr></table><div style="margin-top: 20px;">* Si desea solicitar o cotizar costo de entrega a domicilio, solicítalo a través de la app o responda a este mensaje con la dirección detallada y forma de pago</div><div style="margin-top: 20px;font-size:large;"><strong>DESCARGA NUESTRA APP</strong></div><div style="margin-top: 10px;">Recibe notificaciones al instante, realiza ordenes de domicilio y mucho más. Descargarla en link</div><div style="margin-top: 20px;font-size:large;"><strong>INFORMACIÓN DE PAGO:</strong></div><div style="margin-top: 10px;">Para su comodidad puede hacer los pagos con<strong> Mastercard, Visa o tarjeta Clave.</strong> También puederealizar su pago vía ACH o depósito a nuestra cuenta:</div><div style="margin-top: 10px;"><strong> Alisof, S.A.</strong> | Banco General | Cuenta de Ahorros</div><div style="margin-top: 10px;">Cuenta: 04-72-99-580423-8</div><div style="margin-top: 10px;"><strong> Enviar confirmación previa de pago al correo:</strong> cobros@Anexacargo.com</div><div style="margin-top: 20px;font-size:large;"><strong>HORARIOS DE ATENCIÓN</strong></div><div style="margin-top: 10px;">Lunes a Viernes: 8:00a.m. a 5:00p.m.</div><div style="margin-top: 10px;">Lunes a Viernes: 8:00a.m. a 5:00p.m.</div><div style="margin-top: 10px;"><strong>***No abrimos los Domingos***</strong></div></div>'
                  this.notificationService.sendNotificationToSpecificUser(key, scannedWarehousesByCustomer[key].length + ' paquetes disponibles', 'Puedes retirar tus paquetes o pedirlos a domicilio').then(result => {
                    console.log(result);
                    // window.alert("Push notification and email sent");

                  }).catch(err => {
                    console.log(err);
                    // window.alert("Unfortunately notification not sent!");

                  })
                  // customer[0]?.email
                  this.emailService.sendmail({ email: customer[0]?.email, html: htmll, title: 'Tienes mercancía para retirar', key: this.contentDataURL }).then(result => {
                    console.log(result);
                  }).catch(err => {
                    console.log(err);
                  })
                  this.dialogRef.close();
                })
              });
            })
          }
        }

      }
      else {
        await this.data.map(async warehouse => {
          await this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, this.statusForm.value.status).then(async result => {
            await this.warehouseService.createWarehouseLog('status changed into ' + this.getStatusString(this.statusForm.value.status), warehouse.idwarehouse, window.localStorage.getItem('userID')).then(async result => {
            })
            console.log(result);
          }).catch(err => {
            console.log("Unfortunately bug occured!");
          })
        })
        this.dialogRef.close();
      }
    }
  }
  convertToDate(dateString) {
    // dateString is mm/dd/yyyy
    //  Convert a "dd/MM/yyyy" string into a Date object
    let d = dateString.split("/");
    let dat = (d[1] + '/' + d[0] + '/' + d[2]);
    return dat;
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
    }
  }
  getVolWeight(warehouse) {
    var volWeight;
    volWeight = (Number(warehouse?.length) * Number(warehouse?.height) * Number(warehouse?.width) / 166).toFixed(2);
    return volWeight;
  }
}
