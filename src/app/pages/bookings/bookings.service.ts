import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);

  getBookings(
    page = 0,
    limit = 10,
    filters: Record<string, string | number> = {}
  ): Observable<any> {
    const params: Record<string, string> = {
      page: String(page + 1),
      limit: String(limit),
    };
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== null && String(v).length > 0) {
        params[k] = String(v);
      }
    }
    return this.http.get(`${environment.baseUrl}/bookings`, { params });
  }

  getBookingById(id: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/bookings/${id}`);
  }

  acceptBooking(id: string): Observable<any> {
    return this.http.patch(`${environment.baseUrl}/bookings/${id}/accept`, {});
  }

  cancelBooking(id: string): Observable<any> {
    return this.http.patch(`${environment.baseUrl}/bookings/${id}/cancel`, {});
  }

  exportBookings(params: Record<string, string | number> = {}): Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/bookings/export`, {
      params: { ...params },
      responseType: 'blob' as unknown as 'json'
    }) as unknown as Observable<Blob>;
  }
}


