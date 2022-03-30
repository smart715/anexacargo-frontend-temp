// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// Translate
import { TranslateModule } from '@ngx-translate/core';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// CRUD
import { InterceptService } from '../../../core/_base/crud/';
// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
// Auth
import { AuthEffects, AuthGuard, authReducer, AuthService } from '../../../core/auth';
import { SetPasswordComponent } from './set-password/set-password.component';
import { WelcomComponent } from './welcom/welcom.component';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: '',
				redirectTo: 'register',
				pathMatch: 'full'
			},

			{
				path: 'login',
				// redirectTo: 'register',
				component: LoginComponent,
				data: { returnUrl: window.location.pathname }
			},
			{
				path: 'register',
				component: RegisterComponent
			},
			{
				path: 'forgot-password',
				component: ForgotPasswordComponent,
			},
			{
				path: 'welcome',
				component: WelcomComponent,
			},
			{
				path: 'set-password',
				component: SetPasswordComponent,
			}
		]
	}
];


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		RouterModule.forChild(routes),
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		TranslateModule.forChild(),
		StoreModule.forFeature('auth', authReducer),
		EffectsModule.forFeature([AuthEffects])
	],
	providers: [
		InterceptService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: InterceptService,
			multi: true
		},
	],
	exports: [AuthComponent],
	declarations: [
		AuthComponent,
		LoginComponent,
		RegisterComponent,
		ForgotPasswordComponent,
		AuthNoticeComponent,
		SetPasswordComponent,
		WelcomComponent
	]
})

export class AuthModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AuthModule,
			providers: [
				AuthService,
				AuthGuard
			]
		};
	}
}
