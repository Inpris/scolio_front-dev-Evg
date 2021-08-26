import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function notRequiredEmailValidator(control: AbstractControl): ValidationErrors {
  if (!control.value) {
    return null;
  }
  return Validators.email(control);
}
