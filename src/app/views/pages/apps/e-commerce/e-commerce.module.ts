// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


// import { AgmCoreModule } from '@agm/core';

// Fake API Angular-in-memory
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// Translate Module
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// UI
import { PartialsModule } from '../../../partials/partials.module';
// Core
import { FakeApiService } from '../../../../core/_base/layout';
// Auth
import { ModuleGuard } from '../../../../core/auth';

// Core => Services
import {
	customersReducer,
	CustomerEffects,
	CustomersService,
	productsReducer,
	ProductEffects,
	ProductsService,
	productRemarksReducer,
	ProductRemarkEffects,
	ProductRemarksService,
	productSpecificationsReducer,
	ProductSpecificationEffects,
	ProductSpecificationsService
} from '../../../../core/e-commerce';
// Core => Utils
import {
	HttpUtilsService,
	TypesUtilsService,
	InterceptService,
	LayoutUtilsService
} from '../../../../core/_base/crud';
// Shared
import {
	ActionNotificationComponent,
	DeleteEntityDialogComponent,
	FetchEntityDialogComponent,
	UpdateStatusDialogComponent
} from '../../../partials/content/crud';
import {
	WarehouseOrderListComponent
} from './customers/warehouse-order-list/warehouse-order-list.component';
// Components
import { ECommerceComponent } from './e-commerce.component';
// Customers
// Products
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { RemarksListComponent } from './products/_subs/remarks/remarks-list/remarks-list.component';
import { SpecificationsListComponent } from './products/_subs/specifications/specifications-list/specifications-list.component';
import { SpecificationEditDialogComponent } from './products/_subs/specifications/specification-edit/specification-edit-dialog.component';
// Orders
import { OrdersListComponent } from './orders/orders-list/orders-list.component';
import { OrderEditComponent } from './orders/order-edit/order-edit.component';
import { FocusDirective } from './orders/order-edit/focus.directive';

// Material
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../../environments/environment';
import { NgbProgressbarModule, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CustomerViewComponent } from './customers/customer-view/customer-view.component';
import { PackageComponent } from './package/package.component';
import { PackageViewComponent } from './package-view/package-view.component';
import { PackageModalComponent } from './modal/package-modal/package-modal.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { InvoicesListComponent } from './invoices/invoices-list/invoices-list.component';
import { InvoicesDetailComponent } from './invoices/invoices-detail/invoices-detail.component';
import { InvoicesNewPaymentComponent } from './invoices/invoices-new-payment/invoices-new-payment.component';
import { CustomerListComponent } from './customers/customer-list/customer-list.component';
import { CustomerNewComponent } from './customers/customer-new/customer-new.component';
import { OrdersByCustomerComponent } from './customers/orders-by-customer/orders-by-customer.component';
import { PackageTypeComponent } from './settings/package-type/package-type.component';
import { AddPackageTypeComponent } from './settings/package-type/add-package-type/add-package-type.component';
import { PricingComponent } from './settings/pricing/pricing.component';
import { EditPricingComponent } from './settings/pricing/edit-pricing/edit-pricing.component';
import { EditAreaComponent } from './settings/pricing/edit-area/edit-area.component';
import { CustomerCommentsComponent } from './customers/customer-comments/customer-comments.component';
import { PackageScanComponent } from './package/package-scan/package-scan.component';
import { InvoiceComponent } from './invoices/invoice/invoice.component';
import { CustomerGroupsComponent } from './settings/customer-groups/customer-groups.component';
import { AddCustomerGroupsComponent } from './settings/customer-groups/add-customer-groups/add-customer-groups.component';
import { AddCommentsComponent } from './customers/customer-comments/add-comments/add-comments.component';
import { AssignPackageComponent } from './package/assign-package/assign-package.component';
import { PublicTrackingComponent } from './settings/public-tracking/public-tracking.component';
import { AssignOrderComponentComponent } from './orders/orders-list/assign-order-component/assign-order-component.component';
import { PrintLabelComponent } from './package-view/print-label/print-label.component';
import { NgxPrintModule } from 'ngx-print';
import { InvoicesNewComponent } from './invoices/invoices-new/invoices-new.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { CustomerLogComponent } from './customers/customer-log/customer-log.component';
import { MatStepperModule } from '@angular/material/stepper';
import { WgroupsComponent } from './settings/wgroups/wgroups.component';
import { WdeliveryComponent } from './settings/wdelivery/wdelivery.component';
import { WgroupsDetailComponent } from './settings/wgroups/wgroups-detail/wgroups-detail.component';
import { WdeliveryDetailComponent } from './settings/wdelivery/wdelivery-detail/wdelivery-detail.component';
import { WarehousesComponent } from './customers/warehouses/warehouses.component';


import { WarehousesDetailComponent } from './customers/warehouses/warehouses-detail/warehouses-detail.component';
import { WarehouseScanReadyComponent } from './customers/warehouses/warehouses-scan/warehouse-scan-ready/warehouse-scan-ready.component';
import { WarehouseScanSalidaEntregaComponent } from './customers/warehouses/warehouses-scan/warehouse-scan-salida-entrega/warehouse-scan-salida-entrega.component';
import { WarehouseAssignedToComponent } from './customers/warehouses/warehouses-scan/warehouse-assigned-to/warehouse-assigned-to.component';
import { ChangeWarehouseStatusComponent } from './customers/warehouses/change-warehouse-status/change-warehouse-status.component';
import { ScanDeEntregaComponent } from './customers/warehouses/warehouses-scan/scan-de-entrega/scan-de-entrega.component';
import { ScanDeSalidaComponent } from './customers/warehouses/warehouses-scan/scan-de-salida/scan-de-salida.component';
import { PsbAddComponent } from './settings/psbnews/psbnews.component';
import { CourierFinalComponent } from './settings/courier-final/courier-final.component';
import { FirstLocationComponent } from './settings/first-location/first-location.component';
import { DynamicEmailComponent } from './settings/dynamic-email/dynamic-email.component';
// import { google } from "google-maps";
import { DynamicTableComponent } from './settings/dynamic-table/dynamic-table.component';

declare var google;

// import { GoogleMapComponent } from './settings/google-map/google-map.component';

// tslint:disable-next-line:class-name
const routes: Routes = [
	{
		path: '',
		component: ECommerceComponent,
		// canActivate: [ModuleGuard],
		// data: { moduleName: 'ecommerce' },
		children: [
			{
				path: '',
				redirectTo: 'customers',
				pathMatch: 'full'
			},
			{
				path: 'customers',
				component: CustomerListComponent
			},
			{
				path: 'package',
				component: PackageComponent
			},
			{
				path: 'invoice',
				component: InvoicesListComponent
			},
			{
				path: 'invoice/view',
				component: InvoiceComponent
			},
			{
				path: 'invoice/new',
				component: InvoicesNewComponent
			},
			{
				path: 'invoice/detail',
				component: InvoicesDetailComponent
			},
			{
				path: 'setting',
				component: SettingsComponent
			},
			{
				path: "setting/psbox",
				component: PsbAddComponent
			},
			{
				path: 'user',
				component: UserListComponent
			},
			{
				path: 'package/view',
				component: PackageViewComponent
			},
			{
				path: 'package/scan',
				component: PackageScanComponent
			},
			{
				path: 'customers/view',
				component: CustomerViewComponent,
			},
			{
				path: 'customers/new',
				component: CustomerNewComponent,
			},
			{
				path: 'orders',
				component: OrdersListComponent
			},
			{
				path: 'orders/edit',
				component: OrderEditComponent
			},
			{
				path: 'products',
				component: ProductsListComponent,
			},
			{
				path: 'products/add',
				component: ProductEditComponent
			},
			{
				path: 'products/edit',
				component: ProductEditComponent
			},
			{
				path: 'products/edit/:id',
				component: ProductEditComponent
			},
		]
	}
];

@NgModule({
	imports: [
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyD7J1pZoQVwOC4yV_TZJ08qJbchW-RjGRA',
			libraries: ['geometry', 'places']

		}),
		CKEditorModule,
		MatStepperModule,
		NgxPrintModule,
		MatDialogModule,
		CommonModule,
		HttpClientModule,
		PartialsModule,
		NgxPermissionsModule.forChild(),
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild(),
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatInputModule,
		MatTableModule,
		MatAutocompleteModule,
		MatRadioModule,
		MatIconModule,
		MatNativeDateModule,
		MatRippleModule,
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
		NgbProgressbarModule,
		environment.isMockEnabled ? HttpClientInMemoryWebApiModule.forFeature(FakeApiService, {
			passThruUnknownUrl: true,
			dataEncapsulation: false
		}) : [],
		StoreModule.forFeature('products', productsReducer),
		EffectsModule.forFeature([ProductEffects]),
		StoreModule.forFeature('customers', customersReducer),
		EffectsModule.forFeature([CustomerEffects]),
		StoreModule.forFeature('productRemarks', productRemarksReducer),
		EffectsModule.forFeature([ProductRemarkEffects]),
		StoreModule.forFeature('productSpecifications', productSpecificationsReducer),
		EffectsModule.forFeature([ProductSpecificationEffects]),
		NgxBarcodeModule
	],
	providers: [
		FakeApiService,
		ModuleGuard,
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'mat-dialog-container-wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		TypesUtilsService,
		LayoutUtilsService,
		HttpUtilsService,
		CustomersService,
		ProductRemarksService,
		ProductSpecificationsService,
		ProductsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		OrderEditComponent,
		PackageModalComponent,
		UserDetailComponent,
		DeleteEntityDialogComponent,
		FetchEntityDialogComponent,
		UpdateStatusDialogComponent,
		SpecificationEditDialogComponent,
		InvoicesNewPaymentComponent,
		// CustomerNewComponent,
		AddPackageTypeComponent,
		AddCustomerGroupsComponent,
		EditPricingComponent,
		EditAreaComponent,
		AddCommentsComponent,
		AssignPackageComponent,
		AssignOrderComponentComponent,
		PrintLabelComponent,
		WgroupsDetailComponent,
		WdeliveryDetailComponent,
		ChangeWarehouseStatusComponent
	],
	declarations: [
		DynamicTableComponent,
		DynamicEmailComponent,
		FirstLocationComponent,
		ECommerceComponent,
		// Orders
		OrdersListComponent,
		OrderEditComponent,
		FocusDirective,
		// Products
		PsbAddComponent,
		ProductsListComponent,
		WarehousesComponent,
		WarehousesDetailComponent,
		ScanDeSalidaComponent,
		ScanDeEntregaComponent,
		ChangeWarehouseStatusComponent,
		WarehouseAssignedToComponent,
		WarehouseScanSalidaEntregaComponent,
		WarehouseScanReadyComponent,
		ProductEditComponent,
		WarehouseOrderListComponent,
		RemarksListComponent,
		SpecificationsListComponent,
		SpecificationEditDialogComponent,
		CustomerViewComponent,
		PackageComponent,
		PackageViewComponent,
		PackageModalComponent,
		UserListComponent,
		UserDetailComponent,
		SettingsComponent,
		InvoicesListComponent,
		InvoicesDetailComponent,
		InvoicesNewPaymentComponent,
		CustomerListComponent,
		CustomerNewComponent,
		OrdersByCustomerComponent,
		PackageTypeComponent,
		AddPackageTypeComponent,
		PricingComponent,
		EditPricingComponent,
		EditAreaComponent,
		CustomerCommentsComponent,
		PackageScanComponent,
		InvoiceComponent,
		CustomerGroupsComponent,
		AddCustomerGroupsComponent,
		AddCommentsComponent,
		AssignPackageComponent,
		PublicTrackingComponent,
		AssignOrderComponentComponent,
		PrintLabelComponent,
		InvoicesNewComponent,
		CustomerLogComponent,
		WgroupsComponent,
		WdeliveryComponent,
		WgroupsDetailComponent,
		WdeliveryDetailComponent,
		CourierFinalComponent
	]
})
export class ECommerceModule { }
