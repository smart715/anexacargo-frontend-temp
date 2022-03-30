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
import { SettingsComponent } from './settings/settings.component';
import { NewsComponent } from './news/news.component';
import { NewsNewComponent } from './news/news-new/news-new.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FaqComponent } from './faq/faq.component';
import { FaqCategoryComponent } from './faq/faq-category/faq-category.component';
import { FaqCategoryNewComponent } from './faq/faq-category/faq-category-new/faq-category-new.component';
import { FaqNewComponent } from './faq/faq-new/faq-new.component';

@NgModule({
  imports: [
	CKEditorModule,
    PartialsModule,
    MatStepperModule,
		MatDialogModule,
		CommonModule,
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
				component: SettingsComponent
      },
      {
				path: 'news',
				component: NewsComponent
      },
      {
				path: 'faq',
				component: FaqComponent
      },
      {
				path: 'faq/category',
				component: FaqCategoryComponent
      },
      {
				path: 'faq/new',
				component: FaqNewComponent
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
	NewsNewComponent,
	FaqCategoryNewComponent
	],
  declarations: [
  SettingsComponent,
  NewsComponent,
  NewsNewComponent,
  FaqComponent,
  FaqCategoryComponent,
  FaqCategoryNewComponent,
  FaqNewComponent
  ]

})
export class SettingsModule { }
