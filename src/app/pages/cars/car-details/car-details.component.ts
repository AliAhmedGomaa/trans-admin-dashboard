import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CarsService } from '../cars.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TranslateModule],
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarDetailsComponent implements OnInit, OnDestroy {
  id: string | null = null;
  car: any;
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private carsService: CarsService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.id = params.get('id');
      if (!this.id) { this.loading = false; this.cdr.markForCheck(); return; }
      this.loading = true;
      this.carsService.getCarById(this.id)
        .pipe(takeUntil(this.destroy$), finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
        .subscribe({
          next: (res) => { this.car = res; this.cdr.detectChanges(); }
        });
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  onEdit() {
    if (!this.id) return;
    this.router.navigate(['/cars', this.id, 'edit']);
  }

  onDelete() {
    if (!this.id) return;
    this.loading = true;
    this.carsService.deleteCar(this.id)
      .pipe(finalize(() => { this.loading = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: () => { this.router.navigate(['/cars']); },
        error: () => {}
      });
  }
}
