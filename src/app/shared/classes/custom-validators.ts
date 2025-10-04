import { HttpClient } from '@angular/common/http';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Observable, catchError, debounceTime, map, of, switchMap } from 'rxjs';
import { EmployeeManagementService } from 'src/app/pages/employee-management/services/employee-management.service';
import { JobManagementService } from 'src/app/pages/job-management/services/job-management.service';

export class CustomValidators {
  constructor(
    private http: HttpClient,
    private _employeeManagementService: EmployeeManagementService
  ) {}
  static hybridWorkDayValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const isChecked = group.get('isChecked')?.value;
      const isOnsite = group.get('isOnsite')?.value;
      const isOnline = group.get('isOnline')?.value;

      if (isChecked && !isOnsite && !isOnline) {
        return { requiredOne: true };
      }
      return null;
    };
  }

  static minSelectedCheckboxes(min = 1): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const totalChecked = formArray.controls
        .map((control) => control.value.isChecked)
        .reduce((prev, next) => (next ? prev + next : prev), 0);

      return totalChecked >= min ? null : { required: true };
    };
  }

  static minAgeValidator(minAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // return null if no date is entered
      }
      const today = new Date();
      const birthDate = new Date(control.value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= minAge ? null : { minAge: true };
    };
  }

  static uniqueMatricNameValidator(formArray: FormArray): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const name = control.value;
      const names = formArray?.controls?.map(
        (group) => group?.get('name')?.value
      );

      if (formArray?.controls?.length == 0) return null;
      const isDuplicate = names.filter((n) => n === name).length > 1;
      return isDuplicate ? { matricNameNotUnique: true } : null;
    };
  }

  static totalWeightValidator(formArray: FormArray): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentWeight = parseFloat(control.value) || 0;
      const totalWeight =
        formArray.controls
          .filter((group) => group !== control.parent)
          .map((group) => {
            const value = group?.get('weight')?.value;
            if (!value) return 0;
            const weight = parseFloat(value) || 0;
            return weight;
          })
          .reduce((acc, weight) => acc + weight, 0) + currentWeight;

      if (formArray.controls.length === 0) return null;

      return totalWeight > 100 ? { totalWeightExceeded: true } : null;
    };
  }

  static atLeastOneKpiValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const formArrayControl = formArray as FormArray;

      const hasAtLeastOne =
        formArrayControl.length > 0 && formArrayControl.at(0).valid;

      return hasAtLeastOne ? null : { atLeastOneKpi: true };
    };
  }

  static validateUniqueValidator(
    _employeeManagementService: EmployeeManagementService,
    controlName: string,
    formGroupname: string = 'employee_details'
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      const formData = new FormData();
      formData.append(`${formGroupname}[${controlName}]`, control.value);

      return of(null).pipe(
        debounceTime(400),
        switchMap(() =>
          _employeeManagementService.addEmployee(formData).pipe(
            map(() => null),
            catchError(({ error }) => {
              const prop = `${formGroupname}.${controlName}`;
              if (error.message && error.message[prop]) {
                return error.message[prop][0].includes('has already been taken')
                  ? of({ isNotUnique: true })
                  : of(null);
              }
              return of(null);
            })
          )
        )
      );
    };
  }

  static validateUniqueValidatorOnEdit(
    id: string,
    _employeeManagementService: EmployeeManagementService,
    controlName: string,
    formGroupname: string = 'employee_details'
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      const formData = new FormData();
      formData.append(`${formGroupname}[${controlName}]`, control.value);

      return of(null).pipe(
        debounceTime(400),
        switchMap(() =>
          _employeeManagementService.editEmployee(formData, id).pipe(
            map(() => null),
            catchError(({ error }) => {
              const prop = `${formGroupname}.${controlName}`;
              if (error.message && error.message[prop]) {
                return error.message[prop][0].includes('has already been taken')
                  ? of({ isNotUnique: true })
                  : of(null);
              }
              return of(null);
            })
          )
        )
      );
    };
  }

  static validateJobUniqueValidator(
    _jobManagementService: JobManagementService,
    controlName: string,
    jobId: string,
    formGroupname: string = 'job_information'
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      const payload = {
        [formGroupname]: {
          [controlName]: control.value,
        },
      };
      if (jobId) {
        return of(null).pipe(
          debounceTime(400),
          switchMap(() =>
            _jobManagementService.updateJob(jobId, payload).pipe(
              map(() => null),
              catchError(({ error }) => {
                const prop = `${formGroupname}.${controlName}`;
                if (error.message && error.message[prop]) {
                  return error.message[prop][0].includes(
                    'has already been taken'
                  )
                    ? of({ isNotUnique: true })
                    : of(null);
                }
                return of(null);
              })
            )
          )
        );
      }
      return of(null).pipe(
        debounceTime(400),
        switchMap(() =>
          _jobManagementService.addJob(payload).pipe(
            map(() => null),
            catchError(({ error }) => {
              const prop = `${formGroupname}.${controlName}`;
              if (error.message && error.message[prop]) {
                return error.message[prop][0].includes('has already been taken')
                  ? of({ isNotUnique: true })
                  : of(null);
              }
              return of(null);
            })
          )
        )
      );
    };
  }
}
