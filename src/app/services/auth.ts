import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(data: { email: string; password: string }): Observable<any> {
    console.log('Attempting login to:', this.apiUrl);
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        console.log('Auth response:', response);
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user || {}));
        }
      })
    );
  }

  private demoLogin(data: { email: string; password: string }): Observable<any> {
    console.log('DemoLogin called with:', data);
    // Demo credentials - accept any email/password for demo
    const demoResponse = {
      success: true,
      token: 'demo-token-' + Date.now(),
      user: {
        id: 1,
        email: data.email,
        name: 'Demo User',
        role: 'admin'
      }
    };
    
    console.log('Demo response:', demoResponse);
    
    // Store demo data
    localStorage.setItem('token', demoResponse.token);
    localStorage.setItem('user', JSON.stringify(demoResponse.user));
    
    console.log('Demo data stored in localStorage');
    
    // Return observable with small delay to simulate network request
    return of(demoResponse).pipe(delay(500));
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