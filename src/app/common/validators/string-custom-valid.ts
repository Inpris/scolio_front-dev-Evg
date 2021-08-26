import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export class StringCustomValidators {
  static required(control: AbstractControl): ValidationErrors {
    if (!control.value || typeof control.value === 'string' && !control.value.trim()) {
      return { required: true };
    }
    return null;
  }
}
