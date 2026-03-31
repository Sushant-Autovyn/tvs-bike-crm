import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private auth = inject(Auth);

  private _mainMenuItems = [
    { label: 'Overview', path: '/dashboard', icon: '▣', roles: ['admin', 'sales-executive', 'service-advisor', 'mechanic', 'accountant'] },
    { label: 'Customers', path: '/customers', icon: '👥', roles: ['admin', 'sales-executive'] },
    { label: 'Leads', path: '/leads', icon: '◎', roles: ['admin', 'sales-executive'] },
    { label: 'Job Cards', path: '/service', icon: '🛠', roles: ['admin', 'service-advisor', 'mechanic'] },
  ];

  private _manageMenuItems = [
    { label: 'Catalog', path: '/bike-catalog', icon: '🚲', roles: ['admin', 'sales-executive'] },
    { label: 'Sales', path: '/sales', icon: '🛒', roles: ['admin', 'sales-executive'] },
    { label: 'Quotations', path: '/quotations', icon: '📄', roles: ['admin', 'sales-executive'] },
    { label: 'Invoices', path: '/payments', icon: '📝', roles: ['admin', 'accountant'] },
    { label: 'Alerts', path: '/notifications', icon: '🔔', roles: ['admin', 'sales-executive', 'service-advisor', 'mechanic', 'accountant'] },
  ];

  private _systemMenuItems = [
    { label: 'Inventory', path: '/inventory', icon: '📦', roles: ['admin', 'sales-executive'] },
    { label: 'Suppliers', path: '/suppliers', icon: '🚚', roles: ['admin', 'sales-executive'] },
    { label: 'Staff', path: '/staff', icon: '🧑‍💼', roles: ['admin'] },
    { label: 'Reports', path: '/reports', icon: '📊', roles: ['admin', 'accountant'] },
  ];

  allMenuItems = [
    ...this._mainMenuItems,
    ...this._manageMenuItems,
    ...this._systemMenuItems,
  ];

  get menuItems() {
    const role = this.auth.getUserRole();
    return this.allMenuItems.filter(item => {
      // If roles array is empty, show to all users
      if (item.roles.length === 0) return true;
      // Otherwise check if user role is included
      return item.roles.includes(role);
    });
  }

  get mainMenuItems() {
    const role = this.auth.getUserRole();
    return this._mainMenuItems.filter(item => item.roles.includes(role));
  }

  get manageMenuItems() {
    const role = this.auth.getUserRole();
    return this._manageMenuItems.filter(item => item.roles.includes(role));
  }

  get systemMenuItems() {
    const role = this.auth.getUserRole();
    return this._systemMenuItems.filter(item => {
      // If roles array is empty, show to all users
      if (item.roles.length === 0) return true;
      // Otherwise check if user role is included
      return item.roles.includes(role);
    });
  }
}