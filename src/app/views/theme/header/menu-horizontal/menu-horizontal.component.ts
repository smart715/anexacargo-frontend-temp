// Angular
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  Input,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter } from 'rxjs/operators';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import {
  LayoutConfigService,
  MenuConfigService,
  MenuHorizontalService,
  MenuOptions,
  OffcanvasOptions
} from '../../../../core/_base/layout';
// HTML Class
import { HtmlClassService } from '../../html-class.service';

@Component({
  selector: 'kt-menu-horizontal',
  templateUrl: './menu-horizontal.component.html',
  styleUrls: ['./menu-horizontal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuHorizontalComponent implements OnInit, AfterViewInit {
  private offcanvas: any;
  @ViewChild('headerMenuOffcanvas', { static: true }) headerMenuOffcanvas: ElementRef;

  @Input() headerLogo: string;
  @Input() headerMenuSelfDisplay: boolean;
  @Input() headerMenuClasses: string;
  // Public properties
  currentRouteUrl: any = '';
  asideSelfDisplay = '';
  rootArrowEnabled: boolean;

  userRole;

  menuOptions: MenuOptions = {
    submenu: {
      desktop: 'dropdown',
      tablet: 'accordion',
      mobile: 'accordion'
    },
    accordion: {
      slideSpeed: 200, // accordion toggle slide speed in milliseconds
      expandAll: false // allow having multiple expanded accordions in the menu
    },
    dropdown: {
      timeout: 50
    }
  };

  offcanvasOptions: OffcanvasOptions = {
    overlay: true,
    baseClass: 'header-menu-wrapper',
    closeBy: 'kt_header_menu_mobile_close_btn',
    toggleBy: {
      target: 'kt_header_mobile_toggle',
      state: 'mobile-toggle-active'
    }
  };

  /**
   * Component Conctructor
   *
   * @param el: ElementRef
   * @param htmlClassService: HtmlClassService
   * @param menuHorService: MenuHorService
   * @param menuConfigService: MenuConfigService
   * @param layoutConfigService: LayouConfigService
   * @param router: Router
   * @param render: Renderer2
   * @param cdr: ChangeDetectorRef
   */
  constructor(
    private el: ElementRef,
    public htmlClassService: HtmlClassService,
    public menuHorService: MenuHorizontalService,
    private menuConfigService: MenuConfigService,
    private layoutConfigService: LayoutConfigService,
    private router: Router,
    private render: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * After view init
   */
  ngAfterViewInit(): void {
  }

  /**
   * On init
   */
  ngOnInit(): void {
    if(window.localStorage.getItem("userRole")){
      this.userRole = window.localStorage.getItem("userRole")
    }
    else {
      this.router.navigate(['auth/login']); // Main page

    }
    this.rootArrowEnabled = this.layoutConfigService.getConfig('header.menu.self.rootArrow');
    this.currentRouteUrl = this.router.url;
    setTimeout(() => {
      this.offcanvas = new KTOffcanvas(this.headerMenuOffcanvas.nativeElement, this.offcanvasOptions);
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRouteUrl = this.router.url;
        this.mobileMenuClose();
        this.cdr.markForCheck();
      });
  }

  /**
   * Return Css Class Name
   * @param item: any
   */
  getItemCssClasses(item) {
    let classes = 'menu-item';

    if (objectPath.get(item, 'submenu')) {
      classes += ' menu-item-submenu';
    }

    if (!item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-active menu-item-here';
    }

    if (item.submenu && this.isMenuItemIsActive(item)) {
      classes += ' menu-item-open menu-item-here';
    }

    if (objectPath.get(item, 'resizer')) {
      classes += ' menu-item-resize';
    }

    const menuType = objectPath.get(item, 'submenu.type') || 'classic';
    if ((objectPath.get(item, 'root') && menuType === 'classic')
      || parseInt(objectPath.get(item, 'submenu.width'), 10) > 0) {
      classes += ' menu-item-rel';
    }

    const customClass = objectPath.get(item, 'custom-class');
    if (customClass) {
      classes += ' ' + customClass;
    }

    if (objectPath.get(item, 'icon-only')) {
      classes += ' menu-item-icon-only';
    }

    return classes;
  }

  /**
   * Returns Attribute SubMenu Toggle
   * @param item: any
   */
  getItemAttrSubmenuToggle(item) {
    let toggle = 'hover';
    if (objectPath.get(item, 'toggle') === 'click') {
      toggle = 'click';
    } else if (objectPath.get(item, 'submenu.type') === 'tabs') {
      toggle = 'tabs';
    } else {
      // submenu toggle default to 'hover'
    }

    return toggle;
  }

  /**
   * Returns Submenu CSS Class Name
   * @param item: any
   */
  getItemMenuSubmenuClass(item) {
    let classes = '';

    const alignment = objectPath.get(item, 'alignment') || 'right';

    if (alignment) {
      classes += ' menu-submenu-' + alignment;
    }

    const type = objectPath.get(item, 'type') || 'classic';
    if (type === 'classic') {
      classes += ' menu-submenu-classic';
    }
    if (type === 'tabs') {
      classes += ' menu-submenu-tabs';
    }
    if (type === 'mega') {
      if (objectPath.get(item, 'width')) {
        classes += ' menu-submenu-fixed';
      }
    }

    if (objectPath.get(item, 'pull')) {
      classes += ' menu-submenu-pull';
    }

    return classes;
  }

  /**
   * Check Menu is active
   * @param item: any
   */
  isMenuItemIsActive(item): boolean {
    if (item.submenu) {
      return this.isMenuRootItemIsActive(item);
    }

    if (!item.page) {
      return false;
    }

    return this.currentRouteUrl.indexOf(item.page) !== -1;
  }

  /**
   * Check Menu Root Item is active
   * @param item: any
   */
  isMenuRootItemIsActive(item): boolean {
    if (item.submenu.items) {
      for (const subItem of item.submenu.items) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (item.submenu.columns) {
      for (const subItem of item.submenu.columns) {
        if (this.isMenuItemIsActive(subItem)) {
          return true;
        }
      }
    }

    if (typeof item.submenu[Symbol.iterator] === 'function') {
      for (const subItem of item.submenu) {
        const active = this.isMenuItemIsActive(subItem);
        if (active) {
          return true;
        }
      }
    }

    return false;
  }

  mobileMenuClose() {
    if (KTUtil.isBreakpointDown('lg') && this.offcanvas) { // Tablet and mobile mode
      this.offcanvas.hide(); // Hide offcanvas after general link click
    }
  }
  customers(){
    this.router.navigate(['ecommerce/customers']);
  }
  orders(){
    this.router.navigate(['ecommerce/orders']);
  }
  packages(){
    this.router.navigate(['ecommerce/package']);
  }
  reports(){
    this.router.navigate(['ecommerce/invoice']);

  }
  settings(){
    this.router.navigate(['ecommerce/setting']);
  }
  courier(){
    this.router.navigate(['courier']);
    
  }
  customer_orders(){
    this.router.navigate(['orders']);
    
  }
  myOrders(){
    this.router.navigate(['orders/myOrder']);

  }
  invoice(){
    this.router.navigate(['ecommerce/invoice']);

  }
  tracking(){
    this.router.navigate(['tracking']);
  }
  onRightClick(event){
    console.log(event);
  }
  warehouse(){
    this.router.navigate(['warehouse']);
  }
  warehouseOrder(){
    this.router.navigate(['warehouse/order']);
  }
  couriers(){
    this.router.navigate(['warehouse/couriers']);
  }
  news(){
    this.router.navigate(['settings/news']);
  }
  faq(){
    this.router.navigate(['settings/faq']);
  }

}
