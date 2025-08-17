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
        this.paginationData = {
          page: p.page ?? 0,
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
}
