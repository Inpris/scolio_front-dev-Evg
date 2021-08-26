import { ControlValueAccessor, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { FormUtils } from '@common/utils/form';
import { forwardRef, OnInit } from '@angular/core';
import { isEquals } from '@common/utils/object';

export abstract class FormValueAccessor implements ControlValueAccessor, Validator, OnInit {
  public form: FormGroup;
  public disabled = false;

  static getAccessorProviders(componentClass) {
    return [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => componentClass),
        multi: true,
      },
      {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => componentClass),
        multi: true,
      }];
  }

  abstract markForCheck();

  protected onChange = value => void 0;
  protected onTouched = () => void 0;
  protected onValidatorChanged = () => void 0;

  public ngOnInit() {
    this.form.statusChanges.subscribe(() => {
      this.onValidatorChanged();
    });
    this.form.valueChanges
      .distinctUntilChanged(
        isEquals,
      )
      .subscribe(() => {
        this.onValidatorChanged();
        this.onTouched();
        this.onChange(this.form.value);
      });
  }

  public registerOnChange(fn) {
    this.onChange = fn;
  }

  public registerOnTouched(fn) {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }

  public writeValue(obj) {
    this.form.patchValue(
      obj ?
        obj : {
          ...Object.keys(this.form.controls)
            .reduce((form, key) => Object.assign(form, { [key]: null }), {}),
        },
    );
    this.markForCheck();
  }


  public registerOnValidatorChange(fn) {
    this.onValidatorChanged = fn;
  }

  public validate() {
    return this.form.valid ? null : {
      valid: false,
    };
  }

  public markAsDirty() {
    FormUtils.markAsDirty(this.form);
    this.markForCheck();
  }

  public markAsPristine() {
    FormUtils.markAsPristine(this.form);
    this.markForCheck();
  }

  public onSubmit() {
    if (!this.form.valid) {
      FormUtils.markAsDirty(this.form);
    }
  }
}
