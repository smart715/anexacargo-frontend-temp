import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { WgroupsDetailComponent } from './wgroups-detail/wgroups-detail.component';

import { WGroupService } from 'src/app/service/w-group.service'
import { result } from 'lodash';
@Component({
  selector: 'kt-wgroups',
  templateUrl: './wgroups.component.html',
  styleUrls: ['./wgroups.component.scss']
})
export class WgroupsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['group', 'wPrice', 'vPrice','cubic','mWeight','bl','sed', 'action'];
  pageIndex: number = 0;
  length: number = 10;


  wGroups;
  constructor(
    public dialog: MatDialog,
    private wGroupService: WGroupService,

  ) { }

  ngOnInit(): void {
    this.wGroupService.getAllWGroup().then(result => {
      this.wGroups = result;
      this.dataSource = new MatTableDataSource(this.wGroups);
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
    const dialogRef = this.dialog.open(WgroupsDetailComponent, { data: { group } });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

  deleteGroup(group) {
    if (window.confirm("Are you be sure to delete this group?")){
      this.wGroupService.deleteWGroup(group.idwGroup).then(result => {
        this.ngOnInit();
      }).catch(err => {
        console.log(err);
      })
    }
  }
}

