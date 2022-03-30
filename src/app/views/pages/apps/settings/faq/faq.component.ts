import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { SettingService } from 'src/app/service/setting.service';
import { FaqService } from 'src/app/service/faq.service';
import { result } from 'lodash';



@Component({
  selector: 'kt-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  categories;
  questions;
  dataSourceFAQ: MatTableDataSource<any>;
  displayedColumns = ['id', 'date', 'question', 'category', 'status', 'action'];
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
    private faqService: FaqService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.faqService.getAllFAQCategory().then((result: any) => {
      this.categories = result;
      this.categories.map(category => {
        category.idfaqCategory = category.idfaqCategory.toString();
      });
      this.faqService.getAllFAQ().then((result: any) => {
        result = result.reverse();
        this.questions = result;
        this.dataSourceFAQ = new MatTableDataSource(this.questions);
        this.setDataSourceAttributes();
        if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
          !(this.changeDetectorRefs as ViewRef).destroyed) {
          this.changeDetectorRefs.detectChanges();
        }
      }).catch(err => {
        console.log(err)
      });
    }).catch(err => {
      console.log(err)
    });
  }

  setDataSourceAttributes() {
    this.dataSourceFAQ.paginator = this.paginator;
    this.dataSourceFAQ.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    console.log(filterValue);
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();

    if (this.dataSourceFAQ.paginator) {
      this.dataSourceFAQ.paginator.firstPage();
    }

    this.dataSourceFAQ.filter = filterValue;
  }

  createFAQ() {
    let naviagtionExtras: NavigationExtras = {
      queryParams: {}
    }
    this.router.navigate(['settings/faq/new'], naviagtionExtras);

  }
  viewQuestion(faq) {
    let naviagtionExtras: NavigationExtras = {
      queryParams: { idfaq: faq.idfaq }
    }
    this.router.navigate(['settings/faq/new'], naviagtionExtras);
  }
  category() {
    this.router.navigate(['settings/faq/category']);
  }

  getCategoryName(idfaqCategory) {
    return this.categories.filter(category => category.idfaqCategory == idfaqCategory)[0]?.name
  }

  filterByCategory(idfaqCategory) {
    console.log(idfaqCategory);
    // this.questions.filter(question => question.idfaqCategory == idfaqCategory);
    this.dataSourceFAQ = new MatTableDataSource(this.questions.filter(question => question.idfaqCategory == idfaqCategory));
    this.setDataSourceAttributes();
    if (this.changeDetectorRefs !== null && this.changeDetectorRefs !== undefined &&
      !(this.changeDetectorRefs as ViewRef).destroyed) {
      this.changeDetectorRefs.detectChanges();
    }
  }

  deleteFAQ(faq) {
    console.log(faq);
    if (window.confirm("Are you sure to delete?")) {
      this.faqService.deleteFAQ(faq.idfaq).then(result => {
        window.alert("Successfuly deleted");
        this.ngOnInit();
      }).catch(err => {
        console.log(err);
        window.alert("Unfortunatelly error occured!");
      })
    }
  }
}
