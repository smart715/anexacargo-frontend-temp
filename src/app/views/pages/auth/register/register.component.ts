// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// NGRX
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Register, User } from '../../../../core/auth/';
import { Subject } from 'rxjs';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { CustomerAuthService } from 'src/app/service/customer-auth.service';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
	selector: 'kt-register',
	templateUrl: './register.component.html',
	encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit, OnDestroy {
	registerForm: FormGroup;
	loading = false;
	errors: any = [];
	customer: any = {};
	tempResult;
	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param router: Router
	 * @param auth: AuthService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 */
	constructor(
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private router: Router,
		private auth: AuthService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private customerAuthService: CustomerAuthService,
		private customerService: CustomerService,


	) {
		this.unsubscribe = new Subject();
	}

	/*
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	*/

	/**
	 * On init
	 */
	ngOnInit() {
		this.initRegisterForm();
	}

	/*
	* On destroy
	*/
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initRegisterForm() {
		this.registerForm = this.fb.group({
			lastName: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			email: ['', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				// https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
				Validators.maxLength(320)
			]),
			],
			firstName: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			]),
			],
			mobile: ['', Validators.compose([
				Validators.required,
			]),],
			// password: ['', Validators.compose([
			// 	Validators.required,
			// 	Validators.minLength(3),
			// 	Validators.maxLength(100)
			// ])
			// ],
			// confirmPassword: ['', Validators.compose([
			// 	Validators.required,
			// 	Validators.minLength(3),
			// 	Validators.maxLength(100)
			// ])
			// ],
			agree: [false, Validators.compose([Validators.required])]
		});
	}

	/**
	 * Form Submit
	 */
	// submit() {
	// 	const controls = this.registerForm.controls;

	// 	// check form
	// 	if (this.registerForm.invalid) {
	// 		Object.keys(controls).forEach(controlName =>
	// 			controls[controlName].markAsTouched()
	// 		);
	// 		return;
	// 	}

	// 	this.loading = true;

	// 	if (!controls.agree.value) {
	// 		// you must agree the terms and condition
	// 		// checkbox cannot work inside mat-form-field https://github.com/angular/material2/issues/7891
	// 		this.authNoticeService.setNotice('You must agree the terms and condition', 'danger');
	// 		return;
	// 	}

	// 	const _user: User = new User();
	// 	_user.clear();
	// 	_user.email = controls.email.value;
	// 	_user.firstName = controls.firstName.value;
	// 	_user.lastName = controls.lastName.value;
	// 	_user.password = controls.password.value;
	// 	_user.roles = [];
	// 	this.auth.register(_user).pipe(
	// 		tap(user => {
	// 			if (user) {
	// 				this.store.dispatch(new Register({authToken: user.accessToken}));
	// 				// pass notice message to the login page
	// 				this.authNoticeService.setNotice(this.translate.instant('AUTH.REGISTER.SUCCESS'), 'success');
	// 				this.router.navigateByUrl('/auth/login');
	// 			} else {
	// 				this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
	// 			}
	// 		}),
	// 		takeUntil(this.unsubscribe),
	// 		finalize(() => {
	// 			this.loading = false;
	// 			this.cdr.markForCheck();
	// 		})
	// 	).subscribe();
	// }
	submit() {
		const controls = this.registerForm.controls;
		if (this.registerForm.invalid) {
			return
		}
		if (!controls.agree.value) {
			this.authNoticeService.setNotice('You must agree the terms and condition', 'danger');
			return;
		}

		this.customer.uname = controls.firstName.value;
		this.customer.lname = controls.lastName.value;
		this.customer.phone = controls.mobile.value;

		this.customer.email = controls.email.value;
		// this.customer.password = controls.password.value;
		// this.customerService.getAll().then(customers => {
		// 	console.log(customers);
		// })
		// [req.body.uname, req.body.lname, now, '0', req.body.email, req.body.phone, '1', req.body.password, '1', req.body.pID],
		console.log(this.customer);
		this.customerService.createCustomerByUser(this.customer).then((result) => {
			this.tempResult = result;
			this.authNoticeService.setNotice('Registered Successfully', 'success');
			window.localStorage.setItem('idcustomers', this.tempResult.results.insertId);
			window.localStorage.setItem('userRole', '0');
			this.router.navigate(['auth/welcome']); // Main page
			// this.router.navigate(['orders']); // Main page


		}).catch(err => {
			this.authNoticeService.setNotice('ya existe un usuario con este email. Por favor utilice otro email o contáctenos.', 'danger');
			console.log(err);
		})

	}
	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.registerForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
}
