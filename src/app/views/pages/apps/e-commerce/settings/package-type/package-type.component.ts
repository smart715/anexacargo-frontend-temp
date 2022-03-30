import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PackageTypeService } from 'src/app/service/package-type.service';
import { MatDialog } from '@angular/material/dialog';
import { AddPackageTypeComponent } from './add-package-type/add-package-type.component';

@Component({
  selector: 'kt-package-type',
  templateUrl: './package-type.component.html',
  styleUrls: ['./package-type.component.scss']
})
export class PackageTypeComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['name', 'action'];
  packageTypes;

  constructor(
    private packageTypeService: PackageTypeService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.packageTypeService.getAllPackageTypes().then(packageTypes => {
      this.packageTypes = packageTypes
      this.dataSource = new MatTableDataSource(this.packageTypes);
    })
  }

  addPackageType() {
    const dialogRef = this.dialog.open(AddPackageTypeComponent, { data: {} });
    dialogRef.afterClosed().subscribe(result => {
      this.packageTypeService.getAllPackageTypes().then(packageTypes => {
        this.packageTypes = packageTypes;
        this.dataSource = new MatTableDataSource(this.packageTypes);
      })
    })
  }
  edit(packageType) {
    const dialogRefedit = this.dialog.open(AddPackageTypeComponent, { data: packageType });
    dialogRefedit.afterClosed().subscribe(result => {
      this.packageTypeService.getAllPackageTypes().then(packageTypes => {
        this.packageTypes = packageTypes;
        this.dataSource = new MatTableDataSource(this.packageTypes);
      })
    })
  }
  delete(packageType) {
    if (window.confirm("Are you sure want to delete this package Type? It might be cause of error!")) {
      this.packageTypeService.deletePackageType(packageType.idpackageType).then(result => {
        window.alert("successfully deleted!");
        this.packageTypeService.getAllPackageTypes().then(packageTypes => {
          this.packageTypes = packageTypes;
          this.dataSource = new MatTableDataSource(this.packageTypes);
        })
      })
    }
  }
}
