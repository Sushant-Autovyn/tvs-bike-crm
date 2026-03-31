import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class Inventory implements OnInit {
  private inventoryService = inject(InventoryService);
  private authService = inject(Auth);
  private router = inject(Router);

  inventory: any[] = [];
  isLoading = true;
  errorMsg = '';
  
  // Debug info
  debugInfo = {
    isLoggedIn: false,
    hasToken: false,
    userRole: '',
    tokenPreview: ''
  };

  ngOnInit(): void {
    this.checkAuthStatus();
    this.loadInventory();
  }

  checkAuthStatus(): void {
    this.debugInfo.isLoggedIn = this.authService.isLoggedIn();
    const token = this.authService.getToken();
    this.debugInfo.hasToken = !!token;
    this.debugInfo.userRole = this.authService.getUserRole();
    this.debugInfo.tokenPreview = token ? token.substring(0, 20) + '...' : 'No token';
    
    console.log('📦 Inventory - Auth Debug:', this.debugInfo);
  }

  goToLogin(): void {
    console.log('🔄 Navigating to login page');
    this.router.navigate(['/login']);
  }

  loadInventory(): void {
    this.inventoryService.getInventory().subscribe(res => {
      this.inventory = res.inventory;
      this.isLoading = false;
    });
  }

  updateStock(bike: any): void {
    this.inventoryService.updateStock(bike._id, bike.stock).subscribe(() => {
      alert('Stock updated');
    });
  }

  isLowStock(bike: any): boolean {
    return bike.stock <= bike.minimumStock;
  }
}