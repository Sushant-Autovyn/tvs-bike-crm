import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/suppliers`;

  getSuppliers() {
    return this.http.get<any>(this.apiUrl);
  }

  createSupplier(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateSupplier(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteSupplier(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}