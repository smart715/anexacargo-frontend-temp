import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
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
import { MatStepperModule } from '@angular/material/stepper';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { CourierComponent } from './courier/courier.component';
import { CourierNewComponent } from './courier/courier-new/courier-new.component';
import { WarehousesDetailComponent } from './warehouses/warehouses-detail/warehouses-detail.component';
import { WarehousesLogComponent } from './warehouses-log/warehouses-log.component';
import { WarehouseScanReadyComponent } from './warehouses/warehouses-scan/warehouse-scan-ready/warehouse-scan-ready.component';
import { WarehouseScanSalidaEntregaComponent } from './warehouses/warehouses-scan/warehouse-scan-salida-entrega/warehouse-scan-salida-entrega.component';
import { WarehouseAssignedToComponent } from './warehouses/warehouses-scan/warehouse-assigned-to/warehouse-assigned-to.component';
import { ChangeWarehouseStatusComponent } from './warehouses/change-warehouse-status/change-warehouse-status.component';
import { ScanDeEntregaComponent } from './warehouses/warehouses-scan/scan-de-entrega/scan-de-entrega.component';
import { ScanDeSalidaComponent } from './warehouses/warehouses-scan/scan-de-salida/scan-de-salida.component';
import { WarehouseOrderListComponent } from './warehouse-order-list/warehouse-order-list.component';
import { WarehouseOrderViewComponent } from './warehouse-order-view/warehouse-order-view.component';
import { PrintLabelComponent } from './warehouses/print-label/print-label.component';
import { ModalLabelComponent } from './warehouses/modal-label/modal-label.component';


@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		MatStepperModule,
		MatDialogModule,
		HttpClientModule,
		PartialsModule,
		NgxPermissionsModule.forChild(),
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

		RouterModule.forChild([
			{
				path: '',
				component: WarehousesComponent
			},
			{
				path: 'order',
				component: WarehouseOrderListComponent
			},
			{
				path: 'order/view',
				component: WarehouseOrderViewComponent
			},
			{
				path: 'detail',
				component: WarehousesDetailComponent
			},
			{
				path: 'couriers',
				component: CourierComponent
			},
			{
				path: 'scan/ready',
				component: WarehouseScanReadyComponent
			},

			{
				path: 'scan/salidaEntrega',
				component: WarehouseScanSalidaEntregaComponent
			},
			{
				path: 'scan/salida',
				component: ScanDeSalidaComponent
			},
			{
				path: 'scan/entrega',
				component: ScanDeEntregaComponent
			},
			{
				path: 'courier/new',
				component: CourierNewComponent
			}
		])
	],
	providers: [
		FakeApiService,
		ModuleGuard,
		{
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
				panelClass: 'mat-dialog-container-wrapper',
				height: 'auto',
				width: '900px'
			}
		},
	],
	entryComponents: [
		WarehouseAssignedToComponent,
		ChangeWarehouseStatusComponent,
		PrintLabelComponent,
		ModalLabelComponent
	],
	declarations: [
		WarehousesComponent,
		CourierComponent,
		CourierNewComponent,
		WarehousesDetailComponent,
		WarehousesLogComponent,
		WarehouseScanReadyComponent,
		WarehouseScanSalidaEntregaComponent,
		WarehouseAssignedToComponent,
		ChangeWarehouseStatusComponent,
		ScanDeEntregaComponent,
		ScanDeSalidaComponent,
		WarehouseOrderListComponent,
		WarehouseOrderViewComponent,
		PrintLabelComponent,
		ModalLabelComponent
	]

})
export class WarehousesModule { }
