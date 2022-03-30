import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerGroupsService } from 'src/app/service/customer-groups.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCustomerGroupsComponent } from './add-customer-groups/add-customer-groups.component';

@Component({
  selector: 'kt-customer-groups',
  templateUrl: './customer-groups.component.html',
  styleUrls: ['./customer-groups.component.scss']
})
export class CustomerGroupsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['name', 'action'];
  customerGroups;

  constructor(
    private customerGroupsService: CustomerGroupsService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.customerGroupsService.getAllCustomerGroups().then(customerGroups => {
      this.customerGroups = customerGroups
      this.dataSource = new MatTableDataSource(this.customerGroups);
    })
  }

  addCustomerGroup() {
    const dialogRef = this.dialog.open(AddCustomerGroupsComponent, { data: {} });
    dialogRef.afterClosed().subscribe(result => {
      this.customerGroupsService.getAllCustomerGroups().then(customerGroups => {
        this.customerGroups = customerGroups;
        this.dataSource = new MatTableDataSource(this.customerGroups);
      })
    })
  }
  edit(customerGroup) {
    const dialogRefedit = this.dialog.open(AddCustomerGroupsComponent, { data: customerGroup });
    dialogRefedit.afterClosed().subscribe(result => {
      this.customerGroupsService.getAllCustomerGroups().then(customerGroups => {
        this.customerGroups = customerGroups;
        this.dataSource = new MatTableDataSource(this.customerGroups);
      })
    })
  }
  delete(customerGroup) {
    if (window.confirm("Are you sure want to delete this package Type? It might be cause of error!")) {
      this.customerGroupsService.deleteCustomerGroup(customerGroup.idcustomerGroup).then(result => {
        window.alert("successfully deleted!");
        this.customerGroupsService.getAllCustomerGroups().then(customerGroups => {
          this.customerGroups = customerGroups;
          this.dataSource = new MatTableDataSource(this.customerGroups);
        })
      })
    }
  }
}

