import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);

  getBookings(page = 0, limit = 10): Observable<any> {
    return this.http.get(`${environment.baseUrl}/bookings`, {
      params: { page: String(page), limit: String(limit) },
    });
  }
}


