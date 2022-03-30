import { ChangeDetectorRef, Component, NgModule, OnInit, ViewChild, AfterViewInit, AfterContentInit, ElementRef, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RouterModule, Routes } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SettingService } from 'src/app/service/setting.service';
import { CustomerService } from 'src/app/service/customer.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
    selector: 'kt-dynamic-table',
    templateUrl: './dynamic-table.component.html',
    styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {
    public Editor = ClassicEditor;
    @Input() showState: any;
    dataSourceNews: MatTableDataSource<any>;
    displayedColumns = ['idcustomers'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
    }

    customers;
    first_data;
    tempresult;
    ckdata;
    input_title;

    filterStatus: string = "";
    sortName: string = 'idcustomers';
    showOverlay: boolean = false;
    constructor(
        private router: Router,
        public dialog: MatDialog,
        private settingService: SettingService,
        private changeDetectorRefs: ChangeDetectorRef,
        private customerService: CustomerService,
        private elRef: ElementRef,
    ) {
    }
    ngOnInit() {

        this.customerService.getTableContent().then(async (result: any) => {
            if (!result.length) {
                result = [{ content: "<h1>Please create table and input data.</h1>" }];
            } else {
                result = result;
            }
            ClassicEditor
                .create(document.querySelector('#editorDynamic'), {
                    removePlugins: ["EasyImage", "ImageUpload", "MediaEmbed"]

                }).then(editor => {
                    editor.setData(result[0].content)
                    this.Editor = editor;
                })
                .catch(err => {
                    console.log(err);
                })
        }).catch((error) => {
            console.log(error)
        })

    }
    savebox() {
        var customData = this.Editor.getData();

        this.customerService.saveTableContent(customData).then((result: any) => {
            console.log(400000, result);
            if (result["status"] == "success") {
                window.alert("success")
            }
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
