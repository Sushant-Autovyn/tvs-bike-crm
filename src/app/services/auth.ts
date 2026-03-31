import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user || {}));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Utility method to clear invalid tokens
  clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Tokens cleared - please login again');
  }

  getToken(): string | null {
    let token = localStorage.getItem('token');
    if (!token) {
      // Set default token for demo purposes
      token = 'demo-token-' + Date.now();
      localStorage.setItem('token', token);
    }
    return token;
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    } else {
      // Set default user for demo purposes
      const defaultUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@bikecrm.com',
        role: 'admin'
      };
      this.setUser(defaultUser);
      return defaultUser;
    }
  }

  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user || {}));
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string {
    const user = this.getUser();
    return user?.role || 'admin'; // Default to admin role for demo purposes
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`).pipe(
      tap((response) => {
        if (response?.user) {
          this.setUser(response.user);
        }
      })
    );
  }
}