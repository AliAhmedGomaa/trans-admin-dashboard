import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { HttpClientModule } from '@angular/common/http';
import { BookingsService } from './bookings.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

interface BookingRow {
  id: number;
  ref: string;
  customer: string;
  service: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  total: string;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, MatCardModule, SharedTableComponent, HttpClientModule],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsComponent implements OnInit {
  private bookingsService = inject(BookingsService);
  private destroy$ = new Subject<void>();
  loading = false;
  displayedColumns = [
    { key: 'id', displayName: 'ID', haveSort: true },
    { key: 'ref', displayName: 'Ref', haveSort: true },
    { key: 'customer', displayName: 'Customer', haveSort: true },
    { key: 'service', displayName: 'Service', haveSort: true },
    { key: 'date', displayName: 'Date', haveSort: true },
    { key: 'status', displayName: 'Status', haveSort: true },
    { key: 'total', displayName: 'Total', haveSort: true },
  ];

  data = {
    data: [] as BookingRow[],
    pagination: { total: 0, page: 0, limit: 10 },
  };

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loadPage(0);
  }

  loadPage(page: number) {
    this.loading = true;
    this.cdr.markForCheck();
    this.bookingsService
      .getBookings(page, this.data.pagination.limit)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((res: any) => {
      const list = Array.isArray(res) ? res : (res?.data || []);
      const rows: BookingRow[] = list.map((b: any, idx: number) => ({
        id: b.orderNumber ?? (page * this.data.pagination.limit) + idx + 1,
        ref: b.orderNumber ? `BK-${b.orderNumber}` : `BK-${idx + 1}`,
        customer: b.customer?.name ?? 'N/A',
        service: `${b.bookingSummary?.serviceType ?? ''} ${b.bookingSummary?.rentType ?? ''}`.trim(),
        date: b.bookingSummary?.requestedDate ?? (b.createdAt ? new Date(b.createdAt).toISOString().slice(0,10) : 'N/A'),
        status: (b.status ?? 'pending').toString().toLowerCase().includes('confirm') ? 'Confirmed' : (b.status ?? 'Pending'),
        total: typeof b.orderSummary?.totalPrice === 'number' ? `$${b.orderSummary.totalPrice}` : (b.orderSummary?.totalPrice ?? 'N/A'),
      }));
      // Replace the object to trigger change detection, preserving stable reference on arrays is ok
      this.data = {
        data: [...rows],
        pagination: {
          total: res?.pagination?.total ?? rows.length,
          page: res?.pagination?.page ?? page,
          limit: res?.pagination?.limit ?? this.data.pagination.limit,
        },
      };
      this.cdr.detectChanges();
    });

  }

  // Hook paginator
  onPageChanged = (pageIndex: number) => {
    this.loadPage(pageIndex);
  };

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


