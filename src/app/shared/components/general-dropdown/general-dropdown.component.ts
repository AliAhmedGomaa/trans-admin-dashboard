import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { GeneralInputsAccessor } from '../../classes/GeneralInputsAccessor';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationErrors, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';

@Component({
  selector: 'app-general-dropdown',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, CommonModule, TranslateModule, ValidationErrorsComponent, FormsModule],
  templateUrl: './general-dropdown.component.html',
  styleUrls: ['./general-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GeneralDropdownComponent),
      multi: true,
    },
  ],
})
export class GeneralDropdownComponent extends GeneralInputsAccessor {
  @Input() options: { value: string, viewValue: string }[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];


  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() isSubmitted = false;
  @Input() errors!: ValidationErrors | null | undefined;
  @Input() hasErrorValidation = true;

  @Output() valueChange = new EventEmitter<string>();

  trackByValue = (_: number, item: { value: string }) => item.value;

}
