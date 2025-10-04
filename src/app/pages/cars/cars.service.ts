import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarsService {
  private http = inject(HttpClient);

  getCars(page = 0, limit = 10, filters: Record<string, string | number> = {}): Observable<any> {
    const params: Record<string, string> = { page: String(page + 1), limit: String(limit) };
    for (const [k, v] of Object.entries(filters)) if (v !== undefined && v !== null && String(v).length) params[k] = String(v);
    return this.http.get(`${environment.baseUrl}/cars`, { params });
  }

  getCarById(id: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/cars/${id}`);
  }

  createCar(payload: FormData | Record<string, any>): Observable<any> {
    const body = payload instanceof FormData ? payload : this.toFormData(payload);
    return this.http.post(`${environment.baseUrl}/cars`, body);
  }

  updateCar(id: string, payload: FormData | Record<string, any>): Observable<any> {
    const body = payload instanceof FormData ? payload : this.toFormData(payload);
    return this.http.put(`${environment.baseUrl}/cars/${id}`, body);
  }

  deleteCar(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/cars/${id}`);
  }

  private toFormData(obj: Record<string, any>): FormData {
    const fd = new FormData();
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (v instanceof File) { fd.append(k, v); return; }
      if (typeof v === 'object' && !Array.isArray(v)) {
        Object.entries(v).forEach(([k2, v2]) => {
          if (v2 !== undefined && v2 !== null) fd.append(`${k}[${k2}]`, String(v2));
        });
      } else {
        fd.append(k, String(v));
      }
    });
    return fd;
  }
}
