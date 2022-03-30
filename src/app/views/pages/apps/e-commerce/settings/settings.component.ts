import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingService } from 'src/app/service/setting.service'
import { result } from 'lodash';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'kt-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingForm: FormGroup;
  settings;
  showStateValue;
  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,



  ) { }

  ngOnInit(): void {
    console.log(this.showStateValue)
    this.settingForm = this.fb.group({
      companyName: ['', Validators.required],
      ruc: ['', Validators.required],
      street: ['', Validators.compose([Validators.required])],
      state: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
      itbms: ['', Validators.compose([Validators.required])],
      aDifference: ['', Validators.compose([Validators.required])],

      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      port: ['', Validators.compose([Validators.required])],
      server: ['', Validators.compose([Validators.required])],
      hideOrUnhide: [false, []],
      // TaxStatus: [false, []],
      // TaxValue: [0, []],

    });
    this.settingService.getSettings().then(result => {
      this.settings = result[0];
      console.log(this.settings, 'this.settings')
      if (this.settings && this.settings.hideOrUnhide > 0) {
        this.settings.hideOrUnhide = true;
      }
      if (this.settings && this.settings.hideOrUnhide < 0) {
        this.settings.hideOrUnhide = false;
      }


      if (this.settings) {

        this.settingForm.setValue({
          companyName: this.settings.companyName,
          ruc: this.settings.ruc,
          street: this.settings.street,
          state: this.settings.state,
          country: this.settings.country,
          itbms: this.settings.itbms,
          aDifference: this.settings.aDifference,

          username: this.settings.username,
          password: this.settings.password,
          port: this.settings.port,
          server: this.settings.server,
          hideOrUnhide: this.settings.hideOrUnhide,
          // TaxStatus: this.settings.TaxStatus,
          // TaxValue: this.settings.TaxValue,
        });
      }

    })
  }
  save() {
    if (this.settingForm.invalid) {
      return;
    }
    else {
      console.log(this.settingForm.value);
      this.settingService.saveSettings(this.settingForm.value).then(result => {
        console.log(result);
        window.alert("successfully updated!")
      })
    }
  }
  showState() {
    this.showStateValue = 6;
    this.ngOnInit();
  }
  showState1() {
    this.showStateValue = 8;
    this.ngOnInit();
  }
  showState2() {
    this.showStateValue = 9;
    this.ngOnInit();
  }
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);
    if (tabChangeEvent.index == 4) {
      this.showState();
    } else if (tabChangeEvent.index == 6) {
      this.showState1();
    } else if (tabChangeEvent.index == 7) {
      this.showState2();
    }
  }
  changeTax(event) {
    console.log(event)
  }
}
