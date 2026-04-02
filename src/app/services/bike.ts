import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bikes`;

  // Demo bikes data
  private demoBikes = [
    { _id: '1', name: 'TVS Apache RTR 160', category: 'Sports', price: 125000, stock: 15, status: 'Available' },
    { _id: '2', name: 'TVS Jupiter', category: 'Scooter', price: 85000, stock: 25, status: 'Available' },
    { _id: '3', name: 'TVS Raider 125', category: 'Commuter', price: 95000, stock: 20, status: 'Available' },
    { _id: '4', name: 'TVS NTorq 125', category: 'Scooter', price: 90000, stock: 18, status: 'Available' },
    { _id: '5', name: 'TVS Apache RR 310', category: 'Sports', price: 285000, stock: 8, status: 'Available' }
  ];

  getBikes(): Observable<any> {
    const isDemoMode = (environment as any).demoMode === true;
    
    if (isDemoMode) {
      console.log('BikeService: Using demo mode');
      return of({ 
        bikes: this.demoBikes,
        total: this.demoBikes.length 
      }).pipe(delay(300));
    }
    
    return this.http.get<any>(this.apiUrl);
  }

  createBike(data: any): Observable<any> {
    const isDemoMode = (environment as any).demoMode === true;
    
    if (isDemoMode) {
      console.log('BikeService: Create bike in demo mode');
      const newBike = {
        _id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString()
      };
      this.demoBikes.push(newBike);
      return of({ bike: newBike, message: 'Bike added successfully' }).pipe(delay(300));
    }
    
    return this.http.post<any>(this.apiUrl, data);
  }

  deleteBike(id: string): Observable<any> {
    const isDemoMode = (environment as any).demoMode === true;
    
    if (isDemoMode) {
      console.log('BikeService: Delete bike in demo mode');
      const index = this.demoBikes.findIndex(b => b._id === id);
      if (index > -1) {
        this.demoBikes.splice(index, 1);
      }
      return of({ message: 'Bike deleted successfully' }).pipe(delay(300));
    }
    
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}