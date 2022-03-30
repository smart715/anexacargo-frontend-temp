// Angular
import { Component, Input } from '@angular/core';

@Component({
  selector: 'kt-widget2-new-arrivals',
  templateUrl: './widget2-new-arrivals.component.html',
})
export class Widget2NewArrivalsComponent {
  @Input() cssClasses = '';
  currentTab = 'Day';

  constructor() {
  }

  setCurrentTab(tab: string) {
    this.currentTab = tab;
  }
}
