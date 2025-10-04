import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-validation-errors',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './validation-errors.component.html',
  styleUrls: ['./validation-errors.component.scss'],
})
export class ValidationErrorsComponent {
  @Input({ required: true }) isSubmitted = false;
  @Input({ required: true }) errors!: ValidationErrors | null | undefined;
  @Input() mismatchError = false;
  @Input() type!: string;
}
