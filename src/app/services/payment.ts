import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  getPayments() {
    return this.http.get<any>(this.apiUrl);
  }

  createPayment(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  generateServerPDF(paymentId: string) {
    return this.http.get(`${this.apiUrl}/pdf/${paymentId}`, { responseType: 'blob' });
  }
}
