import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kt-add-comments',
  templateUrl: './add-comments.component.html',
  styleUrls: ['./add-comments.component.scss']
})
export class AddCommentsComponent implements OnInit {
  comment;
	note: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddCommentsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,


  ) { }

  ngOnInit(): void {
    this.note = this.fb.group({
			comments: ['', Validators.required],
		});
  }
  add(){
    if(this.note.invalid){
      return;
    }
    else{
      this.dialogRef.close(this.note.value);
    }
  }

}
