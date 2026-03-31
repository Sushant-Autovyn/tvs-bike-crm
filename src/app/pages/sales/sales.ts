import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales';
import { CustomerService } from '../../services/customer';
import { BikeService } from '../../services/bike';

@Component({
  selector: 'app-sales',
  imports: [CommonModule, FormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
})
export class Sales implements OnInit {
  private salesService = inject(SalesService);
  private customerService = inject(CustomerService);
  private bikeService = inject(BikeService);

  sales: any[] = [];
  customers: any[] = [];
  bikes: any[] = [];

  customerId = '';
  bikeId = '';
  quantity = 1;

  isLoading = true;
  errorMsg = '';

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.loadSales();
    this.loadCustomers();
    this.loadBikes();
  }

  loadSales() {
    this.salesService.getSales().subscribe({
      next: (res) => {
        this.sales = res.sales || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to load sales';
        this.isLoading = false;
      }
    });
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (res) => {
        this.customers = res.customers || [];
      }
    });
  }

  loadBikes() {
    this.bikeService.getBikes().subscribe({
      next: (res) => {
        this.bikes = res.bikes || [];
      }
    });
  }

  createSale() {
    if (!this.customerId || !this.bikeId || !this.quantity) {
      alert('Please select customer, bike and quantity');
      return;
    }

    const data = {
      customerId: this.customerId,
      bikeId: this.bikeId,
      quantity: this.quantity
    };

    this.salesService.createSale(data).subscribe({
      next: () => {
        this.customerId = '';
        this.bikeId = '';
        this.quantity = 1;
        this.loadSales();
        this.loadBikes();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to create sale');
      }
    });
  }

  get selectedBike() {
    return this.bikes.find(b => b._id === this.bikeId);
  }

  get totalAmount() {
    const bike = this.selectedBike;
    return bike ? bike.price * this.quantity : 0;
  }
}