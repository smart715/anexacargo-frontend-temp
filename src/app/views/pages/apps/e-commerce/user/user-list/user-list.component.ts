import { Component, OnInit, ViewChild } from '@angular/core';
import { FakeApiService } from '../../../../../../core/_base/layout/server/fake-api/fake-api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailComponent } from '../user-detail/user-detail.component';

import { MessengerService } from 'src/app/service/messenger.service'
@Component({
  selector: 'kt-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['name', 'user', 'email', 'role', 'status'];
  pageIndex: number = 0;
  length: number = 10;

  total: number = 0;

  users;
  constructor(
    public dialog: MatDialog,
    private messengerService: MessengerService,

  ) { }

  ngOnInit(): void {
    this.messengerService.getAllMembers().then(members => {
      this.users = members;
      this.dataSource = new MatTableDataSource(this.users);
      this.total = this.users.length;
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

  userDetail(user) {
    const dialogRef = this.dialog.open(UserDetailComponent, { data: { user } });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

}
