import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateUtils } from '@common/utils/date';

export class BirthDayValidator {
  static required(control: AbstractControl): ValidationErrors {
    if (!control.value || DateUtils.toISODateTimeString(control.value) === '2001-01-01T00:40:00') {
      return { required: true };
    }
    return null;
  }
}
