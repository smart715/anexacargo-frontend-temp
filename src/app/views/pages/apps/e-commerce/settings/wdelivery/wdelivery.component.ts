import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { WdeliveryDetailComponent } from './wdelivery-detail/wdelivery-detail.component';
import { WDeliveryService } from 'src/app/service/w-delivery.service'
@Component({
  selector: 'kt-wdelivery',
  templateUrl: './wdelivery.component.html',
  styleUrls: ['./wdelivery.component.scss']
})
export class WdeliveryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['group', 'price', 'action'];
  pageIndex: number = 0;
  length: number = 10;


  wDelivery;
  constructor(
    public dialog: MatDialog,
    private wDeliveryService: WDeliveryService,

  ) { }

  ngOnInit(): void {
    this.wDeliveryService.getAllWDelivery().then(result => {
      this.wDelivery = result;
      this.dataSource = new MatTableDataSource(this.wDelivery);
      this.setDataSourceAttributes();
    })
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onPaginateChange(event) {
    this.pageIndex = event.pageIndex;
    this.length = event.pageSize;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  viewGroup(group) {
    const dialogRef = this.dialog.open(WdeliveryDetailComponent, { data: { group } });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

  deleteGroup(group) {
    if (window.confirm("Are you be sure to delete this group?")){
      this.wDeliveryService.deleteWDelivery(group.idwDelivery).then(result => {
        this.ngOnInit();
      }).catch(err => {
        console.log(err);
      })
    }
  }
}


