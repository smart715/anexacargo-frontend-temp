import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerService } from 'src/app/service/customer.service';
import { MessengerService } from 'src/app/service/messenger.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCommentsComponent } from './add-comments/add-comments.component'
@Component({
  selector: 'kt-customer-comments',
  templateUrl: './customer-comments.component.html',
  styleUrls: ['./customer-comments.component.scss']
})
export class CustomerCommentsComponent implements OnInit {

  @Input() customerID: any;

  dataSource: MatTableDataSource<any>;
  displayedColumns = ['date', 'description', 'user'];
  comments;
  comment;
  idadmin;
  saveFlag = false;
  tempAdmin;
  constructor(
    private customerService : CustomerService,
    private messengerService : MessengerService,

		private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.saveFlag = false;
    console.log(this.customerID);
    this.idadmin = window.localStorage.getItem("userID");
    this.customerService.getCommentsByCustomer(this.customerID).then(result => {
      this.comments = result;
      this.comments = this.comments.reverse();
      console.log(this.comments);
      this.comments.map(comment => {
        this.messengerService.getMessengerByID(comment.idadmin).then(admin => {
          this.tempAdmin = admin;
          console.log(this.tempAdmin);
          comment.admin = this.tempAdmin[0].name;
          this.dataSource = new MatTableDataSource(this.comments);
          this.changeDetectorRefs.detectChanges();
        })
      })
    })

  }

  newComments() {
    const dialogRef = this.dialog.open(AddCommentsComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result?.comments){
        console.log(result);
        this.customerService.createCommentsByCustomerAndAdminID(this.idadmin, this.customerID, result.comments).then(async result => {
          await this.ngOnInit();
          window.alert("Successfully added!");
        })
      }
    })
    // this.saveFlag = !this.saveFlag;
    // if( !this.saveFlag ) {
    //   console.log("saved", this.comment);
    //   this.customerService.createCommentsByCustomerAndAdminID(this.idadmin, this.customerID, this.comment).then(async result => {
    //     console.log(result);
    //     this.comment = "";
    //     await this.ngOnInit();

    //   });
    // }
  }

}
