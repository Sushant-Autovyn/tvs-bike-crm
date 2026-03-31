import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/quotations`;

  getQuotations() {
    return this.http.get<any>(this.apiUrl);
  }

  createQuotation(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateStatus(id: string, status: string) {
    return this.http.put(`${this.apiUrl}/${id}`, { status });
  }
}