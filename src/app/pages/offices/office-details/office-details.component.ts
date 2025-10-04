import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { OfficesService } from '../offices.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-office-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TranslateModule],
  templateUrl: './office-details.component.html',
  styleUrls: ['./office-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeDetailsComponent implements OnInit, OnDestroy {
  id: string | null = null;
  office: any;
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private svc: OfficesService, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.id = params.get('id');
      if (!this.id) { this.loading = false; this.cdr.markForCheck(); return; }
      this.loading = true; this.svc.getOfficeById(this.id)
        .pipe(takeUntil(this.destroy$), finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
        .subscribe({ next: (res) => { this.office = res; this.cdr.detectChanges(); } });
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  onEdit() {
    if (!this.id) return;
    this.router.navigate(['/offices', this.id, 'edit']);
  }

  onDelete() {
    if (!this.id) return;
    this.loading = true;
    this.svc.deleteOffice(this.id)
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({ next: () => { this.router.navigate(['/offices']); }, error: () => {} });
  }
}


