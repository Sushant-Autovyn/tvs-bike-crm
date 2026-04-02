import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment';
import { SalesService } from '../../services/sales';
import { Auth } from '../../services/auth';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payments',
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.scss',
})
export class Payments {
  private paymentService = inject(PaymentService);
  private salesService = inject(SalesService);
  private authService = inject(Auth);

  payments: any[] = [];
  sales: any[] = [];

  saleId = '';
  amount: number | null = null;
  paymentMethod = 'cash';
  status = 'paid';
  notes = '';

  isLoading = true;
  errorMsg = '';

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.loadPayments();
    this.loadSales();
    this.checkUserRole();
  }

  checkUserRole(): void {
    // Get user info from localStorage or auth service
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Current user role:', payload.role);
        console.log('User info:', payload);
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
  }

  loadPayments(): void {
    this.isLoading = true;

    this.paymentService.getPayments().subscribe({
      next: (res) => {
        this.payments = res.payments || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to load payments';
        this.isLoading = false;
      }
    });
  }

  loadSales(): void {
    console.log('Loading sales...');
    this.salesService.getSales().subscribe({
      next: (res) => {
        console.log('Sales response:', res);
        this.sales = res.sales || [];
        console.log('Sales loaded:', this.sales.length);
      },
      error: (err) => {
        console.error('Error loading sales:', err);
        this.errorMsg = 'Failed to load sales: ' + (err?.error?.message || err.message);
        // Try the debug endpoint if main endpoint fails
        console.log('Trying debug endpoint...');
        this.salesService.debugGetSales().subscribe({
          next: (debugRes) => {
            console.log('Debug sales response:', debugRes);
            this.sales = debugRes.sales || [];
            console.log('Debug sales loaded:', this.sales.length);
            this.errorMsg = ''; // Clear error since debug worked
          },
          error: (debugErr) => {
            console.error('Debug endpoint also failed:', debugErr);
            // Try test endpoint as last resort
            this.salesService.testGetSales().subscribe({
              next: (testRes) => {
                console.log('Test sales response:', testRes);
                this.sales = testRes.sales || [];
                console.log('Test sales loaded:', this.sales.length);
                this.errorMsg = ''; // Clear error since test worked
              },
              error: (testErr) => {
                console.error('All endpoints failed:', testErr);
              }
            });
          }
        });
      }
    });
  }

  createPayment(): void {
    if (!this.saleId || this.amount === null) {
      alert('Sale and amount are required');
      return;
    }

    const data = {
      saleId: this.saleId,
      amount: this.amount,
      paymentMethod: this.paymentMethod,
      status: this.status,
      notes: this.notes
    };

    this.paymentService.createPayment(data).subscribe({
      next: () => {
        console.log('✅ Payment created successfully');
        alert('Payment recorded successfully!');
        this.resetForm();
        this.loadPayments();
      },
      error: (err) => {
        console.error('❌ Create payment error:', err);
        alert(err?.error?.message || 'Failed to create payment');
      }
    });
  }

  get selectedSale() {
    return this.sales.find((sale) => sale._id === this.saleId);
  }

  autofillAmount(): void {
    const sale = this.selectedSale;
    if (sale) {
      this.amount = sale.totalAmount;
    }
  }

  resetForm(): void {
    this.saleId = '';
    this.amount = null;
    this.paymentMethod = 'cash';
    this.status = 'paid';
    this.notes = '';
  }

  // PDF Generation Method
  generateInvoicePDF(payment: any): void {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('BIKE CRM INVOICE', 20, 25);
    
    // Invoice Details Box
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, 35, 170, 45);
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Invoice ID: INV-${payment._id.slice(-8).toUpperCase()}`, 25, 45);
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString('en-IN')}`, 25, 55);
    doc.text(`Customer: ${payment.customerId?.name || 'N/A'}`, 25, 65);
    doc.text(`Payment Method: ${payment.paymentMethod.toUpperCase()}`, 25, 75);
    
    // Customer Details Section
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('CUSTOMER DETAILS', 20, 95);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${payment.customerId?.name || 'N/A'}`, 20, 110);
    doc.text(`Email: ${payment.customerId?.email || 'N/A'}`, 20, 120);
    doc.text(`Phone: ${payment.customerId?.phone || 'N/A'}`, 20, 130);
    
    // Payment Details Table
    autoTable(doc, {
      startY: 145,
      head: [['Description', 'Payment Method', 'Amount', 'Status']],
      body: [
        [
          'Bike Purchase Payment',
          payment.paymentMethod.toUpperCase(),
          `₹${payment.amount.toLocaleString('en-IN')}`,
          payment.status.toUpperCase()
        ]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: 60
      }
    });
    
    // Total Section
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(1);
    doc.line(20, finalY, 190, finalY);
    
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text(`TOTAL AMOUNT: ₹${payment.amount.toLocaleString('en-IN')}`, 20, finalY + 15);
    
    // Payment Status
    doc.setFontSize(12);
    const statusColor = payment.status === 'paid' ? [39, 174, 96] : 
                       payment.status === 'pending' ? [241, 196, 15] : [231, 76, 60];
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(`Payment Status: ${payment.status.toUpperCase()}`, 20, finalY + 30);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text('Generated by Bike CRM System', 20, finalY + 50);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 20, finalY + 60);
    
    // Save PDF
    doc.save(`invoice-${payment._id.slice(-6)}-${payment.customerId?.name?.replace(/\s+/g, '_') || 'customer'}.pdf`);
  }

  // Alternative: Server-side PDF generation
  generateServerPDF(payment: any): void {
    this.paymentService.generateServerPDF(payment._id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${payment._id.slice(-6)}-${payment.customerId?.name?.replace(/\s+/g, '_') || 'customer'}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to generate PDF');
      }
    });
  }

  // Debug method to test database
  testDatabase(): void {
    console.log('Testing database connection and sales count...');
    this.salesService.countSales().subscribe({
      next: (res) => {
        console.log('Sales count response:', res);
        alert(`Database contains ${res.count} sales records`);
      },
      error: (err) => {
        console.error('Count endpoint failed:', err);
        alert('Database test failed: ' + (err?.error?.message || err.message));
      }
    });
  }

  // Clear tokens and retry
  clearTokensAndRetry(): void {
    this.authService.clearTokens();
    alert('Tokens cleared. Please refresh the page and login again.');
    window.location.reload();
  }
}
