import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BookingsService } from '../bookings.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingDetailsComponent implements OnInit, OnDestroy {
  id: string | null = null;
  booking: any;
  loading = true;
  error = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private bookingsSvc: BookingsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.id = params.get('id');
        if (!this.id) {
          this.loading = false;
          this.error = true;
          return;
        }
        this.loading = true;
        this.error = false;
        this.bookingsSvc
          .getBookingById(this.id)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => {
              this.loading = false;
              this.cdr.markForCheck();
            })
          )
          .subscribe({
            next: (res) => {
              this.booking = res;
              this.cdr.detectChanges();
            },
            error: () => {
              this.error = true;
              this.cdr.markForCheck();
            },
          });
      });
  }

  onAccept(): void {
    if (!this.id) return;
    this.loading = true;
    this.cdr.markForCheck();
    this.bookingsSvc
      .acceptBooking(this.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res) => {
          this.booking = { ...this.booking, ...(res || {}), status: 'CONFIRMED' };
          this.cdr.detectChanges();
        },
        error: () => {
          // keep current booking, just stop loading
        },
      });
  }

  onCancel(): void {
    if (!this.id) return;
    this.loading = true;
    this.cdr.markForCheck();
    this.bookingsSvc
      .cancelBooking(this.id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (res) => {
          this.booking = { ...this.booking, ...(res || {}), status: 'CANCELLED' };
          this.cdr.detectChanges();
        },
        error: () => {
          // keep current booking, just stop loading
        },
      });
  }

  statusLabel(status: string | undefined | null): string {
    const key = String(status || '').toUpperCase();
    const map: Record<string, string> = {
      PENDING: 'قيد المراجعة',
      CONFIRMED: 'تم القبول',
      CANCELLED: 'تم الإلغاء',
    };
    return map[key] || key || '';
  }

  statusClass(status: string | undefined | null): string {
    const key = String(status || '').toUpperCase();
    switch (key) {
      case 'PENDING':
        return 'chip-pending';
      case 'CONFIRMED':
        return 'chip-confirmed';
      case 'CANCELLED':
        return 'chip-cancelled';
      default:
        return 'chip-default';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


