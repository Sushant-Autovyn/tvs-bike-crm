import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';

interface Customer {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  createdAt?: string;
}

interface CustomerResponse {
  customers: Customer[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customers`;

  // Demo customers data
  private demoCustomers: Customer[] = [
    { _id: '1', name: 'John Doe', phone: '+91-9876543210', email: 'john@example.com', city: 'Mumbai', createdAt: '2024-01-15' },
    { _id: '2', name: 'Jane Smith', phone: '+91-9876543211', email: 'jane@example.com', city: 'Delhi', createdAt: '2024-01-16' },
    { _id: '3', name: 'Raj Kumar', phone: '+91-9876543212', email: 'raj@example.com', city: 'Bangalore', createdAt: '2024-01-17' },
    { _id: '4', name: 'Priya Singh', phone: '+91-9876543213', email: 'priya@example.com', city: 'Chennai', createdAt: '2024-01-18' },
    { _id: '5', name: 'Amit Patel', phone: '+91-9876543214', email: 'amit@example.com', city: 'Pune', createdAt: '2024-01-19' }
  ];

  getCustomers(): Observable<CustomerResponse> {
    // Check if demo mode is enabled
    const isDemoMode = (environment as any).demoMode === true;
    
    if (isDemoMode) {
      console.log('CustomerService: Using demo mode');
      return of({
        customers: this.demoCustomers,
        total: this.demoCustomers.length
      }).pipe(delay(300));
    }
    
    return this.http.get<CustomerResponse>(this.apiUrl);
  }

  createCustomer(customer: Omit<Customer, '_id' | 'createdAt'>): Observable<{ customer: Customer }> {
    const isDemoMode = (environment as any).demoMode === true;
    
    if (isDemoMode) {
      console.log('CustomerService: Create customer in demo mode');
      const newCustomer: Customer = {
        _id: Date.now().toString(),
        ...customer,
        createdAt: new Date().toISOString()
      };
      this.demoCustomers.push(newCustomer);
      return of({ customer: newCustomer }).pipe(delay(300));
    }
    
    return this.http.post<{ customer: Customer }>(this.apiUrl, customer);
  }

  deleteCustomer(id: string): Observable<{ message: string }> {
    const isDemoMode = (environment as any).demoMode === true;
    
    if (isDemoMode) {
      console.log('CustomerService: Delete customer in demo mode');
      const index = this.demoCustomers.findIndex(c => c._id === id);
      if (index > -1) {
        this.demoCustomers.splice(index, 1);
      }
      return of({ message: 'Customer deleted successfully' }).pipe(delay(300));
    }
    
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  updateCustomer(id: string, customer: Partial<Customer>): Observable<{ customer: Customer }> {
    const isDemoMode = (environment as any).demoMode === true;
    
    if (isDemoMode) {
      console.log('CustomerService: Update customer in demo mode');
      const index = this.demoCustomers.findIndex(c => c._id === id);
      if (index > -1) {
        this.demoCustomers[index] = { ...this.demoCustomers[index], ...customer };
        return of({ customer: this.demoCustomers[index] }).pipe(delay(300));
      }
    }
    
    return this.http.put<{ customer: Customer }>(`${this.apiUrl}/${id}`, customer);
  }
}