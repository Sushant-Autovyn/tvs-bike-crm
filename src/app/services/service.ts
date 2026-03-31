import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/services`;

  getServices() {
    return this.http.get<any>(this.apiUrl);
  }

  createService(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateStatus(id: string, status: string) {
    return this.http.put(`${this.apiUrl}/${id}`, { status });
  }
}