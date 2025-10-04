import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomTablePagination } from './custom-table-pagination.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-shared-table',
  templateUrl: './shared-table.component.html',
  styleUrls: ['./shared-table.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    RouterLink,
    NgxPaginationModule,
    MatCheckboxModule,
    CustomTablePagination,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTableComponent implements AfterViewInit, OnChanges {
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatTable) table!: MatTable<any>;
  @Input() data!: any | null;
  @Input() havePagination = true;
  identity: TrackByFunction<any> = (_, item: any) => item.id;

  @Input() displayedColumns!: Array<any>;
  columns!: Array<string>;
  @Input() title!: string;
  @Input() hasClickEvent = false;
  @Input() loading = false;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @Output() sortDataEvent = new EventEmitter<any>();

  @Output() itemClicked = new EventEmitter();
  paginationData: any = {
    page: 0, // zero-based for MatPaginator
    total: 0,
    limit: 10,
  };

  total!: number;

  @Output() pageChanged = new EventEmitter<number>();
  @Output() emitSelectedRows = new EventEmitter<any[]>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const incoming = changes['data']?.currentValue;
      // Support either { data, paginationResults } or a plain array
      this.dataSource.data = Array.isArray(incoming) ? incoming : (incoming?.data ?? []);
      // Force table to re-render when data array reference changes asynchronously
      if (this.table) {
        try { this.table.renderRows(); } catch {}
      }
      // Support multiple pagination shapes
      if (incoming?.pagination) {
        const p = incoming.pagination;
        const zeroBasedPage = (typeof p.page === 'number') ? Math.max(0, p.page - 1) : 0;
        this.paginationData = {
          page: zeroBasedPage,
          total: p.total ?? (Array.isArray(this.dataSource.data) ? this.dataSource.data.length : 0),
          limit: p.limit ?? this.paginationData.limit,
        };
      } else if (incoming?.paginationResults) {
        const p = incoming.paginationResults;
        this.paginationData = {
          page: (p.currentPage ?? 1) - 1,
          total: p.total ?? p.numberOfPages ?? (Array.isArray(this.dataSource.data) ? this.dataSource.data.length : 0),
          limit: p.limit ?? this.paginationData.limit,
        };
      }
    }
    this.cdr.detectChanges();

    this.columns = this.displayedColumns.map((col: any) => col['key']);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  sortData(event: any) {
    this.sortDataEvent.emit(event);
  }

  isColumnEmpty(columnKey: string): boolean {
    return this.dataSource.data.every(
      (element: any) => !element[columnKey] || element[columnKey] === 'N/A'
    );
  }

  // -------- Custom paginator helpers (to match Figma) --------
  get totalPages(): number {
    const total = Number(this.paginationData?.total || 0);
    const limit = Number(this.paginationData?.limit || 10);
    return limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1;
  }

  get currentPage1Based(): number {
    return Number(this.paginationData?.page || 0) + 1;
  }

  get pages(): Array<number | string> {
    const total = this.totalPages;
    const current = this.currentPage1Based;
    const out: Array<number | string> = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) out.push(i);
      return out;
    }
    out.push(1);
    if (current > 4) out.push('…');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) out.push(i);
    if (current < total - 3) out.push('…');
    out.push(total);
    return out;
  }

  goToPage(p1: number) {
    if (p1 < 1 || p1 > this.totalPages) return;
    this.pageChanged.emit(p1 - 1);
  }

  nextPage() {
    this.goToPage(this.currentPage1Based + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage1Based - 1);
  }

  onPageSizeChange(val: string | number) {
    const limit = Number(val) || this.paginationData.limit;
    this.paginationData = { ...this.paginationData, limit };
    this.pageChanged.emit(0);
  }

  // Range text (1-based)
  get rangeStart(): number {
    const total = Number(this.paginationData?.total || 0);
    if (total === 0) return 0;
    return Number(this.paginationData?.page || 0) * Number(this.paginationData?.limit || 10) + 1;
  }

  get rangeEnd(): number {
    const total = Number(this.paginationData?.total || 0);
    if (total === 0) return 0;
    const tentative = this.rangeStart + Number(this.paginationData?.limit || 10) - 1;
    return Math.min(total, tentative);
  }
}
