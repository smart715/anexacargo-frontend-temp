import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SettingService } from 'src/app/service/setting.service';
import { NewsNewComponent } from './news-new/news-new.component';


@Component({
  selector: 'kt-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  dataSourceNews: MatTableDataSource<any>;
  displayedColumns = ['description', 'date', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private settingService: SettingService,
    private changeDetectorRefs: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    this.settingService.getAllNews().then((result: any) => {
      result = result.reverse();
      this.dataSourceNews = new MatTableDataSource(result);
      this.setDataSourceAttributes();
      if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
        !(this.changeDetectorRefs as ViewRef).destroyed) {
        this.changeDetectorRefs.detectChanges();
      }
    }).catch(err => {
      console.log(err)
    })
  }

  setDataSourceAttributes() {
    this.dataSourceNews.paginator = this.paginator;
    this.dataSourceNews.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    console.log(filterValue);
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();

    if (this.dataSourceNews.paginator) {
      this.dataSourceNews.paginator.firstPage();
    }

    this.dataSourceNews.filter = filterValue;
  }

  addNews() {
    const dialogRef = this.dialog.open(NewsNewComponent,);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result?.status == true) {
        this.ngOnInit();
      }
    })
  }

}
