import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuotationService } from '../../services/quotation';
import { CustomerService } from '../../services/customer';
import { BikeService } from '../../services/bike';

@Component({
  selector: 'app-quotations',
  imports: [CommonModule, FormsModule],
  templateUrl: './quotations.html',
  styleUrl: './quotations.scss',
})
export class Quotations {
  private quotationService = inject(QuotationService);
  private customerService = inject(CustomerService);
  private bikeService = inject(BikeService);

  quotations: any[] = [];
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

  loadInitialData(): void {
    this.loadQuotations();
    this.loadCustomers();
    this.loadBikes();
  }

  loadQuotations(): void {
    this.isLoading = true;

    this.quotationService.getQuotations().subscribe({
      next: (res) => {
        this.quotations = res.quotations || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to load quotations';
        this.isLoading = false;
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (res) => {
        this.customers = res.customers || [];
      }
    });
  }

  loadBikes(): void {
    this.bikeService.getBikes().subscribe({
      next: (res) => {
        this.bikes = res.bikes || [];
      }
    });
  }

  createQuotation(): void {
    if (!this.customerId || !this.bikeId || !this.quantity) {
      alert('Please select customer, bike and quantity');
      return;
    }

    const data = {
      customerId: this.customerId,
      bikeId: this.bikeId,
      quantity: this.quantity
    };

    this.quotationService.createQuotation(data).subscribe({
      next: () => {
        this.customerId = '';
        this.bikeId = '';
        this.quantity = 1;
        this.loadQuotations();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to create quotation');
      }
    });
  }

  updateStatus(id: string, status: string): void {
    this.quotationService.updateStatus(id, status).subscribe({
      next: () => {
        this.loadQuotations();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to update quotation status');
      }
    });
  }

  get selectedBike() {
    return this.bikes.find((b) => b._id === this.bikeId);
  }

  get totalAmount(): number {
    const bike = this.selectedBike;
    return bike ? bike.price * this.quantity : 0;
  }
}