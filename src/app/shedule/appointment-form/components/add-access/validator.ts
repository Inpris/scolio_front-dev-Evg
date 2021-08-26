import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

export const confirmAccessValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
  if (group && group.controls) {
    const codeValue: AbstractControl = group.get('codeValue');
    const linkToFile: AbstractControl = group.get('linkToFile');

    return codeValue.invalid || linkToFile.invalid ? { error: 'Для подтверждения доступа необходимо заполнить все поля.' } : null;
  }

  return null;
};
