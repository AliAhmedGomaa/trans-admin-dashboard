import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OfficesService } from '../offices.service';
import { GeneralInputComponent } from 'src/app/shared/components/general-input/general-input.component';
declare const google: any;

@Component({
  selector: 'app-office-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    GeneralInputComponent,
    ],
  templateUrl: './office-create.component.html',
  styleUrls: ['./office-create.component.scss']
})

export class OfficeCreateComponent implements AfterViewInit, OnInit {
  form: FormGroup;
  logoFile: File | null = null;
  loading = false;
  isSubmitted = false;
  logoError: string | null = null;
  isDragging = false;

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('modalSearchInput') modalSearchInput!: ElementRef<HTMLInputElement>;
  showLocationModal = false;
  map: any;
  marker: any;
  circle: any;
  tempLat: number | null = null;
  tempLng: number | null = null;
  tempAddress = '';
  tempCity = '';
  editingId: string | null = null;

  constructor(private svc: OfficesService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      englishName: ['', Validators.required],
      manager: ['', Validators.required],
      phone: ['', Validators.required],
      officeNumber: ['', Validators.required],
      commercialRegisterNumber: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      lat: ['', Validators.required],
      lng: ['', Validators.required],
      logo: [null, Validators.required],
      bankingInfo: this.fb.group({
        bankName: ['', Validators.required],
        accountName: ['', Validators.required],
        ibanNumber: ['', Validators.required],
        accountNumber: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.editingId = id;
      if (id) {
        this.loading = true;
        this.svc.getOfficeById(id).subscribe({
          next: (office: any) => {
            this.form.patchValue({
              name: office?.name || '',
              englishName: office?.englishName || '',
              manager: office?.manager || '',
              phone: office?.phone || '',
              officeNumber: office?.officeNumber || '',
              commercialRegisterNumber: office?.commercialRegisterNumber || '',
              address: office?.address || '',
              city: office?.city || '',
              lat: office?.lat || '',
              lng: office?.lng || '',
              bankingInfo: {
                bankName: office?.bankingInfo?.bankName || '',
                accountName: office?.bankingInfo?.accountName || '',
                ibanNumber: office?.bankingInfo?.ibanNumber || '',
                accountNumber: office?.bankingInfo?.accountNumber || '',
              }
            });
            // In edit mode, logo is optional
            const logoCtrl = this.form.get('logo');
            if (logoCtrl) { logoCtrl.clearValidators(); logoCtrl.updateValueAndValidity(); }
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: () => { this.loading = false; }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    (window as any).initPlaces = () => { try { this.initMap(); } catch {} };
    document.addEventListener('maps-loaded', () => { try { this.initMap(); } catch {} });
    // If script was already loaded before this assignment
    try {
      // @ts-ignore
      if (typeof google !== 'undefined' && google.maps) {
        this.initMap();
      }
    } catch {}
  }

  openLocationPicker() {
    this.showLocationModal = true;
    setTimeout(() => this.initMap(), 0);
  }

  closeLocationPicker() {
    this.showLocationModal = false;
  }

  confirmLocation() {
    if (this.tempLat != null && this.tempLng != null) {
      this.form.patchValue({ address: this.tempAddress, city: this.tempCity, lat: this.tempLat, lng: this.tempLng });
    }
    this.closeLocationPicker();
  }

  private async initMap() {
    try {
      if (typeof google === 'undefined' || !google.maps) return;
      if ((google.maps as any).importLibrary) {
        try { await (google.maps as any).importLibrary('places'); } catch {}
      }
      if (!this.mapContainer) return;
      const defaultCenter = { lat: 24.7136, lng: 46.6753 };
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: defaultCenter,
        zoom: 15,
        disableDefaultUI: true,
      });
      this.marker = new google.maps.Marker({ map: this.map, position: defaultCenter, draggable: true });
      this.circle = new google.maps.Circle({ map: this.map, center: defaultCenter, radius: 200, strokeColor: '#4f46e5', strokeWeight: 2, fillColor: '#c7d2fe', fillOpacity: 0.35 });
      this.marker.addListener('dragend', () => {
        const p = this.marker.getPosition();
        if (!p) return;
        this.circle.setCenter(p);
        this.tempLat = p.lat();
        this.tempLng = p.lng();
      });
      // click to replace marker
      this.map.addListener('click', (e: any) => {
        const c = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        this.replaceMarker(c);
        this.reverseGeocode(c.lat, c.lng);
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          this.map.setCenter(c);
          this.marker.setPosition(c);
          this.circle.setCenter(c);
          this.tempLat = c.lat;
          this.tempLng = c.lng;
        });
      }

      if (google.maps.places && google.maps.places.Autocomplete) {
        const autocomplete = new google.maps.places.Autocomplete(this.modalSearchInput.nativeElement, { fields: ['geometry', 'formatted_address', 'address_components'] });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place || !place.geometry || !place.geometry.location) return;
          const loc = place.geometry.location;
          const c = { lat: loc.lat(), lng: loc.lng() };
          this.map.setCenter(c);
          this.marker.setPosition(c);
          this.circle.setCenter(c);
          this.tempLat = c.lat;
          this.tempLng = c.lng;
          this.tempAddress = place.formatted_address || '';
          const cityComponent = (place.address_components || []).find((comp: any) => comp.types.includes('locality'))
            || (place.address_components || []).find((comp: any) => comp.types.includes('administrative_area_level_1'));
          this.tempCity = cityComponent ? cityComponent.long_name : '';
        });
      }
    } catch {}
  }

  private replaceMarker(c: { lat: number; lng: number }) {
    if (this.marker) this.marker.setMap(null);
    this.marker = new google.maps.Marker({ map: this.map, position: c, draggable: true });
    this.circle.setCenter(c);
    this.tempLat = c.lat;
    this.tempLng = c.lng;
    this.marker.addListener('dragend', () => {
      const p = this.marker.getPosition();
      if (!p) return;
      this.circle.setCenter(p);
      this.tempLat = p.lat();
      this.tempLng = p.lng();
      this.reverseGeocode(this.tempLat, this.tempLng);
    });
  }

  private reverseGeocode(lat: number | null, lng: number | null) {
    try {
      if (lat == null || lng == null) return;
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === 'OK' && results && results.length) {
          this.tempAddress = results[0].formatted_address || '';
          const components = results[0].address_components || [];
          const cityComponent = components.find((c: any) => c.types.includes('locality'))
            || components.find((c: any) => c.types.includes('administrative_area_level_1'));
          this.tempCity = cityComponent ? cityComponent.long_name : '';
        }
      });
    } catch {}
  }

  submit() {
    this.isSubmitted = true;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const payload = { ...this.form.value, logo: this.logoFile };
    if (this.editingId) {
      this.svc.updateOffice(this.editingId, payload).subscribe({
        next: () => { this.loading = false; this.router.navigate(['/offices', this.editingId]); },
        error: () => { this.loading = false; }
      });
    } else {
      this.svc.createOffice(payload).subscribe({
        next: () => { this.loading = false; this.router.navigate(['/offices']); },
        error: () => { this.loading = false; }
      });
    }
  }
  goBack() {
    (window as any).history.back();
  }

  onLogoChange(evt: Event) {
    const file = (evt.target as HTMLInputElement).files?.[0] || null;
    this.handleLogoFile(file);
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
    this.handleLogoFile(file);
  }

  private handleLogoFile(file: File | null) {
    this.logoError = null;
    if (!file) { return; }
    const maxSize = 5 * 1024 * 1024;
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(file.type)) {
      this.logoError = 'Only images are allowed (png, jpg, svg, webp)';
      return;
    }
    if (file.size > maxSize) {
      this.logoError = 'Max file size is 5MB';
      return;
    }
    this.logoFile = file;
    this.form.get('logo')?.setValue(file);
    this.form.get('logo')?.markAsDirty();
    this.form.get('logo')?.updateValueAndValidity();
  }
}


