// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Login } from '../../../../core/auth';
import { CustomerService } from 'src/app/service/customer.service';

import { MessengerService } from 'src/app/service/messenger.service';
import { ImageService } from 'src/app/service/image.service';
import { flatMap } from 'lodash';


/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
	// EMAIL: 'admin@demo.com',
	// PASSWORD: 'demo'
	EMAIL: '',
	PASSWORD: ''
};

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];
	roleFlag;
	roleTitle;
	image_url;
	private unsubscribe: Subject<any>;

	private returnUrl: any;


	tempResult: any = [];
	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private auth: AuthService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private customerService: CustomerService,
		private messengerService: MessengerService,
		private uploader: ImageService,


	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.uploader.getImageUrl().then(result => {
			this.image_url = result[0]?.image_url;

			this.cdr.detectChanges();
		})
		this.initLoginForm();
		this.roleFlag = false; //false admin // true clientes
		this.roleTitle = "customer";
		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params.returnUrl || '/';
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// demo message to show
		if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			// const initialNotice = `Use account
			// <strong>${DEMO_PARAMS.EMAIL}</strong> and password
			// <strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
			// this.authNoticeService.setNotice(initialNotice, 'info');
		}

		this.loginForm = this.fb.group({
			email: [DEMO_PARAMS.EMAIL, Validators.compose([
				Validators.required,
				Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: [DEMO_PARAMS.PASSWORD, Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		console.log(this.roleFlag);
		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const authData = {
			email: controls.email.value,
			password: controls.password.value
		};

		if (this.roleFlag) {
			this.customerService.getCustomerByEmail(authData).then(result => {
				this.tempResult = result;
				if (this.tempResult.length == 0) {
					this.authNoticeService.setNotice('please input valid email and password', 'danger');
				}
				else {
					if (this.tempResult[0].status == 1) {
						this.authNoticeService.setNotice('your account is limited, please contact our support team', 'danger');
					}
					else {
						this.uploader.getImageUrl().then(result => {
							window.localStorage.setItem('image_url', result[0]["image_url"]);
						})
						this.authNoticeService.setNotice('Login Successfully', 'success');
						window.localStorage.setItem('idcustomers', this.tempResult[0].idcustomers);
						window.localStorage.setItem('userRole', '0');
						window.localStorage.setItem('customerGroup', this.tempResult[0].customerGroup);

						this.router.navigate(['orders']); // Main page
					}
				}
			}).catch(err => {
				console.log(err);
			})
		}
		else {
			console.log("admin");
			this.messengerService.getMessengerByEmail(authData).then(result => {
				this.tempResult = result;
				console.log(this.tempResult);

				if (this.tempResult.length == 0) {
					this.authNoticeService.setNotice('please input valid email and password', 'danger');
				}
				else {
					if (this.tempResult[0].status == 1) {
						this.authNoticeService.setNotice('your account is limited, please contact our support team', 'danger');
					}
					else {
						this.authNoticeService.setNotice('Login Successfully', 'success');
						this.uploader.getImageUrl().then(result => {
							window.localStorage.setItem('image_url', result[0]["image_url"]);
						})
						window.localStorage.setItem('userRole', this.tempResult[0].role);
						window.localStorage.setItem('userID', this.tempResult[0].idmessengers);

						if (this.tempResult[0].role == '2') {
							this.router.navigate(['courier']);
						}
						else {
							this.router.navigate(['warehouse']);
						}
					}
				}
			}).catch(err => {
				console.log(err);
			})
		}
		// this.auth
		// 	.login(authData.email, authData.password)
		// 	.pipe(
		// 		tap(user => {
		// 			if (user) {
		// 				this.store.dispatch(new Login({authToken: user.accessToken}));
		// 				this.router.navigateByUrl(this.returnUrl); // Main page
		// 			} else {
		// 				this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
		// 			}
		// 		}),
		// 		takeUntil(this.unsubscribe),
		// 		finalize(() => {
		// 			this.loading = false;
		// 			this.cdr.markForCheck();
		// 		})
		// 	)
		// 	.subscribe();
	}

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}
	changeRole() {
		console.log(this.roleFlag);
		if (this.roleFlag) {
			this.roleTitle = "admin or messenger";
		}
		else {
			this.roleTitle = "customer";
		}
	}
}
