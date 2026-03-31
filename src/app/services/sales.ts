import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/sales`;

  getSales() {
    return this.http.get<any>(this.apiUrl);
  }

  createSale(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Temporary test method
  testGetSales() {
    return this.http.get<any>(`${this.apiUrl}/test`);
  }

  // Debug method to count sales
  countSales() {
    return this.http.get<any>(`${this.apiUrl}/count`);
  }

  // Debug endpoint without role restriction
  debugGetSales() {
    return this.http.get<any>(`${this.apiUrl}/debug`);
  }
}