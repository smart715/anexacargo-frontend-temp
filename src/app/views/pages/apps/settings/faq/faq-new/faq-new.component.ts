import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqService } from 'src/app/service/faq.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kt-faq-new',
  templateUrl: './faq-new.component.html',
  styleUrls: ['./faq-new.component.scss']
})
export class FaqNewComponent implements OnInit {
  public Editor = ClassicEditor;
  faq;
  title;
  categories;
  ckdata;
	questionForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private faqService: FaqService,
    private fb: FormBuilder,

  ) { }

  async ngOnInit(): Promise<void> {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      category: ['', Validators.required]
    });
    this.route.queryParams.subscribe(params => {
      this.faq = JSON.parse(JSON.stringify(params));
    });
    await this.faqService.getAllFAQCategory().then((result:any) => {
      this.categories = result;
      this.categories.map(category => {
        category.idfaqCategory = category.idfaqCategory.toString();
      });
    }).catch(err => {
      console.log(err)
    });
    if (this.faq.idfaq){
      this.faqService.getFAQbyID(this.faq.idfaq).then((result:any) => {
        this.faq = result[0];
        console.log(this.faq);
        this.title = this.faq.question;
        this.questionForm.setValue({question: this.faq.question, category: this.faq.idfaqCategory});
        this.ckdata = this.faq.answer;
      })
    }
    else {
      this.title = "New Question";
      this.faq.status = '1';
      this.ckdata = '<p>Hello, world!</p>'
    }
  }
  save(){
    const controls = this.questionForm.controls;
    if (this.questionForm.invalid) {
      /** check form */
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    else {
      if (this.faq.idfaq) {
        console.log('update', this.faq, this.questionForm.value, this.ckdata);
        this.faqService.updateFAQ({
          question : this.questionForm.value.question,
          idfaqCategory : this.questionForm.value.category,
          status : this.faq.status,
          answer : this.ckdata,
          idfaq : this.faq.idfaq
        }).then(result => {
          this.router.navigate(['settings/faq']);
        }).catch(err => {
          console.log(err);
        })
      }
      else {
        console.log('create', this.faq, this.questionForm.value, this.ckdata);
        this.faqService.createFAQ({
          question : this.questionForm.value.question,
          idfaqCategory : this.questionForm.value.category,
          status : this.faq.status,
          answer : this.ckdata
        }).then(result => {
          this.router.navigate(['settings/faq']);
        }).catch(err => {
          console.log(err);
        })
      }
    }
  }
  menuChange(event){
    console.log(event.target.outerText);
    if (event.target.outerText == 'Published') {
      this.faq.status = '0';
    }
    else {
      this.faq.status = '1';
    }
  }
}
