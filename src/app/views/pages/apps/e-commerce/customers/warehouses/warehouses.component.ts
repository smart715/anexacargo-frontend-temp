import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { CourierService } from 'src/app/service/courier.service';
import { CustomerService } from 'src/app/service/customer.service';
import { WarehouseService } from 'src/app/service/warehouse.service';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { ChangeWarehouseStatusComponent } from './change-warehouse-status/change-warehouse-status.component';

@Component({
  selector: 'kt-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})
export class WarehousesComponent implements OnInit {
  @Input() customerID: any;
  pipe: DatePipe;
  selection = new SelectionModel<any>(true, []);
  checkedFlag;
  isTotalFlag: boolean = false;
  total_count: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  sort: string = 'desc';
  sortName: string = 'idwarehouse';
  dataSourceWarehouse: MatTableDataSource<any>;
  displayedColumns = ['check', 'idwarehouse', 'idcustomers', 'customer', 'warehouse', 'type', 'price', 'paid', 'status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  warehouses;
  total_warehouses;
  unselected;
  filterStatus: string = "";
  filterForm = new FormGroup({
    search: new FormControl(),
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });
  filterType
  filterValue: string = "";
  get fromDate() { return this.filterForm.get('fromDate').value; }
  get toDate() { return this.filterForm.get('toDate').value; }
  dateFrom
  dateTo
  showOverlay: boolean = false;
  constructor(
    private router: Router,
    private warehouseService: WarehouseService,
    private customerService: CustomerService,
    private courierService: CourierService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
  ) { }

  async ngOnInit(): Promise<void> {
    this.checkedFlag = false;
    this.unselected = [];
    // await this.getAllWarehouseData();
    this.getFilterWarehouseData();
  }
  getSortDate(event?: any) {
    this.dataSourceWarehouse = new MatTableDataSource();
    this.sort = event.direction;
    this.sortName = event.active;
    this.getAllWarehouseData();
    this.getFilterWarehouseData();
  }
  getServerData(event?: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getFilterWarehouseData();
  }
  async getAllWarehouseData() {
    this.showOverlay = true;
    let filter = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      sort: this.sort,
      sortName: this.sortName,
      filterStatus: this.filterStatus,
      filterType: this.filterType,
      fromDate: this.dateFormat(this.dateFrom),
      toDate: this.dateFormat(this.dateTo),
      filterValue: this.filterValue
    }
    await this.warehouseService.getAllWarehouse(filter).then((result: any) => {
      this.total_warehouses = [];
      for (let i in result) {
        if ((result[i]["idcustomers"]).toUpperCase() == this.customerID) {
          this.total_warehouses.push(result[i]);
        }
      }
      this.total_count = this.total_warehouses.length;
      this.showOverlay = false;
    });
  }
  async getFilterWarehouseData() {
    this.showOverlay = true;
    var obj = {};
    let all_seleted = this.selection.selected;
    for (let i = 0, len = all_seleted.length; i < len; i++) {
      obj[all_seleted[i]['idwarehouse']] = all_seleted[i];
    }
    let temp = [];
    for (var key in obj)
      temp.push(obj[key]);
    this.selection.clear();
    this.dataSourceWarehouse = new MatTableDataSource();
    let filter = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      sort: this.sort,
      sortName: this.sortName,
      filterStatus: this.filterStatus,
      filterType: this.filterType,
      fromDate: this.dateFormat(this.dateFrom),
      toDate: this.dateFormat(this.dateTo),
      filterValue: this.filterValue
    }
    console.log("AEX" + this.customerID);

    await this.warehouseService.getAllWarehouseWithCustomerID(filter, this.customerID).then((result: any) => {
      this.total_warehouses = result;
      // for (let i in result) {
      //   if ((result[i]["idcustomers"]).toUpperCase() == "AEX" + this.customerID) {
      //     console.log(result[i])
      //     this.total_warehouses.push(result[i]);
      //   }
      // }
      console.log()
      this.total_count = this.total_warehouses.length;
      // this.total_count = result.length;
    });
    this.warehouseService.getWarehouseWithCustomerID(filter,  this.customerID).then(async (result: any) => {
      this.warehouses = result;
      // for (let i in result) {
      //   if ((result[i]["idcustomers"]).toUpperCase() == "AEX" + this.customerID) {
      //     console.log(result[i])
      //     this.warehouses.push(result[i]);
      //   }
      // }
      await this.warehouses.map(async warehouse => {
        warehouse.customer = warehouse?.firstName + ' ' + warehouse?.lastName;
        if (warehouse.location == '0') {
          warehouse.type = "China";
        }
        else {
          if (warehouse.courier_type == '0') {
            warehouse.type = 'Air';
          }
          else {
            warehouse.type = 'Maritime';
          }
        };
      })
      let tempData = [];
      for (var i = 0; i < filter.pageSize * filter.pageIndex; i++) {
        tempData.push({});
      }
      console.log(this.warehouses);

      tempData = tempData.concat(this.warehouses);
      tempData.length = this.total_count;
      this.dataSourceWarehouse = new MatTableDataSource(tempData);
      this.dataSourceWarehouse.paginator = this.paginator;
      this.dataSourceWarehouse.data.forEach(row => {
        temp.forEach(item => {
          if (item.idwarehouse == row.idwarehouse) {
            this.selection.select(row)
          }
        })
        if (this.isTotalFlag == true) {
          let flag = false;
          for (let j = 0; j < this.unselected.length; j++) {
            if (row.idwarehouse == this.unselected[j]['idwarehouse']) {
              flag = true;
            }
          }
          if (!flag)
            this.selection.select(row);
        }
      });
      this.showOverlay = false;
      this.changeDetectorRefs.detectChanges();
    })
  }

  applyFilter(filterValue: string) {
    this.selection.clear()
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.filterValue = filterValue;
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.getAllWarehouseData();
    this.getFilterWarehouseData();
  }

  getVolWeight(warehouse) {
    var volWeight;
    volWeight = (Number(warehouse?.length) * Number(warehouse?.height) * Number(warehouse?.width) / 166).toFixed(2);
    return volWeight;
  }

  exportToCSV() {

    var data = [];
    if (this.total_warehouses.length == 0) {
      return;
    }
    for (var i = 0; i < this.total_warehouses.length; i++) {
      var element: any = {};
      element['ID'] = this.total_warehouses[i].idwarehouse;
      element['AnexaID'] = this.total_warehouses[i].idcustomers;
      element['Customer'] = this.total_warehouses[i].customer;
      // element['Type'] = type;
      element['Warehouse'] = this.total_warehouses[i].warehouse;
      element['Tracking'] = this.total_warehouses[i].tracking;
      console.log(this.total_warehouses[i].tracking);
      element['weight'] = this.total_warehouses[i].weight;
      element['PesoVol'] = this.getVolWeight(this.total_warehouses[i]);
      element['Type'] = this.total_warehouses[i].type;
      element['Price'] = this.total_warehouses[i].price;
      if (this.total_warehouses[i].status == '0') {
        element['Status'] = 'Pending';
      }
      if (this.total_warehouses[i].status == '1') {
        element['Status'] = 'Ready';
      }
      if (this.total_warehouses[i].status == '2') {
        element['Status'] = 'Delivery';
      }
      if (this.total_warehouses[i].status == '3') {
        element['Status'] = 'Completed';
      }
      data.push(element);
    }
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var a = document.createElement('a');
    var blob = new Blob(["\ufeff", csvArray], { type: 'text/csv; charset=utf-8;' }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "warehouse_list.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
  exportPending() {
    let all_seleted = this.selection.selected;
    var data = [];
    if (all_seleted.length == 0) {
      return;
    }
    for (var i = 0; i < all_seleted.length; i++) {
      var element: any = {};
      element['ID'] = all_seleted[i].idwarehouse;
      element['AnexaID'] = all_seleted[i].idcustomers;
      element['Customer'] = all_seleted[i].customer;
      // element['Type'] = type;
      element['Warehouse'] = all_seleted[i].warehouse;
      element['Tracking'] = all_seleted[i].tracking;
      console.log(all_seleted[i].tracking);
      element['weight'] = all_seleted[i].weight;
      element['PesoVol'] = this.getVolWeight(all_seleted[i]);
      element['Type'] = all_seleted[i].type;
      element['Price'] = all_seleted[i].price;
      if (all_seleted[i].status == '0') {
        element['Status'] = 'Pending';
      }
      else {
        continue;
      }
      data.push(element);
    }
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var a = document.createElement('a');
    var blob = new Blob(["\ufeff", csvArray], { type: 'text/csv; charset=utf-8;' }),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "warehouse_list.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  addCourier() {
    this.router.navigate(['/warehouse/courier/new']);

  }

  viewWarehouse(warehouse) {
    let naviagtionExtras: NavigationExtras = {
      queryParams: warehouse
    }
    this.router.navigate(['/warehouse/detail'], naviagtionExtras);
  }

  filterBystatus() {
    this.selection.clear()
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.getAllWarehouseData();
    this.getFilterWarehouseData();
  }
  filterByType() {
    this.selection.clear()
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.getAllWarehouseData();
    this.getFilterWarehouseData();
  }
  dateFilter(event) {
    this.selection.clear()
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    let from_date = this.dateFormat(this.fromDate);
    let to_date = this.dateFormat(this.toDate);
    if (from_date > to_date && from_date) {
      this.dateTo = this.fromDate;
    }
    this.getAllWarehouseData();
    this.getFilterWarehouseData();
  }
  dateFormat(date) {
    if (!date) {
      return "";
    }
    let month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-') + ' 00:00:00';
  }
  scanReady() {
    this.router.navigate(['/warehouse/scan/ready']);
  }
  scanSalida() {
    this.router.navigate(['warehouse/scan/salida']);
  }
  scanEntrega() {
    this.router.navigate(['warehouse/scan/entrega']);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceWarehouse.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.unselected = [];
    if (this.selection.selected.length == 0) {
      this.isTotalFlag = true;
    } else {
      this.isTotalFlag = false;
    }
    this.selection.selected.length > 0 ?
      this.selection.clear() :
      this.dataSourceWarehouse.data.forEach(row => this.selection.select(row));
    if (this.selection.selected.length == 0) {
      this.checkedFlag = false;
    }
    else {
      this.checkedFlag = true;
    }
  }

  selfToggle(_package) {
    if (this.isTotalFlag == true) {
      this.unselected.push(_package);
    } else {
      this.unselected = [];
    }
    this.selection.toggle(_package)
    if (this.selection.selected.length == 0) {
      this.checkedFlag = false;
    }
    else {
      this.checkedFlag = true;
    }
  }

  changeWarehousesStatus() {
    let data = [];
    if (this.isTotalFlag) {
      var obj = {};
      let all_seleted = this.total_warehouses;
      for (let i = 0, len = all_seleted.length; i < len; i++) {
        let flag = false;
        for (let j = 0; j < this.unselected.length; j++) {
          if (this.unselected[j]['idwarehouse'] == all_seleted[i]['idwarehouse']) {
            flag = true;
          }
        }
        if (!flag)
          obj[all_seleted[i]['idwarehouse']] = all_seleted[i];
      }
      for (var key in obj)
        data.push(obj[key]);
    } else {
      data = this.selection.selected;
    }
    const dialogRef = this.dialog.open(ChangeWarehouseStatusComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      this.selection.clear()
      this.unselected = [];
      this.ngOnInit();
    })
  }
}
