import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BikeService } from '../../services/bike';

@Component({
  selector: 'app-bike-catalog',
  imports: [CommonModule, FormsModule],
  templateUrl: './bike-catalog.html',
  styleUrl: './bike-catalog.scss',
})
export class BikeCatalog implements OnInit {
  private bikeService = inject(BikeService);

  bikes: any[] = [];
  filteredBikes: any[] = [];

  brand = '';
  modelName = '';
  category = '';
  price: number | null = null;
  color = '';
  stock: number | null = null;

  search = '';

  isLoading = true;
  errorMsg = '';

  ngOnInit(): void {
    this.loadBikes();
  }

  loadBikes() {
    console.log('🚲 Loading bikes...');
    this.isLoading = true;
    this.errorMsg = '';

    this.bikeService.getBikes().subscribe({
      next: (res) => {
        console.log('✅ Bikes loaded successfully:', res);
        this.bikes = res.bikes || res; // Handle different response formats
        this.filteredBikes = [...this.bikes];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load bikes:', err);
        this.errorMsg = err?.error?.message || 'Failed to load bikes';
        this.isLoading = false;
      }
    });
  }

  addBike() {
    console.log('🚲 Adding new bike...');
    
    if (!this.brand || !this.modelName || !this.category || this.price === null) {
      alert('Brand, model name, category and price are required');
      return;
    }

    const data = {
      brand: this.brand,
      modelName: this.modelName,
      category: this.category,
      price: this.price,
      color: this.color,
      stock: this.stock ?? 0
    };

    console.log('Add Bike - Sending data:', data);

    this.bikeService.createBike(data).subscribe({
      next: (response) => {
        console.log('✅ Bike added successfully:', response);
        alert('Bike added successfully!');
        this.resetForm();
        this.loadBikes();
      },
      error: (error) => {
        console.error('❌ Add bike error:', error);
        const errorMsg = error?.error?.message || 'Failed to add bike';
        alert('Error adding bike: ' + errorMsg);
      }
    });
  }

  deleteBike(id: string) {
    const confirmDelete = confirm('Are you sure you want to delete this bike?');

    if (!confirmDelete) return;

    this.bikeService.deleteBike(id).subscribe({
      next: () => {
        alert('Bike deleted successfully!');
        this.loadBikes();
      },
      error: (error) => {
        console.error('Delete bike error:', error);
        alert('Error deleting bike');
      }
    });
  }

  filterBikes() {
    const value = this.search.toLowerCase();

    this.filteredBikes = this.bikes.filter(b =>
      b.brand.toLowerCase().includes(value) ||
      b.modelName.toLowerCase().includes(value) ||
      b.category.toLowerCase().includes(value)
    );
  }

  resetForm() {
    this.brand = '';
    this.modelName = '';
    this.category = '';
    this.price = null;
    this.color = '';
    this.stock = null;
  }
}