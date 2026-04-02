import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getStats(): Observable<any> {
    const isDemoMode = (environment as any).demoMode === true;
    
    if (isDemoMode) {
      console.log('DashboardService: Using demo mode');
      const demoStats = {
        totalCustomers: 145,
        totalBikes: 67,
        totalSales: 28,
        totalRevenue: 8750000,
        recentSales: [
          { id: 1, customer: 'John Doe', bike: 'TVS Apache RTR 160', amount: 125000, date: '2024-04-01' },
          { id: 2, customer: 'Jane Smith', bike: 'TVS Jupiter', amount: 85000, date: '2024-04-01' },
          { id: 3, customer: 'Raj Kumar', bike: 'TVS NTorq 125', amount: 90000, date: '2024-03-31' }
        ],
        monthlyRevenue: [
          { month: 'Jan', revenue: 2100000 },
          { month: 'Feb', revenue: 1800000 },
          { month: 'Mar', revenue: 2300000 },
          { month: 'Apr', revenue: 2550000 }
        ]
      };
      return of(demoStats).pipe(delay(300));
    }
    
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}