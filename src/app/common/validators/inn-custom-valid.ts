import { AbstractControl, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';

export class InnCustomValidator {
  static required(control: AbstractControl): ValidationErrors {
    if (!control.value || !/^(\d{10}|\d{12})$/.test(control.value)) {
      return { required: true };
    }
    return null;
  }
}
