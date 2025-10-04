import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { GeneralInputComponent } from 'src/app/shared/components/general-input/general-input.component';
import { SharedTableComponent } from 'src/app/shared/components/shared-table/shared-table.component';
import { OfficesService } from './offices.service';

@Component({
  selector: 'app-offices',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TranslateModule, SharedTableComponent, GeneralInputComponent],
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficesComponent implements OnInit {
  loading = false;
  displayedColumns = [
    { key: 'name', displayName: 'OFFICES.NAME', haveSort: true },
    { key: 'phone', displayName: 'OFFICES.PHONE', haveSort: true },
    { key: 'city', displayName: 'OFFICES.CITY', haveSort: true },
    { key: 'rating', displayName: 'OFFICES.RATING', haveSort: true },
  ];

  data = { data: [] as any[], pagination: { total: 0, page: 0, limit: 10 } };

  constructor(private offices: OfficesService, private cdr: ChangeDetectorRef) {}
  filters: Record<string, string | number> = {};

  ngOnInit(): void { this.loadPage(0); }

  loadPage(page: number) {
    this.loading = true; this.cdr.markForCheck();
    this.offices.getOffices(page, this.data.pagination.limit, this.filters).subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        const rows = list.map((o: any) => ({ _id: o._id, name: o.name, phone: o.phone, city: o.city, rating: o.rating }));
        this.data = { data: rows, pagination: { total: res?.pagination?.total ?? rows.length, page: res?.pagination?.page ?? page, limit: res?.pagination?.limit ?? this.data.pagination.limit } };
        this.loading = false; this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.markForCheck(); }
    });
  }

  onPageChanged = (pageIndex: number) => this.loadPage(pageIndex);
  onRowClick = (row: any) => (window as any).location.assign(`/offices/${row._id}`);
  onCreate = () => (window as any).location.assign('/offices/create');

  onNameFilter(value: string) {
    if (value) { this.filters['name'] = value; } else { delete this.filters['name']; }
    this.data.pagination.page = 0; this.loadPage(0);
  }
}


