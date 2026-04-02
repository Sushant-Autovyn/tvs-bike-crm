import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/staff`;

  getStaff() {
    return this.http.get<any>(this.apiUrl);
  }

  createStaff(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateRole(id: string, role: string) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { role });
  }

  deleteStaff(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}