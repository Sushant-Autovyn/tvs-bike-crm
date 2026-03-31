import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/leads`;

  getLeads() {
    return this.http.get<any>(this.apiUrl);
  }

  createLead(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateStatus(id: string, status: string) {
    return this.http.put<any>(`${this.apiUrl}/${id}/status`, { status });
  }

  convertToCustomer(id: string) {
    return this.http.post<any>(`${this.apiUrl}/${id}/convert`, {});
  }
}