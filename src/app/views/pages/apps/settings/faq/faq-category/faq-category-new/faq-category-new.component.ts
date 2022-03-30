
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomerGroupsService } from 'src/app/service/customer-groups.service';
import { FaqService } from 'src/app/service/faq.service';

@Component({
  selector: 'kt-faq-category-new',
  templateUrl: './faq-category-new.component.html',
  styleUrls: ['./faq-category-new.component.scss']
})
export class FaqCategoryNewComponent implements OnInit {

  categoryForm = new FormGroup({
    category: new FormControl
  });
  buttonName;
  tempResult;
  constructor(
    public dialogRef: MatDialogRef<FaqCategoryNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private faqService: FaqService,

  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      category: ['', Validators.required],
    });
    if (this.data.idfaqCategory) {
      this.buttonName = 'save';
      this.categoryForm.get('category').setValue(this.data.name);
    }
    else {
      this.buttonName = 'add';
    }
  }
  add() {
    if (this.buttonName == 'add') {
      const controls = this.categoryForm.controls;
      /** check form */
      if (this.categoryForm.invalid) {
        Object.keys(controls).forEach(controlName =>
          controls[controlName].markAsTouched()
        );
        return;
      }
  
      else {
        this.faqService.createFAQCatetory(this.categoryForm.value).then(result => {
          this.tempResult = result;
          window.alert("Successfully added");
          this.dialogRef.close({ data: { idfaqCategory: this.tempResult.insertId, name: this.categoryForm.value.category }, status: 'success' });

        })
      }
    }
    else {
      if (this.categoryForm.invalid) {
        window.alert("Please input the name of customer Group!")
      }
      else {
        this.faqService.editFAQCategory(this.data.idfaqCategory, this.categoryForm.value.category).then(result => {
          window.alert("Successfully saved");
          this.dialogRef.close();
        })
      }
    }
  }
}

