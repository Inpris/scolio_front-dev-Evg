import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function emailCustomValid(control: AbstractControl): ValidationErrors {
  const email = control;
  if (!control.parent) { return null; }
  const phone = control.parent.get('phone');
  if (!(email.value || phone.value)) {
    return { emailOrPhone: true };
  }

  if (email.value) {
    return Validators.email(email);
  }
  return null;
}
