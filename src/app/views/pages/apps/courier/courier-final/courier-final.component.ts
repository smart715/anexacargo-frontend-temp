import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PackagesService } from 'src/app/service/packages.service';
import { OrdersService } from 'src/app/service/orders.service';
import { ImageService } from 'src/app/service/image.service';
import { WarehouseOrderService } from 'src/app/service/warehouse-order.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'kt-courier-final',
  templateUrl: './courier-final.component.html',
  styleUrls: ['./courier-final.component.scss']
})
export class CourierFinalComponent implements OnInit {
  selectedFile: ImageSnippet;
  detail;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private packagesService: PackagesService,
    private ordersService: OrdersService,
    private imageService: ImageService,
    private warehouseOrderService: WarehouseOrderService,
    private warehouseService: WarehouseService,
    private customerService: CustomerService,
  ) { }

  order;
  packages;
  receiver;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.order = params;
    })
  }

  getStatusString(status){
    if (status == '0'){
      return "pending";
    }
    else if (status == '1'){
      return "ready";
    }
    else if (status == '2'){
      return "delivery";
    }
    else if (status == '3'){
      return "completed";
    }
  }
  signature() {
    console.log(this.detail, this.order.idorders);
    console.log(this.selectedFile);

    if (window.confirm("scanning signature!")) {
      var idmessenger = window.localStorage.getItem('userID');
      this.warehouseOrderService.setWarehouseOrderStatus(this.order.idwarehouseOrder,'2', idmessenger).then(async result => {
        await this.warehouseService.getWarehousesByOrderID(this.order.idwarehouseOrder).then((warehouses:any) => {
          warehouses.map(async warehouse => {
            await this.warehouseService.setWarehouseStatus(warehouse.idwarehouse, '3').then(async result => {
              await this.warehouseService.createWarehouseLog('status changed into ' + this.getStatusString('3'), warehouse.idwarehouse, window.localStorage.getItem('userID')).then(async result => {
              })
            });
          })
        })
      });
      
      // this.ordersService.setOrderStatus(this.order.idorders, '2', idmessenger).then(result => {
      //   this.packagesService.getPackagesByOrderID(this.order.idorders).then(packages => {
      //     this.packages = packages;
      //     this.packages.map(_package => {

      //       var idmessenger = window.localStorage.getItem('userID');
      //       this.packagesService.setPackageStatus(_package, '5', idmessenger).then(result => {
      //       })
      //     })
      //   })
      // })

      if(this.selectedFile != undefined){
        this.imageService.uploadImage(this.selectedFile.file).then(result => {
          console.log(result);
          var tempResult: any = result;
          this.ordersService.createOrderDetail(this.order.idorders, this.detail, tempResult?.path).then(result => {
            console.log(result);
          })
  
        }).catch(err => {
          console.log(err);
        })
      }
      else{
        this.ordersService.createOrderDetail(this.order.idorders, this.detail, '').then(result => {
          console.log(result);
        })
      }




      window.alert("successfully delivered");
      this.router.navigate(['courier']);
    }
  }

  back() {
    this.router.navigate(['courier']);
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      console.log(this.selectedFile.file)
      // this.imageService.uploadImage(this.selectedFile.file).then(result => {
      //   console.log(result);
      // }).catch(err => {
      //   console.log(err);
      // })
    });

    reader.readAsDataURL(file);
  }
}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
