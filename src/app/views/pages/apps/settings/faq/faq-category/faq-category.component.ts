
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FaqService } from 'src/app/service/faq.service';
import { MatDialog } from '@angular/material/dialog';
import { FaqCategoryNewComponent } from './faq-category-new/faq-category-new.component';

@Component({
  selector: 'kt-faq-category',
  templateUrl: './faq-category.component.html',
  styleUrls: ['./faq-category.component.scss']
})
export class FaqCategoryComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['name', 'action'];
  faqs;

  constructor(
    private faqService: FaqService,
    public dialog: MatDialog,
		private changeDetectorRefs: ChangeDetectorRef,

  ) { }

  ngOnInit(): void {
    this.faqService.getAllFAQCategory().then(faqs => {
      this.faqs = faqs;
      this.faqs = this.faqs.reverse();
      this.dataSource = new MatTableDataSource(this.faqs);
      this.changeDetectorRefs.detectChanges();
    })
  }

  add() {
    const dialogRef = this.dialog.open(FaqCategoryNewComponent, { data: {} });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }
  edit(faq) {
    const dialogRefedit = this.dialog.open(FaqCategoryNewComponent, { data: faq });
    dialogRefedit.afterClosed().subscribe(result => {
      this.ngOnInit();

    })
  }
  delete(faq) {
    if (window.confirm("Are you sure want to delete this package Type? It might be cause of error!")) {
      this.faqService.deleteFAQCategory(faq.idfaqCategory).then(result => {
        window.alert("successfully deleted!");
        this.ngOnInit();
      })
    }
  }
}


