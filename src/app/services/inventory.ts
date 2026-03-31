import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/inventory`;

  getInventory() {
    return this.http.get<any>(this.apiUrl);
  }

  updateStock(id: string, stock: number) {
    return this.http.put(`${this.apiUrl}/${id}`, { stock });
  }

  getLowStock() {
    return this.http.get<any>(`${this.apiUrl}/low-stock`);
  }
}