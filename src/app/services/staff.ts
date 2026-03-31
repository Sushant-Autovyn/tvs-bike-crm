import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/staff';

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