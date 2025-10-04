import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-export-to-excell',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './export-to-excell.component.html',
  styleUrls: ['./export-to-excell.component.scss']
})
export class ExportToExcellComponent {
  @Input() url!: string; // full endpoint URL
  @Input() params: Record<string, string | number> = {};
  @Input() textKey = 'BOOKINGS.EXPORT';
  @Input() disabled = false;

  loading = false;

  constructor(private http: HttpClient) {}

  export(): void {
    this.url = `${environment.baseUrl}/${this.url}`;
    if (!this.url || this.loading) return;
    this.loading = true;
    this.http
      .get(this.url, {
        params: { ...this.params } as any,
        responseType: 'blob' as unknown as 'json',
      })
      .subscribe({
        next: (blob: any) => {
          const file = blob as Blob;
          const objectUrl = URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = objectUrl;
          a.download = 'bookings.xlsx';
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(objectUrl);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}


