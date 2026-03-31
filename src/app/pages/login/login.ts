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

    this.errorMsg = '';
    this.isLoading = true;

    this.auth.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMsg = error?.error?.message || 'Login failed';
      }
    });
  }
}