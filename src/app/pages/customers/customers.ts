import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer';

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers implements OnInit {
  private customerService = inject(CustomerService);

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];

  name = '';
  phone = '';
  email = '';
  city = '';

  search = '';

  isLoading = true;
  errorMsg = '';

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;

    this.customerService.getCustomers().subscribe({
      next: (res: any) => {
        this.customers = res.customers || [];
        this.filteredCustomers = [...this.customers];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMsg = err?.error?.message || 'Failed to load customers';
        this.isLoading = false;
      }
    });
  }

  addCustomer(): void {
    if (!this.name || !this.phone) {
      alert('Name and phone are required');
      return;
    }

    const data = {
      name: this.name,
      phone: this.phone,
      email: this.email,
      city: this.city
    };

    this.customerService.createCustomer(data).subscribe({
      next: () => {
        this.resetForm();
        this.loadCustomers();
      }
    });
  }

  deleteCustomer(id: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this customer?');

    if (!confirmDelete) return;

    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        alert('Customer deleted successfully!');
        this.loadCustomers();
      },
      error: (error) => {
        console.error('Delete customer error:', error);
        alert('Error deleting customer');
      }
    });
  }

  filterCustomers(): void {
    const value = this.search.toLowerCase();

    this.filteredCustomers = this.customers.filter(c =>
      c.name.toLowerCase().includes(value) ||
      c.phone.includes(value) ||
      (c.email || '').toLowerCase().includes(value)
    );
  }

  resetForm(): void {
    this.name = '';
    this.phone = '';
    this.email = '';
    this.city = '';
  }
}