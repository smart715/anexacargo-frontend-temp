// Angular
import { Component } from '@angular/core';
import {LayoutConfigService} from '../../../../core/_base/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  searchDisplay = true;
  notificationsDisplay = true;
  quickActionsDisplay = true;
  cartDisplay = true;
  quickPanelDisplay = true;
  languagesDisplay = true;
  userDisplay = true;
  userLayout = 'offcanvas';
  userDropdownStyle = 'light';

  constructor(private layoutConfigService: LayoutConfigService,
		private router: Router,
    ) {
    this.searchDisplay = this.layoutConfigService.getConfig('extras.search.display');
    this.notificationsDisplay = this.layoutConfigService.getConfig('extras.notifications.display');
    this.quickActionsDisplay = this.layoutConfigService.getConfig('extras.quick-actions.display');
    this.cartDisplay = this.layoutConfigService.getConfig('extras.cart.display');
    this.quickPanelDisplay = this.layoutConfigService.getConfig('extras.quick-panel.display');
    this.languagesDisplay = this.layoutConfigService.getConfig('extras.languages.display');
    this.userDisplay = this.layoutConfigService.getConfig('extras.user.display');
    this.userLayout = this.layoutConfigService.getConfig('extras.user.layout');
    this.userDropdownStyle = this.layoutConfigService.getConfig('extras.user.dropdown.style');
    
  }
  signOut(){
      window.localStorage.clear();
      this.router.navigate(['auth/login']); // Main page
  }
}
