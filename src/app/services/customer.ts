import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  message: string;
  customers: Customer[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customers`;

  getCustomers(): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(this.apiUrl);
  }

  createCustomer(customer: Omit<Customer, '_id' | 'createdAt'>): Observable<{ message: string; customer: Customer }> {
    return this.http.post<{ message: string; customer: Customer }>(this.apiUrl, customer);
  }

  deleteCustomer(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  updateCustomer(id: string, customer: Partial<Customer>): Observable<{ customer: Customer }> {
    return this.http.put<{ customer: Customer }>(`${this.apiUrl}/${id}`, customer);
  }
}