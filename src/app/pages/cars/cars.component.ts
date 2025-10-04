import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableComponent } from 'src/app/shared/components/shared-table/shared-table.component';
import { GeneralInputComponent } from 'src/app/shared/components/general-input/general-input.component';
import { CarsService } from './cars.service';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TranslateModule, SharedTableComponent, GeneralInputComponent],
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarsComponent implements OnInit {
  loading = false;
  displayedColumns = [
    { key: 'brand', displayName: 'CARS.BRAND', haveSort: true },
    { key: 'carModel', displayName: 'CARS.MODEL', haveSort: true },
    { key: 'year', displayName: 'CARS.YEAR', haveSort: true },
    { key: 'pricePerDay', displayName: 'CARS.PRICE_PER_DAY', haveSort: true },
    { key: 'office', displayName: 'CARS.OFFICE', haveSort: false },
  ];

  data = { data: [] as any[], pagination: { total: 0, page: 0, limit: 10 } };
  filters: Record<string, string | number> = {};

  constructor(private carsService: CarsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.loadPage(0); }

  loadPage(page: number) {
    this.loading = true; this.cdr.markForCheck();
    this.carsService.getCars(page, this.data.pagination.limit, this.filters).subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        const rows = list.map((c: any) => ({
          _id: c._id,
          brand: c.brand,
          carModel: c.carModel,
          year: c.year,
          pricePerDay: c.pricePerDay,
          office: c.office?.name || '—'
        }));
        this.data = {
          data: rows,
          pagination: {
            total: res?.pagination?.total ?? rows.length,
            page: res?.pagination?.page ?? page,
            limit: res?.pagination?.limit ?? this.data.pagination.limit
          }
        };
        this.loading = false; this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  onPageChanged = (pageIndex: number) => this.loadPage(pageIndex);
  onRowClick = (row: any) => (window as any).location.assign(`/cars/${row._id}`);
  onCreate = () => (window as any).location.assign('/cars/create');

  onBrandFilter(value: string) {
    if (value) { this.filters['brand'] = value; } else { delete this.filters['brand']; }
    this.data.pagination.page = 0; this.loadPage(0);
  }
}
