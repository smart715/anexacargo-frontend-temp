// Angular
import { Component, OnInit } from '@angular/core';
// Layout
import { HtmlClassService } from '../html-class.service';
// Object-Path
import * as objectPath from 'object-path';

@Component({
  selector: 'kt-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  // Public properties
  today: number = Date.now();
  footerClasses = '';
  footerContainerClasses = '';

  /**
   * Component constructor
   *
   * @param uiClasses: HtmlClassService
   */
  constructor(private uiClasses: HtmlClassService) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    this.footerClasses = this.uiClasses.getClasses('footer', true).toString();
    this.footerContainerClasses = this.uiClasses.getClasses('footer_container', true).toString();
  }
}
