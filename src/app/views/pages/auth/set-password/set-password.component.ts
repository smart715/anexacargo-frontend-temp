import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../register/confirm-password.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/service/customer.service';
import { AuthNoticeService } from 'src/app/core/auth';

@Component({
  selector: 'kt-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {
	passwordForm: FormGroup;
  token;
  email;
	loading = false;

  constructor(
    private fb: FormBuilder,
		private route: ActivatedRoute,
		private customerService: CustomerService,
    private router: Router,
		public authNoticeService: AuthNoticeService,
    
  ) { }

  async ngOnInit(): Promise<void> {
    this.initPasswordForm();
    await this.route.queryParams.subscribe(params => {
      this.token = params.token;
      console.log(this.token)
    });
    this.customerService.getCustomerByTempToken(this.token).then((result : any) => {
      console.log(result);
      if(result.length == 0) {
        this.router.navigate(['auth/login']);
      }
      else {
        this.email = result[0].email;
        console.log(this.email);
        this.customerService.setResetPwdToken(this.email, '').then(result => {
          console.log(result);
        }).catch(err => {
          console.log(err);
        })
      }
    }).catch(err => {
      console.log(err);
    })
  }

  initPasswordForm() {
    this.passwordForm = this.fb.group({

			password: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			],
			confirmPassword: ['', Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		}, {
			validator: ConfirmPasswordValidator.MatchPassword
		});
  }

  isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.passwordForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }
  
  submit(){
    const controls = this.passwordForm.controls;
		/** check form */
		if (this.passwordForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
    }
    else {
      console.log(this.passwordForm.value.password);
      this.customerService.resetPwd(this.email, this.passwordForm.value.password).then(result => {
        this.authNoticeService.setNotice('Password Changed successfully', 'success');
        this.router.navigate(['auth/login']);
      }).catch(err => {
        console.log(err);
					this.authNoticeService.setNotice('Unfortunately error occured', 'danger');

      })
    }
  }

}
