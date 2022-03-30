// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
// Auth
import { AuthGuard } from './core/auth';
import { PublicTrackingComponent } from './views/pages/apps/e-commerce/settings/public-tracking/public-tracking.component';

const routes: Routes = [
  {
    path: 'tracking',
    component: PublicTrackingComponent
  },
  { path: 'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: '',
      //   loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule),
      //   pathMatch: 'full'
      // },
      {
        path: 'dashboard',
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      },

      // {
      //   path: 'mail',
      //   loadChildren: () => import('./views/pages/apps/mail/mail.module').then(m => m.MailModule),
      // },
      {
        path: 'ecommerce',
        loadChildren: () => import('./views/pages/apps/e-commerce/e-commerce.module').then(m => m.ECommerceModule),
      },
      {
        path: 'courier',
        loadChildren: () => import('./views/pages/apps/courier/courier.module').then(m => m.CourierModule),
      },
      {
        path: 'orders',
        loadChildren: () => import('./views/pages/apps/customer-orders/customer-orders.module').then(m => m.CustomerOrdersModule),
      },
      {
        path: 'warehouse',
        loadChildren: () => import('./views/pages/apps/warehouses/warehouses.module').then(m => m.WarehousesModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./views/pages/apps/settings/settings.module').then(m => m.SettingsModule),
      },
      // {
      //   path: 'user-management',
      //   loadChildren: () => import('./views/pages/user-management/user-management.module').then(m => m.UserManagementModule),
      // },
      // {
      //   path: 'builder',
      //   loadChildren: () => import('./views/theme/content/builder/builder.module').then(m => m.BuilderModule),
      // },
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'error/403', pathMatch: 'full' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
