import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarsService } from '../cars.service';
import { OfficesService } from '../../offices/offices.service';
import { GeneralInputComponent } from 'src/app/shared/components/general-input/general-input.component';
import { GeneralDropdownComponent } from 'src/app/shared/components/general-dropdown/general-dropdown.component';

@Component({
  selector: 'app-car-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    GeneralInputComponent,
    GeneralDropdownComponent,
  ],
  templateUrl: './car-create.component.html',
  styleUrls: ['./car-create.component.scss']
})
export class CarCreateComponent implements OnInit {
  form: FormGroup;
  imageFile: File | null = null;
  licenseFile: File | null = null;
  loading = false;
  isSubmitted = false;
  imageError: string | null = null;
  licenseError: string | null = null;
  isDragging = false;
  isDraggingLicense = false;
  editingId: string | null = null;
  offices: any[] = [];

  insuranceOptions = [
    { value: 'BASIC', viewValue: 'CARS.INSURANCE_BASIC' },
    { value: 'FULL', viewValue: 'CARS.INSURANCE_FULL' },
  ];

  constructor(
    private carsService: CarsService,
    private officesService: OfficesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      brand: ['', Validators.required],
      carModel: ['', Validators.required],
      year: ['', Validators.required],
      pricePerDay: ['', Validators.required],
      kmLimit: [200, Validators.required],
      plateNumber: ['', Validators.required],
      office: ['', Validators.required],
      insuranceType: ['', Validators.required],
      deliveryOption: [false],
      freeCancellation: [false],
      licenseExpiryDate: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      image: [null, Validators.required],
      licenseDocument: [null],
    });
  }

  ngOnInit(): void {
    // Load offices for dropdown
    this.officesService.getOffices(0, 100).subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        this.offices = list.map((o: any) => ({ value: o._id, viewValue: o.name }));
        this.cdr.detectChanges();
      }
    });

    // Check if editing
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.editingId = id;
      if (id) {
        this.loading = true;
        this.carsService.getCarById(id).subscribe({
          next: (car: any) => {
            this.form.patchValue({
              brand: car?.brand || '',
              carModel: car?.carModel || '',
              year: car?.year || '',
              pricePerDay: car?.pricePerDay || '',
              kmLimit: car?.kmLimit || 200,
              plateNumber: car?.plateNumber || '',
              office: car?.office?._id || '',
              insuranceType: car?.insuranceType || '',
              deliveryOption: car?.deliveryOption || false,
              freeCancellation: car?.freeCancellation || false,
              licenseExpiryDate: car?.licenseExpiryDate || '',
              licenseNumber: car?.licenseNumber || '',
            });
            // In edit mode, image is optional
            const imageCtrl = this.form.get('image');
            if (imageCtrl) { imageCtrl.clearValidators(); imageCtrl.updateValueAndValidity(); }
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: () => { this.loading = false; }
        });
      }
    });
  }

  submit() {
    this.isSubmitted = true;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const payload = { ...this.form.value, image: this.imageFile, licenseDocument: this.licenseFile };
    
    if (this.editingId) {
      this.carsService.updateCar(this.editingId, payload).subscribe({
        next: () => { this.loading = false; this.router.navigate(['/cars', this.editingId]); },
        error: () => { this.loading = false; }
      });
    } else {
      this.carsService.createCar(payload).subscribe({
        next: () => { this.loading = false; this.router.navigate(['/cars']); },
        error: () => { this.loading = false; }
      });
    }
  }

  goBack() {
    this.router.navigate(['/cars']);
  }

  onImageChange(evt: Event) {
    const file = (evt.target as HTMLInputElement).files?.[0] || null;
    this.handleImageFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files && event.dataTransfer.files.length > 0 ? event.dataTransfer.files[0] : null;
    this.handleImageFile(file);
  }

  private handleImageFile(file: File | null) {
    this.imageError = null;
    if (!file) { return; }
    const maxSize = 5 * 1024 * 1024;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(file.type)) {
      this.imageError = 'Only images are allowed (png, jpg, svg, webp)';
      return;
    }
    if (file.size > maxSize) {
      this.imageError = 'Max file size is 5MB';
      return;
    }
    this.imageFile = file;
    this.form.get('image')?.setValue(file);
    this.form.get('image')?.markAsDirty();
    this.form.get('image')?.updateValueAndValidity();
  }

  onLicenseChange(evt: Event) {
    const file = (evt.target as HTMLInputElement).files?.[0] || null;
    this.handleLicenseFile(file);
  }

  onLicenseDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDraggingLicense = true;
  }

  onLicenseDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDraggingLicense = false;
  }

  onLicenseDrop(event: DragEvent) {
    event.preventDefault();
    this.isDraggingLicense = false;
    const file = event.dataTransfer?.files && event.dataTransfer.files.length > 0 ? event.dataTransfer.files[0] : null;
    this.handleLicenseFile(file);
  }

  private handleLicenseFile(file: File | null) {
    this.licenseError = null;
    if (!file) { return; }
    const maxSize = 5 * 1024 * 1024;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      this.licenseError = 'Only PDF and DOC files are allowed';
      return;
    }
    if (file.size > maxSize) {
      this.licenseError = 'Max file size is 5MB';
      return;
    }
    this.licenseFile = file;
    this.form.get('licenseDocument')?.setValue(file);
    this.form.get('licenseDocument')?.markAsDirty();
    this.form.get('licenseDocument')?.updateValueAndValidity();
  }

  incrementKm() {
    const current = this.form.get('kmLimit')?.value || 0;
    this.form.get('kmLimit')?.setValue(current + 100);
  }

  decrementKm() {
    const current = this.form.get('kmLimit')?.value || 0;
    if (current > 100) {
      this.form.get('kmLimit')?.setValue(current - 100);
    }
  }
}
