// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MailModule } from './apps/mail/mail.module'; 
import { CourierModule } from './apps/courier/courier.module'; 
import { CustomerOrdersModule } from './apps/customer-orders/customer-orders.module'; 



import { ECommerceModule } from './apps/e-commerce/e-commerce.module';
import { UserManagementModule } from './user-management/user-management.module';
import { MyPageComponent } from './my-page/my-page.component';

@NgModule({
  declarations: [MyPageComponent],
  exports: [],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    PartialsModule,
    MailModule,
    CourierModule,
    CustomerOrdersModule,
    ECommerceModule,
    UserManagementModule,
  ],
  providers: []
})
export class PagesModule {
}
