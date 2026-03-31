import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadService } from '../../services/lead';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-leads',
  imports: [CommonModule, FormsModule],
  templateUrl: './leads.html',
  styleUrl: './leads.scss',
})
export class Leads implements OnInit {
  private leadService = inject(LeadService);
  private authService = inject(Auth);
  private router = inject(Router);

  leads: any[] = [];
  filteredLeads: any[] = [];
  
  // Debug info
  debugInfo = {
    isLoggedIn: false,
    hasToken: false,
    userRole: '',
    tokenPreview: ''
  };

  name = '';
  phone = '';
  email = '';
  interestedBike = '';
  source = 'walk-in';
  notes = '';

  search = '';
  isLoading = true;
  errorMsg = '';

  ngOnInit(): void {
    this.checkAuthStatus();
    this.loadLeads();
  }

  checkAuthStatus(): void {
    this.debugInfo.isLoggedIn = this.authService.isLoggedIn();
    const token = this.authService.getToken();
    this.debugInfo.hasToken = !!token;
    this.debugInfo.userRole = this.authService.getUserRole();
    this.debugInfo.tokenPreview = token ? token.substring(0, 20) + '...' : 'No token';
    
    console.log('🎯 Leads - Auth Debug:', this.debugInfo);
  }

  goToLogin(): void {
    console.log('🔄 Navigating to login page');
    this.router.navigate(['/login']);
  }

  loadLeads(): void {
    this.isLoading = true;

    this.leadService.getLeads().subscribe({
      next: (res) => {
        this.leads = res.leads || [];
        this.filteredLeads = [...this.leads];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to load leads';
        this.isLoading = false;
      }
    });
  }

  createLead(): void {
    if (!this.name || !this.phone) {
      alert('Name and phone are required');
      return;
    }

    const data = {
      name: this.name,
      phone: this.phone,
      email: this.email,
      interestedBike: this.interestedBike,
      source: this.source,
      notes: this.notes
    };

    this.leadService.createLead(data).subscribe({
      next: () => {
        this.resetForm();
        this.loadLeads();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to create lead');
      }
    });
  }

  updateStatus(id: string, status: string): void {
    this.leadService.updateStatus(id, status).subscribe({
      next: () => {
        this.loadLeads();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to update lead status');
      }
    });
  }

  convertToCustomer(id: string): void {
    this.leadService.convertToCustomer(id).subscribe({
      next: () => {
        alert('Lead converted to customer');
        this.loadLeads();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to convert lead');
      }
    });
  }

  filterLeads(): void {
    const value = this.search.toLowerCase();

    this.filteredLeads = this.leads.filter((lead) =>
      lead.name.toLowerCase().includes(value) ||
      lead.phone.includes(value) ||
      (lead.email || '').toLowerCase().includes(value) ||
      (lead.interestedBike || '').toLowerCase().includes(value)
    );
  }

  resetForm(): void {
    this.name = '';
    this.phone = '';
    this.email = '';
    this.interestedBike = '';
    this.source = 'walk-in';
    this.notes = '';
  }
}