import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { storeUserDataSafely } from '../utils/data-filter.util';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private latestBookingSubject = new BehaviorSubject<any | null>(null);

  setLatestBooking(booking: any): void {
    this.latestBookingSubject.next(booking);
    try {
      storeUserDataSafely('latestBooking', booking);
    } catch {
      // ignore storage errors
    }
  }

  getLatestBooking$(): Observable<any | null> {
    return this.latestBookingSubject.asObservable();
  }

  getLatestBookingSnapshot(): any | null {
    const current = this.latestBookingSubject.getValue();
    if (current) return current;
    try {
      const raw = localStorage.getItem('latestBooking');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}


