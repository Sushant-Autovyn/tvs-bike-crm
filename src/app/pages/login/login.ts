import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  errorMsg = '';
  isLoading = false;

  private auth = inject(Auth);
  private router = inject(Router);

  login(): void {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter email and password';
      return;
    }

    console.log('Login attempt started');
    console.log('Email:', this.email);
    console.log('Password length:', this.password.length);
    this.errorMsg = '';
    this.isLoading = true;

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        console.log('Navigating to dashboard...');
        this.router.navigate(['/dashboard']).then(
          (success) => console.log('Navigation result:', success),
          (error) => console.error('Navigation error:', error)
        );
      },
      error: (error: any) => {
        console.error('Login error:', error);
        this.isLoading = false;
        this.errorMsg = error?.error?.message || error?.message || 'Login failed. Please try again.';
      },
      complete: () => {
        console.log('Login observable completed');
      }
    });
  }
}