import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PackagesService } from 'src/app/service/packages.service';
import { OrdersService } from 'src/app/service/orders.service';
import { ImageService } from 'src/app/service/image.service';
import { WarehouseOrderService } from 'src/app/service/warehouse-order.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { CustomerService } from 'src/app/service/customer.service';
import { result } from 'lodash';

@Component({
  selector: 'kt-courier-final',
  templateUrl: './courier-final.component.html',
  styleUrls: ['./courier-final.component.scss']
})
export class CourierFinalComponent implements OnInit {
  progress: number;
  infoMessage: any;
  isUploading: boolean = false;
  file: File;

  imageUrl: string | ArrayBuffer =
    "https://bulma.io/images/placeholders/480x480.png";
  fileName: string = "No file selected";

  constructor(private uploader: ImageService,
    private changeDetectorRefs: ChangeDetectorRef,

  ) { }

  ngOnInit() {
    this.uploader.getImageUrl().then(result => {
      this.imageUrl = result[0]?.image_url;
    });
  }

  onChange(file: File) {
    if (file) {
      this.fileName = file.name;
      this.file = file;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        this.imageUrl = reader.result;
        this.changeDetectorRefs.detectChanges();
      };
    }
  }

  onUpload() {
    this.infoMessage = null;
    this.progress = 0;
    this.isUploading = true;

    this.uploader.uploadImage(this.file).then(result => {
      if (!result["status"]) {
        this.isUploading = false;
        alert("Uploaded successfly");
      } else {
        alert("fail");
      }
      this.imageUrl = result["path"];
      window.localStorage.setItem("image_url", result["path"]);
      this.changeDetectorRefs.detectChanges();
    });
  }
}

class ImageSnippet {
  constructor(public src: string, public file: File) { }
}
