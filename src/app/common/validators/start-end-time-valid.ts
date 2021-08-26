import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export function startDateCustomValid(control: AbstractControl): ValidationErrors {
  if (!control) {
    return { start: true };
  }
  const startDate = control.value;
  if (!control.parent) { return null; }
  const endDate = control.parent.get('end').value;
  if (startDate && endDate && (startDate > endDate)) {
    return { start: true };
  }
  return null;
}

export function endDateCustomValid(control: AbstractControl): ValidationErrors {
  if (!control) {
    return null;
  }
  const endDate = control.value;
  if (!control.parent) { return null; }
  const startDate = control.parent.get('start').value;
  if (endDate && (startDate > endDate)) {
    return { end: true };
  }
  return null;
}

