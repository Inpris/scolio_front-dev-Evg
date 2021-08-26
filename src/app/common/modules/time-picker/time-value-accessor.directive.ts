import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzI18nService } from 'ng-zorro-antd';
import { DateUtils } from '@common/utils/date';

@Directive({
  // tslint:disable-next-line
  selector: 'input[nzTime]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TimeValueAccessorDirective, multi: true },
  ],
})
export class TimeValueAccessorDirective implements ControlValueAccessor {

  private _onChange: (value: Date) => void;
  private _onTouch: () => void;
  private value;
  private commonFormatValidator = {
    'HH:mm': /^((?:[01]\d|2[0-3]):[0-5]\d$)/,
    'HH:mm:ss': /^((?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$)/,
  };
  // tslint:disable-next-line
  @Input('nzTime') format: string;

  @HostListener('keyup')
  keyup(): void {
    this.changed();
  }

  @HostListener('blur')
  blur(): void {
    this.touched();
  }



  changed(): void {
    if (this._onChange) {
      const nativeValue = this.elementRef.nativeElement.value;
      const validator = this.commonFormatValidator[this.format];
      const timeValid = validator && validator.test(nativeValue);
      const controlValueValid = this.value instanceof Date;
      let value;
      switch (true) {
        case timeValid && controlValueValid:
          value = DateUtils.parse(this.value, nativeValue);
          break;
        case controlValueValid:
          value = this.value;
          break;
        case timeValid:
          value = DateUtils.parse(new Date(), nativeValue);
          break;
        default:
          value = new Date();
      }
      this._onChange(value);
    }
  }

  touched(): void {
    if (this._onTouch) {
      this._onTouch();
    }
  }

  setRange(): void {
    this.elementRef.nativeElement.focus();
    this.elementRef.nativeElement.setSelectionRange(0, this.elementRef.nativeElement.value.length);
  }

  constructor(private i18n: NzI18nService, private elementRef: ElementRef) {
  }

  writeValue(value: Date): void {
    this.value = value;
    this.elementRef.nativeElement.value = this.i18n.formatDate(value, this.format);
  }

  registerOnChange(fn: (value: Date) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouch = fn;
  }

}
