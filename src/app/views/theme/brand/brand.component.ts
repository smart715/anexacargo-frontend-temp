// Angular
import { AfterViewInit, Component, OnInit } from '@angular/core';
// Layout
import { LayoutConfigService, ToggleOptions } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';

@Component({
  selector: 'kt-brand',
  templateUrl: './brand.component.html',
})
export class BrandComponent implements OnInit, AfterViewInit {
  // Public properties
  headerLogo = '';
  brandClasses = '';
  asideSelfMinimizeToggle = true;

  toggleOptions: ToggleOptions = {
    target: 'kt_body',
    targetState: 'aside-minimize',
    toggleState: 'active'
  };

  /**
   * Component constructor
   *
   * @param layoutConfigService: LayoutConfigService
   * @param htmlClassService: HtmlClassService
   */
  constructor(private layoutConfigService: LayoutConfigService, public htmlClassService: HtmlClassService) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    this.headerLogo = this.getAsideLogo();
    this.brandClasses = this.htmlClassService.getClasses('brand', true).toString();
    this.asideSelfMinimizeToggle = this.layoutConfigService.getConfig('aside.self.minimize.toggle');
  }

  /**
   * On after view init
   */
  ngAfterViewInit(): void {
  }

  getAsideLogo() {
    let image_url = window.localStorage.getItem("image_url");
    let result = 'logo-light.png';
    const brandSelfTheme = this.layoutConfigService.getConfig('brand.self.theme') || '';
    if (brandSelfTheme === 'light') {
      result = 'logo-dark.png';
    }
    return `${image_url}`;
  }

  toggleAsideClick() {
    document.body.classList.toggle('aside-minimize');
  }
}
