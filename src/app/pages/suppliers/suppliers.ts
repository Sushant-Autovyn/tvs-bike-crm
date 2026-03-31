import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier';

@Component({
  selector: 'app-suppliers',
  imports: [CommonModule, FormsModule],
  templateUrl: './suppliers.html',
  styleUrl: './suppliers.scss',
})
export class Suppliers {
  private supplierService = inject(SupplierService);

  suppliers: any[] = [];

  name = '';
  companyName = '';
  phone = '';
  email = '';
  address = '';
  suppliedBrands = '';

  isLoading = true;
  errorMsg = '';

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.isLoading = true;

    this.supplierService.getSuppliers().subscribe({
      next: (res) => {
        this.suppliers = res.suppliers || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to load suppliers';
        this.isLoading = false;
      }
    });
  }

  createSupplier(): void {
    if (!this.name || !this.companyName || !this.phone) {
      alert('Name, company name and phone are required');
      return;
    }

    const data = {
      name: this.name,
      companyName: this.companyName,
      phone: this.phone,
      email: this.email,
      address: this.address,
      suppliedBrands: this.suppliedBrands
        ? this.suppliedBrands.split(',').map(item => item.trim()).filter(Boolean)
        : []
    };

    this.supplierService.createSupplier(data).subscribe({
      next: () => {
        this.resetForm();
        this.loadSuppliers();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to create supplier');
      }
    });
  }

  deleteSupplier(id: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this supplier?');
    if (!confirmDelete) return;

    this.supplierService.deleteSupplier(id).subscribe({
      next: () => {
        this.loadSuppliers();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to delete supplier');
      }
    });
  }

  resetForm(): void {
    this.name = '';
    this.companyName = '';
    this.phone = '';
    this.email = '';
    this.address = '';
    this.suppliedBrands = '';
  }
}