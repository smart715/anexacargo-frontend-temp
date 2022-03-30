// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';
// Components
import { UserManagementComponent } from './user-management.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { RoleEditDialogComponent } from './roles/role-edit/role-edit.dialog.component';
import { UserRolesListComponent } from './users/_subs/user-roles/user-roles-list.component';
import { ChangePasswordComponent } from './users/_subs/change-password/change-password.component';
import { AddressComponent } from './users/_subs/address/address.component';
import { SocialNetworksComponent } from './users/_subs/social-networks/social-networks.component';

// Material
import {
	usersReducer,
	UserEffects
} from '../../../core/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
	{
		path: '',
		component: UserManagementComponent,
		children: [
			{
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
			},
			{
				path: 'roles',
				component: RolesListComponent
			},
			{
				path: 'users',
				component: UsersListComponent
			},
			{
				path: 'users:id',
				component: UsersListComponent
			},
			{
				path: 'users/add',
				component: UserEditComponent
			},
			{
				path: 'users/add:id',
				component: UserEditComponent
			},
			{
				path: 'users/edit',
				component: UserEditComponent
			},
			{
				path: 'users/edit/:id',
				component: UserEditComponent
			},
		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		PartialsModule,
		RouterModule.forChild(routes),
		StoreModule.forFeature('users', usersReducer),
        EffectsModule.forFeature([UserEffects]),
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
		MatProgressBarModule,
		MatDatepickerModule,
		MatCardModule,
		MatPaginatorModule,
		MatSortModule,
		MatCheckboxModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		MatExpansionModule,
		MatTabsModule,
		MatTooltipModule,
		MatDialogModule
	],
	providers: [
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
				panelClass: 'kt-mat-dialog-container__wrapper',
				height: 'auto',
				width: '900px'
			}
		},
		HttpUtilsService,
		TypesUtilsService,
		LayoutUtilsService
	],
	entryComponents: [
		ActionNotificationComponent,
		RoleEditDialogComponent
	],
	declarations: [
		UserManagementComponent,
		UsersListComponent,
		UserEditComponent,
		RolesListComponent,
		RoleEditDialogComponent,
		UserRolesListComponent,
		ChangePasswordComponent,
		AddressComponent,
		SocialNetworksComponent
	]
})
export class UserManagementModule {}
