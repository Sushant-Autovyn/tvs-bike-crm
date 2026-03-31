import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service';
import { CustomerService } from '../../services/customer';
import { BikeService } from '../../services/bike';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-service',
  imports: [CommonModule, FormsModule],
  templateUrl: './service.html',
  styleUrl: './service.scss',
})
export class Service implements OnInit {
  private serviceApi = inject(ServiceService);
  private customerService = inject(CustomerService);
  private bikeService = inject(BikeService);
  private authService = inject(Auth);
  private router = inject(Router);

  services: any[] = [];
  customers: any[] = [];
  bikes: any[] = [];
  
  // Debug info
  debugInfo = {
    isLoggedIn: false,
    hasToken: false,
    userRole: '',
    tokenPreview: ''
  };

  customerId = '';
  bikeId = '';
  issue = '';
  
  isLoading = true;
  errorMsg = '';

  ngOnInit(): void {
    this.checkAuthStatus();
    this.loadData();
  }

  checkAuthStatus(): void {
    this.debugInfo.isLoggedIn = this.authService.isLoggedIn();
    const token = this.authService.getToken();
    this.debugInfo.hasToken = !!token;
    this.debugInfo.userRole = this.authService.getUserRole();
    this.debugInfo.tokenPreview = token ? token.substring(0, 20) + '...' : 'No token';
    
    console.log('🔧 Service - Auth Debug:', this.debugInfo);
  }

  goToLogin(): void {
    console.log('🔄 Navigating to login page');
    this.router.navigate(['/login']);
  }

  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Authentication failed - please login again';
    }
    if (error.status === 403) {
      return 'Access denied - insufficient permissions';
    }
    return error?.error?.message || error?.message || 'Operation failed';
  }

  loadData() {
    this.serviceApi.getServices().subscribe((res: any) => {
      this.services = res.services;
    });

    this.customerService.getCustomers().subscribe((res: any) => {
      this.customers = res.customers;
    });

    this.bikeService.getBikes().subscribe((res: any) => {
      this.bikes = res.bikes;
    });
  }

  createService() {
    this.serviceApi.createService({
      customerId: this.customerId,
      bikeId: this.bikeId,
      issue: this.issue
    }).subscribe(() => {
      this.customerId = '';
      this.bikeId = '';
      this.issue = '';
      this.loadData();
    });
  }

  updateStatus(id: string, status: string) {
    this.serviceApi.updateStatus(id, status).subscribe(() => {
      this.loadData();
    });
  }
}