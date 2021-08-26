import { FormArray, FormGroup } from '@angular/forms';

export class FormUtils {
  static changeState(form: FormGroup, isDirty: boolean) {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control instanceof FormGroup) {
        FormUtils.changeState(control, isDirty);
      } else if (control instanceof FormArray) {
        (<FormArray>control).controls.forEach(ctr => FormUtils.changeState(ctr as FormGroup, isDirty));
      } else {
        const changeStateFunc = isDirty ? control.markAsDirty : control.markAsPristine;
        changeStateFunc.call(control);
        control.updateValueAndValidity();
      }
    });
  }

  static markAsDirty(form: FormGroup) {
    FormUtils.changeState(form, true);
  }

  static markAsPristine(form: FormGroup) {
    FormUtils.changeState(form, false);
  }
}
