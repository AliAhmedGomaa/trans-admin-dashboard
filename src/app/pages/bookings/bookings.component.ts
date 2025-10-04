import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BookingsService } from './bookings.service';
import { OfficesService } from '../offices/offices.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { GeneralDropdownComponent } from "src/app/shared/components/general-dropdown/general-dropdown.component";
import { GeneralInputComponent } from "src/app/shared/components/general-input/general-input.component";
import { ExportToExcellComponent } from "src/app/shared/components/export-to-excell/export-to-excell.component";
import { environment } from 'src/environments/environment';

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
  imports: [CommonModule, MatCardModule, SharedTableComponent, HttpClientModule, TranslateModule, GeneralDropdownComponent, GeneralInputComponent, ExportToExcellComponent],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsComponent implements OnInit, AfterViewInit {
  private bookingsService = inject(BookingsService);
  private destroy$ = new Subject<void>();
  loading = false;
  displayedColumns = [
    { key: 'bookingNumber', displayName: 'TABLE.BOOKING_NO', haveSort: true },
    { key: 'customer', displayName: 'TABLE.CUSTOMER', haveSort: true },
    { key: 'phone', displayName: 'TABLE.PHONE', haveSort: true },
    { key: 'car', displayName: 'TABLE.CAR', haveSort: true },
    { key: 'start', displayName: 'TABLE.START', haveSort: true },
    { key: 'end', displayName: 'TABLE.END', haveSort: true },
    { key: 'status', displayName: 'TABLE.STATUS', haveSort: true },
    { key: 'total', displayName: 'TABLE.TOTAL', haveSort: true },
  ];

  data = {
    data: [] as BookingRow[],
    pagination: { total: 0, page: 0, limit: 10 },
  };

  constructor(private cdr: ChangeDetectorRef, private bookingsServiceInjected: BookingsService, private officesService: OfficesService) {
  }

  ngOnInit(): void {
    this.loadCompanyOptions();
    this.loadPage(0);
  }

  private loadCompanyOptions(): void {
    this.officesService.getOffices(0, 100).subscribe({
      next: (res) => {
        const offices = Array.isArray(res) ? res : (res?.data || []);
        const officeOptions = offices.map((office: any) => ({
          value: office._id,
          viewValue: office.name
        }));
        this.companyOptions = [
          { value: 'all', viewValue: 'FILTERS.ALL_COMPANIES' },
          ...officeOptions
        ];
        this.cdr.detectChanges();
      },
      error: () => {
        // Keep default options on error
      }
    });
  }

  companyOptions: { value: string, viewValue: string }[] = [
    { value: 'all', viewValue: 'FILTERS.ALL_COMPANIES' }
  ];

  statusOptions = [
    { value: 'ALL', viewValue: 'FILTERS.ALL_STATUS' },
    { value: 'PENDING', viewValue: 'FILTERS.PENDING' },
    { value: 'CONFIRMED', viewValue: 'FILTERS.CONFIRMED' },
    { value: 'CANCELLED', viewValue: 'FILTERS.CANCELLED' },
  ];

  private filters: Record<string, string | number> = {};

  onFilterChanged(key: 'status' | 'providerId' | 'search' | 'clientName', value: any) {
    if (key === 'status' && value === 'ALL') {
      delete this.filters['status'];
    } else if (key === 'providerId' && (value === 'all' || value === 'ALL')) {
      delete this.filters['providerId'];
    } else if ((key === 'search' || key === 'clientName') && !value) {
      delete this.filters[key];
    } else {
      this.filters[key] = value;
    }
    // Reset to first page on filter change
    this.data.pagination.page = 0;
    this.loadPage(0);
  }

  export() {
    const params: Record<string, string | number> = {
      ...this.filters,
      page: this.data.pagination.page + 1,
      limit: this.data.pagination.limit,
    };
    this.bookingsServiceInjected.exportBookings(params).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bookings.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  exportUrl = `bookings/export`;
  exportParams(): Record<string, string | number> {
    return {
      ...this.filters,
      page: this.data.pagination.page + 1,
      limit: this.data.pagination.limit,
    };
  }

  @ViewChild('statusTpl') statusTpl!: TemplateRef<any>;

  ngAfterViewInit(): void {
    const idx = this.displayedColumns.findIndex(c => c.key === 'status');
    if (idx > -1) {
      this.displayedColumns[idx] = { ...this.displayedColumns[idx], template: this.statusTpl } as any;
      this.cdr.detectChanges();
    }
  }

  loadPage(page: number) {
    this.loading = true;
    this.cdr.markForCheck();
    this.bookingsService
      .getBookings(page, this.data.pagination.limit, this.filters)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe((res: any) => {
      const list = Array.isArray(res) ? res : (res?.data || []);
      const rows: any[] = list.map((b: any) => ({
        bookingNumber: b.bookingNumber ?? b._id ?? '',
        customer: b.customer?.name ?? 'N/A',
        phone: b.customer?.phone ?? b.phoneNumber ?? 'N/A',
        car: b.car ? `${b.car.brand ?? ''} ${b.car.carModel ?? ''}`.trim() : 'N/A',
        start: b.startTime ? new Date(b.startTime).toLocaleDateString() : 'N/A',
        end: b.endTime ? new Date(b.endTime).toLocaleDateString() : 'N/A',
        status: (b.status ?? 'PENDING'),
        total: typeof b.amountDetails?.totalAmount === 'number' ? `$${b.amountDetails.totalAmount}` : (b.amountDetails?.totalAmount ?? 'N/A'),
        _id: b._id,
      }));
      // Replace the object to trigger change detection, preserving stable reference on arrays is ok
      this.data = {
        data: [...rows],
        pagination: {
          total: res?.pagination?.total ?? rows.length,
          page: (res?.pagination?.page ? Number(res.pagination.page) - 1 : page) || 0,
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

  onRowClick = (row: any) => {
    const id = row._id ?? row.bookingNumber ?? '';
    (window as any).location.assign(`/bookings/${id}`);
  };

  statusLabel(s: any): string {
    const key = String(s || '').toUpperCase();
    const map: Record<string, string> = {
      PENDING: 'قيد المراجعة',
      CONFIRMED: 'تم القبول',
      CANCELLED: 'تم الإلغاء',
    };
    return map[key] || s;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}


