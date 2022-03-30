// Angular
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
// NgBootstrap
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// Core module
import { CoreModule } from '../../core/core.module';
// CRUD Partials
import {
  ActionNotificationComponent,
  AlertComponent,
  DeleteEntityDialogComponent,
  FetchEntityDialogComponent,
  UpdateStatusDialogComponent,
} from './content/crud';
// Layout partials
import {
  ContextMenu2Component,
  ContextMenuComponent,
  LanguageSelectorComponent,
  NotificationComponent,
  QuickActionComponent,
  QuickPanelComponent,
  QuickUserPanelComponent,
  ScrollTopComponent,
  SearchDefaultComponent,
  SearchDropdownComponent,
  SearchResultComponent,
  SplashScreenComponent,
  StickyToolbarComponent,
  Subheader1Component,
  Subheader2Component,
  Subheader3Component,
  SubheaderSearchComponent,
  UserProfile2Component,
  UserProfile3Component,
  UserProfileComponent,
  UserProfile4Component
} from './layout';
import {
  Widget1SalesStatComponent,
  Widget9RecentActivitiesComponent,
  Widget12NewUsersComponent,
  Widget7WeeklySalesComponent,
  Widget1TasksOverviewComponent,
  Widget2NewArrivalsComponent,
  Widget3NewArrivalsAuthorsComponent,
  Widget4TodoComponent,
  Widget8TrendsComponent,
  Dropdown1Component,
  Dropdown2Component,
  Dropdown3Component,
  Dropdown4Component,
  Dropdown5Component
} from './content/dashboard-widgets';
// General
import { NoticeComponent } from './content/general/notice/notice.component';
import { PortletModule } from './content/general/portlet/portlet.module';
// Extra module
import { WidgetModule } from './content/widgets/widget.module';
// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
import { CartComponent } from './layout/topbar/cart/cart.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ScrollTopComponent,
    NoticeComponent,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    AlertComponent,

    // topbar components
    ContextMenu2Component,
    ContextMenuComponent,
    QuickPanelComponent,
    QuickUserPanelComponent,
    ScrollTopComponent,
    SearchResultComponent,
    SplashScreenComponent,
    StickyToolbarComponent,
    Subheader1Component,
    Subheader2Component,
    Subheader3Component,
    SubheaderSearchComponent,
    LanguageSelectorComponent,
    NotificationComponent,
    QuickActionComponent,
    SearchDefaultComponent,
    SearchDropdownComponent,
    UserProfileComponent,
    UserProfile2Component,
    UserProfile3Component,
    UserProfile4Component,
    CartComponent,
    Widget1SalesStatComponent,
    Widget9RecentActivitiesComponent,
    Widget12NewUsersComponent,
    Widget7WeeklySalesComponent,
    Widget1TasksOverviewComponent,
    Widget2NewArrivalsComponent,
    Widget3NewArrivalsAuthorsComponent,
    Widget4TodoComponent,
    Widget8TrendsComponent,
    Dropdown1Component,
    Dropdown2Component,
    Dropdown3Component,
    Dropdown4Component,
    Dropdown5Component
  ],
  exports: [
    WidgetModule,
    PortletModule,

    ScrollTopComponent,
    NoticeComponent,
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    FetchEntityDialogComponent,
    UpdateStatusDialogComponent,
    AlertComponent,

    // topbar components
    ContextMenu2Component,
    ContextMenuComponent,
    QuickPanelComponent,
    QuickUserPanelComponent,
    ScrollTopComponent,
    SearchResultComponent,
    SplashScreenComponent,
    StickyToolbarComponent,
    Subheader1Component,
    Subheader2Component,
    Subheader3Component,
    SubheaderSearchComponent,
    LanguageSelectorComponent,
    NotificationComponent,
    QuickActionComponent,
    SearchDefaultComponent,
    SearchDropdownComponent,
    UserProfileComponent,
    UserProfile2Component,
    UserProfile3Component,
    UserProfile4Component,
    CartComponent,
    Widget1SalesStatComponent,
    Widget9RecentActivitiesComponent,
    Widget12NewUsersComponent,
    Widget7WeeklySalesComponent,
    Widget1TasksOverviewComponent,
    Widget2NewArrivalsComponent,
    Widget3NewArrivalsAuthorsComponent,
    Widget4TodoComponent,
    Widget8TrendsComponent,
    Dropdown1Component,
    Dropdown2Component,
    Dropdown3Component,
    Dropdown4Component,
    Dropdown5Component
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    InlineSVGModule,
    CoreModule,
    PortletModule,
    WidgetModule,
    NgApexchartsModule,
    // angular material modules
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,

    // ng-bootstrap modules
    NgbDropdownModule,
    NgbTabsetModule,
    NgbTooltipModule,
  ],
})
export class PartialsModule {
}
