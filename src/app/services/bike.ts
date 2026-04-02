import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bikes`;

  getBikes() {
    return this.http.get<any>(this.apiUrl);
  }

  createBike(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  deleteBike(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}