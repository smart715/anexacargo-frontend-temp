import { Component, OnInit } from '@angular/core';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'kt-courier-status',
  templateUrl: './courier-status.component.html',
  styleUrls: ['./courier-status.component.scss']
})

export class CourierStatusComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder,
              private router: Router) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
  accept(){
    let naviagtionExtras: NavigationExtras = {
			queryParams: this.order
		}
		this.router.navigate(['courier/detail'], naviagtionExtras);
  }
  order = {id: 0, name: "Elizabeth Rodriguez", status: 0, items: 3, weight: 3.42, accept: 'accept'}
}