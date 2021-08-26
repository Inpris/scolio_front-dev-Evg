import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phoneCustomValid(control: AbstractControl): ValidationErrors {
  const phone = control;
  if (!control.parent) { return null; }
  const email = control.parent.get('email');
  if (!(email.value || phone.value)) {
    return { emailOrPhone: true };
  }
  return null;
}
