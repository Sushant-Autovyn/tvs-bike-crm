import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notifications`;

  getNotifications() {
    return this.http.get<any>(this.apiUrl);
  }

  markAsRead(id: string) {
    return this.http.put(`${this.apiUrl}/${id}`, {});
  }
}