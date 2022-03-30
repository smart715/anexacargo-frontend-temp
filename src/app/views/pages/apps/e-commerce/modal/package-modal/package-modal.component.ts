import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PackagesService } from 'src/app/service/packages.service';
import { MessengerService } from 'src/app/service/messenger.service';

@Component({
  selector: 'kt-package-modal',
  templateUrl: './package-modal.component.html',
  styleUrls: ['./package-modal.component.scss']
})
export class PackageModalComponent implements OnInit {
  displayedColumnsLog = ['date', 'description', 'user'];
  dataSourceLog: MatTableDataSource<any>;
  logs: any = [];
  constructor(
    public dialogRef: MatDialogRef<PackageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public packagesService: PackagesService,
    public messengerService: MessengerService,



    ) { }

  ngOnInit(): void {
    console.log(this.data.pack.idpackages);
    this.packagesService.getPackageLog(this.data.pack.idpackages).then(result => {
      console.log(result);
      this.logs = result;
      this.logs.map(log => {
        this.messengerService.getMessengerByID(log.idmessengers).then(result => {
          log.user = result[0].name;
          if(log.status == '0'){
            log.description = 'package set Por Recoger';
          }
          else if(log.status == '1'){
            log.description = 'package set Recogido';
          }
          else if(log.status == '2'){
            log.description = 'package set bodega';
          }
          else if(log.status == '3'){
            log.description = 'package set Por Entregar';
          }
          else if(log.status == '4'){
            log.description = 'package Canceled';
          }
          else if(log.status == '5'){
            log.description = 'package Completed';
          }
          this.dataSourceLog = new MatTableDataSource(this.logs);
        })
      })
    })
  }
  // logs: any = [
  //   {
  //     id: 1,
  //     date: '02/02/20 14:28pm',
  //     description: 'Order Completed',
  //     user: 'Mruiz',
  //   },
  //   {
  //     id: 2,
  //     date: '02/02/20 14:28pm',
  //     description: 'Order Completed',
  //     user: 'Mruiz',
  //   },
  //   {
  //     id: 3,
  //     date: '02/02/20 14:28pm',
  //     description: 'Order Completed',
  //     user: 'Mruiz',
  //   },
  //   {
  //     id: 4,
  //     date: '02/02/20 14:28pm',
  //     description: 'Order Completed',
  //     user: 'Mruiz',
  //   }

  // ];
}
