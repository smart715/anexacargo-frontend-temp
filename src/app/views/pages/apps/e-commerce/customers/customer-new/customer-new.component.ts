import { Component, OnInit } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/service/customer.service';
import { CustomerGroupsService } from 'src/app/service/customer-groups.service';

import { Router } from '@angular/router';
import { EmailService } from 'src/app/service/email.service';
import { WGroupService } from 'src/app/service/w-group.service';

@Component({
	selector: 'kt-customer-new',
	templateUrl: './customer-new.component.html',
	styleUrls: ['./customer-new.component.scss']
})
export class CustomerNewComponent implements OnInit {
	customerForm: FormGroup;
	hasFormErrors = false;
	tempResult;
	customerGroups;
	WGroups;
	type;
	wGroup;
	constructor(
		// public dialogRef: MatDialogRef<CustomerNewComponent>,
		private fb: FormBuilder,
		private customerService: CustomerService,
		private customerGroupsService: CustomerGroupsService,
		private emailService: EmailService,
		private wGroupService: WGroupService,
		private router: Router,
	) { }

	async ngOnInit(): Promise<void> {
		this.customerForm = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			email: ['', Validators.compose([Validators.required, Validators.email])],
			// phone: ['', Validators.compose([Validators.required])],
			personalID: ['', Validators.compose([Validators.required])],

			mobile: ['', Validators.compose([Validators.required])],
			// company: ['', Validators.compose([Validators.required])],
			// ruc: ['', Validators.compose([Validators.required])],
			// address: ['', Validators.compose([Validators.required])],
			type: ['', Validators.compose([Validators.required])],
			wGroup: ['', Validators.compose([Validators.required])]


		});
		await this.customerGroupsService.getAllCustomerGroups().then(async customerGroups => {
			this.customerGroups = customerGroups;
			this.type = this.customerGroups[0].idcustomerGroup.toString();
			this.customerGroups.map(customerGroup => {
				customerGroup.idcustomerGroup = customerGroup.idcustomerGroup.toString();
			});
			await this.wGroupService.getAllWGroup().then((result: any) => {
				this.WGroups = result;
				this.wGroup = this.WGroups[0].idwGroup.toString();
				this.customerForm.patchValue({
					type: this.type,
					wGroup: this.wGroup,
				})
				this.WGroups.map(wGroup => {
					wGroup.idwGroup = wGroup.idwGroup.toString();
				})
			});
		});


	}
	close() {
		// this.dialogRef.close();

		this.router.navigate(['ecommerce/customers']);

	}
	save() {
		this.hasFormErrors = false;


		if (this.customerForm.invalid) {
			this.hasFormErrors = true;
		}
		else {
			console.log(this.customerForm.value);
			this.customerForm.value.idadmin = window.localStorage.getItem('userID');
			this.customerService.createNew(this.customerForm.value).then(async result => {
				this.tempResult = result;
				let image_url = window.localStorage.getItem("image_url");
				if (this.tempResult.status = "ok") {
					window.alert("email successfully delivered")
					this.router.navigate(['ecommerce/customers']);


					// var html = '<div style="margin: auto;"><img alt="Anexacargo" style="width: 75px;margin-left: auto;margin-right: auto;" src="' + image_url + '"><div>Hola ' +
					// 	this.customerForm.value.firstName +
					// 	'</div><div>Te estamos asignando un número de cuenta con dirección en Miami para que siempre puedas comprar con tranquilidad y seguridad.</div><div>Esta es tu dirección de compras en Miami:</div><div style="border: 1px black solid;margin-top:20px;">' +
					// 	this.customerForm.value.firstName + ' ' + this.customerForm.value.lastName + '<br>1970 Nw 82 Ave<br>AEX' + this.tempResult.results.insertId + '<br>Miami Florida 33126<br>Estados Unidos<br>Contacto en Miami: Jairo Restrepo<br>Tel. 305 597 8913</div><div style="margin-top:20px;" >Recomendamos siempre mantener el número de Tracking para cualquier rastreo.</div><div>Lleva tu dirección cuando viajas y no te limites a comprar lo que quieras, recuerda que embarcamos desde un sobre con una carta hasta lo que se te ocurra.</div><div style="margin-top:20px;" ><strong>HORARIOS DE ATENCIÓN</strong></div><div>Lunes a Viernes: 8:00a.m. a 5:00p.m.</div><div>Sábados: 9:00a.m. a 1:00m.d.</div><div><strong>***No abrimos los Domingos***</strong></div>'



					// // window.alert("successfully saved!(default password is 123)")
					// var config = {
					// 	email: this.customerForm.value.email,
					// 	title: "Bienvenido a Anexacargo",
					// 	html: html
					// 	// html : '<div style="margin: auto;"><img style="width: 75px;margin-left: auto;margin-right: auto;" src="https://admin.Anexacargo.com/"><div>Welcome To AExpressPanama</div><div>Your account was created</div><div>Email: '+
					// 	// this.customerForm.value.email + '</div><div>Password: '+this.tempResult.password+'</div></div>'
					// }
					// await this.emailService.sendmail(config).then(async result => {
					// 	console.log(result);
					// 	window.alert("email successfully delivered")
					// }).catch(err => {
					// 	console.log(err);
					// 	window.alert("Unfortunately message did not delivered!");
					// })
					// this.router.navigate(['ecommerce/customers']);
					// this.dialogRef.close({ data: this.customerForm.value, status: 'success', registered: this.tempResult.registered });
				}
			}).catch(error => {
				console.log(error);
				window.alert("Please use another email, someone already used the email!")
			});
		}

	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}
}
