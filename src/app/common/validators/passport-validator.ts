import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PassportValidator {
  static required(group: AbstractControl): ValidationErrors {
    const passport = group.value;
    if (!passport.serialNumber && !passport.issueDate && !passport.issueBy) {
      return null;
    }
    if (!passport.serialNumber || !passport.issueDate || !passport.issueBy) {
      return { required: true };
    }
    return null;
  }
}
