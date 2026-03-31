import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../services/staff';

@Component({
  selector: 'app-staff',
  imports: [CommonModule, FormsModule],
  templateUrl: './staff.html',
  styleUrl: './staff.scss',
})
export class Staff {
  private staffService = inject(StaffService);

  staff: any[] = [];

  name = '';
  email = '';
  password = '';
  role = 'sales-executive';

  isLoading = true;
  errorMsg = '';

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.isLoading = true;

    this.staffService.getStaff().subscribe({
      next: (res) => {
        this.staff = res.staff || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to load staff';
        this.isLoading = false;
      }
    });
  }

  createStaff(): void {
    if (!this.name || !this.email || !this.password || !this.role) {
      alert('All fields are required');
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.staffService.createStaff(data).subscribe({
      next: () => {
        this.name = '';
        this.email = '';
        this.password = '';
        this.role = 'sales-executive';
        this.loadStaff();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to create staff');
      }
    });
  }

  updateRole(id: string, role: string): void {
    this.staffService.updateRole(id, role).subscribe({
      next: () => {
        this.loadStaff();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to update role');
      }
    });
  }

  deleteStaff(id: string): void {
    const confirmDelete = confirm('Are you sure you want to delete this staff member?');

    if (!confirmDelete) return;

    this.staffService.deleteStaff(id).subscribe({
      next: () => {
        this.loadStaff();
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to delete staff');
      }
    });
  }
}