import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CourierService } from 'src/app/service/courier.service';
import { WarehouseService } from 'src/app/service/warehouse.service';

@Component({
  selector: 'kt-courier',
  templateUrl: './courier.component.html',
  styleUrls: ['./courier.component.scss']
})
export class CourierComponent implements OnInit {
  pipe: DatePipe;

  dataSourceCouriers: MatTableDataSource<any>;
  displayedColumns = ['id', 'date', 'courier', 'type', 'warehouses', 'cost', 'sale', 'status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
  setDataSourceAttributes() {
    this.dataSourceCouriers.paginator = this.paginator;
    this.dataSourceCouriers.sort = this.sort;
    this.pipe = new DatePipe('en');
    this.dataSourceCouriers.sortingDataAccessor = (item, property): string | number => {
      switch (property) {
        case 'date': return new Date(item.date).getTime();
        default: return item[property];
      }
    };
    this.dataSourceCouriers.filterPredicate = (data, filter) => {
      console.log("filterPredicate");
      this.pipe = new DatePipe('en');

      if (this.fromDate && this.toDate) {
        let newDate = new Date(data.date);
        console.log(newDate >= this.fromDate);

        return newDate >= this.fromDate && newDate <= this.toDate;
      }
      return true;
    }
  }
  filterForm = new FormGroup({
    search: new FormControl(),
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });

  get fromDate() { return this.filterForm.get('fromDate').value; }
  get toDate() { return this.filterForm.get('toDate').value; }



  couriers;
  filterStatus;
  filterType;
  showOverlay;
  constructor(
    private courierService: CourierService,
    private changeDetectorRefs: ChangeDetectorRef,
    private warehouseService: WarehouseService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.showOverlay = true;
    this.courierService.getAllCouriers().then((result: any) => {
      if (!result.length) {
        this.showOverlay = false;
        if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
          !(this.changeDetectorRefs as ViewRef).destroyed) {
          return this.changeDetectorRefs.detectChanges();
        }


      }
      this.couriers = result.reverse();
      console.log("couriers", this.couriers);
      this.couriers.map(courier => {
        var sale = 0;
        var statusFlag = 0;
        this.warehouseService.getWarehousebyCourierID(courier.idcourier).then((result: any) => {
          result.forEach(warehouse => {
            sale = sale + parseFloat(warehouse.price);
            if (warehouse.status == '3') {
              statusFlag++;
            }
          })
          if (statusFlag == result.length) {
            courier.status = "1"
          }
          else {
            courier.status = "0"
          }
          console.log(result);
          courier.warehouses = result.length;
          courier.sale = sale.toFixed(2);
          courier.cost = parseFloat(courier.cost).toFixed(2)
          if (courier.type == '0') {
            courier.realType = "Air"
          }
          else if (courier.type == '1') {
            courier.realType = "Maritime"
          }
          else {
            courier.realType = "China"
          }

          this.dataSourceCouriers = new MatTableDataSource(this.couriers);
          this.setDataSourceAttributes();
          this.showOverlay = false;

          this.changeDetectorRefs.detectChanges();
        })
      })

    })
  }
  addCourier() {
    this.router.navigate(['/warehouse/courier/new']);
  }
  exportToExcel() {
    this.showOverlay = true;
    var data = [];
    console.log(this.couriers);
    for (var i = 0; i < this.couriers.length; i++) {
      var type;
      if (this.couriers[i].type == '0') {
        type = "Air"
      }
      else if (this.couriers[i].type == '1') {
        type = 'Maritime'
      }
      else {
        type = 'China'
      }
      var element: any = {};
      element['ID'] = this.couriers[i].idcourier;
      element['Date'] = this.couriers[i].date;
      element['Courier'] = this.couriers[i].courier;
      element['Type'] = type;
      element['Warehouses'] = this.couriers[i].warehouses;
      element['Cost'] = parseFloat(this.couriers[i].cost).toFixed(2);
      element['Sale'] = parseFloat(this.couriers[i].sale).toFixed(2);
      element['Status'] = this.couriers[i].status == '0' ? 'In Progress' : 'Completed';
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
    a.download = "courier_list.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
    this.showOverlay = false;
    if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
      !(this.changeDetectorRefs as ViewRef).destroyed) {
      this.changeDetectorRefs.detectChanges();
    }
  }

  applyFilter(filterValue: string) {
    console.log(filterValue);
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();

    // this.dataSourceWarehouse.filterPredicate = (data: { firstName: string, lastName: string, company: string, orders: string, registered: string, status: string }, filterValue: string) =>
    //   (data.firstName?.trim().toLowerCase().indexOf(filterValue) !== -1) ||
    //   (data.lastName?.trim().toLowerCase().indexOf(filterValue) !== -1) ||
    //   (data.company?.trim().toLowerCase().indexOf(filterValue) !== -1);

    if (this.dataSourceCouriers.paginator) {
      this.dataSourceCouriers.paginator.firstPage();
    }

    this.dataSourceCouriers.filter = filterValue;
  }
  filterBystatus() {
    console.log(this.filterStatus);

    this.dataSourceCouriers.filterPredicate = (data: { status: string }, filterValue: string) => data.status.trim().toLowerCase().indexOf(this.filterStatus) !== -1;
    const tableFilters = [];
    tableFilters.push({ id: 'status', value: this.filterStatus });
    this.dataSourceCouriers.filter = JSON.stringify(tableFilters);
    if (this.dataSourceCouriers.paginator) {
      this.dataSourceCouriers.paginator.firstPage();
    }
    console.log(this.dataSourceCouriers.filter)
  }

  filterByType() {
    console.log(this.filterType);
    this.dataSourceCouriers.filterPredicate = (data: { realType: string }, filterValue: string) => data.realType.indexOf(this.filterType) !== -1;
    const tableFilters = [];
    tableFilters.push({ id: 'realType', value: this.filterType });
    this.dataSourceCouriers.filter = JSON.stringify(tableFilters);
    if (this.dataSourceCouriers.paginator) {
      this.dataSourceCouriers.paginator.firstPage();
    }
    console.log(this.dataSourceCouriers.filter)
  }

  dateFilter(event) {
    this.dataSourceCouriers.filter = '' + Math.random();
  }
}
