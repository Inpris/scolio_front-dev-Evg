import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PhoneValidator {
  static checkNumber(control: AbstractControl): ValidationErrors {
    if (!control.value || !control.value.toString().trim()) {
      return { phoneRequired: true };
    }

    const phone = control.value.toString().trim();
    if (!/^\+\d+$/.test(phone)) {
      return { phoneValidity: true };
    }
    return null;
  }

  static validValueOrEmpty(control: AbstractControl): ValidationErrors {
    if (!control.value || !control.value.toString().trim()) {
      return null;
    }
    return PhoneValidator.checkNumber(control);
  }
}
