import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Customers } from './pages/customers/customers';
import { Leads } from './pages/leads/leads';
import { BikeCatalog } from './pages/bike-catalog/bike-catalog';
import { Sales } from './pages/sales/sales';
import { Service } from './pages/service/service';
import { Inventory } from './pages/inventory/inventory';
import { Suppliers } from './pages/suppliers/suppliers';
import { Payments } from './pages/payments/payments';
import { Staff } from './pages/staff/staff';
import { Notifications } from './pages/notifications/notifications';
import { Reports } from './pages/reports/reports';
import { Login } from './pages/login/login';
import { Quotations } from './pages/quotations/quotations';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'customers', component: Customers },
      { path: 'leads', component: Leads },
      { path: 'bike-catalog', component: BikeCatalog },
      { path: 'sales', component: Sales },
      { path: 'service', component: Service },
      { path: 'inventory', component: Inventory },
      { path: 'suppliers', component: Suppliers },
      { path: 'payments', component: Payments },
      { path: 'staff', component: Staff },
      { path: 'notifications', component: Notifications },
      { path: 'reports', component: Reports },
      { path: 'quotations', component: Quotations },
    ]
  },

  { path: '**', redirectTo: 'login' }
];