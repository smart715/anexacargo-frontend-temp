import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingService } from 'src/app/service/setting.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'kt-news-new',
  templateUrl: './news-new.component.html',
  styleUrls: ['./news-new.component.scss']
})
export class NewsNewComponent implements OnInit {
  public Editor = ClassicEditor;
  newsForm: FormGroup;
  ckdata;
  constructor(
    public dialogRef: MatDialogRef<NewsNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private settingService: SettingService,
    private notificationService: NotificationService,
  ) { }
  // bfn1JAXQUbVD9si2S0jJBCyrdhQ6miVXSwhQ9XCuCoXmhUnFX8QkRxtGr9M3   // ckeditor Access credentials
  // https://75807.cke-cs.com/easyimage/upload/   // easy image upload url
  // https://75807.cke-cs.com/token/dev/f8f048d2bc0f83e76b950c29c59eb3c18ce2841806d966a2789b24a988c3   //Development token URL
  ngOnInit(): void {
    ClassicEditor
      .create(document.querySelector('#editor'), {
        // cloudServices: {
        //   tokenUrl: 'https://75807.cke-cs.com/token/dev/f8f048d2bc0f83e76b950c29c59eb3c18ce2841806d966a2789b24a988c3',
        //   uploadUrl: 'https://75807.cke-cs.com/easyimage/upload/'
        // },
 
      }).then(editor => {
        this.Editor = editor;
      })
      .catch(err => {
        console.log(err);
      })

    this.newsForm = this.fb.group({
      description: ['', Validators.required],
    });
  }
  addNews() {
    console.log(this.Editor.getData());
    var customData = this.Editor.getData();
    const controls = this.newsForm.controls;
    if (this.newsForm.invalid || customData == undefined) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      return;
    }
    this.settingService.addnews({ description: this.newsForm.value.description, data: customData }).then((result: any) => {
      console.log(result);
      this.dialogRef.close({ status: true });
      this.notificationService.sendNotification(this.newsForm.value.description, customData).then(result => {
        console.log(result);
      })

    }).catch(err => {
      console.log(err);
      window.alert("error occured");
    })
  }


  public onChange(event: ClassicEditor.EventInfo) {
    console.log(event.editor.getData());
    this.ckdata = event.editor.getData();
  }


}
