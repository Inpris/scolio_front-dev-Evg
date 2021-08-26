import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

import { CandyDate } from '../candy-date';
import { NzCalendarI18nInterface } from 'ng-zorro-antd/src/i18n/nz-i18n.interface';
import { NzI18nService } from 'ng-zorro-antd';
import { customFormatterFromFormat } from '@common/modules/date-picker/lib/candy-date/util';

@Component({
  // tslint:disable-next-line
  selector: 'calendar-input',
  templateUrl: 'calendar-input.component.html',
})

export class CalendarInputComponent implements OnInit {
  @Input() locale: NzCalendarI18nInterface;
  @Input() format: string;
  @Input() placeholder: string;
  @Input() disabledDate: (d: Date) => boolean;

  @Input() value: CandyDate;
  @Output() valueChange = new EventEmitter<CandyDate>();

  @ViewChild('inputElement') inputElement: ElementRef;

  prefixCls: string = 'ant-calendar';
  invalidInputClass: string = '';

  constructor(private i18n: NzI18nService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.inputElement.nativeElement.focus();
  }

  onInputKeyup(event: Event): void {
    let value = (event.target as HTMLInputElement).value;
    if (customFormatterFromFormat[this.format]) {
      value = customFormatterFromFormat[this.format](value);
      this.renderer.setProperty(event.target, 'value', value);
    }
    const date = this.checkValidInputDate(value);
    if (!date || (this.disabledDate && this.disabledDate(date.nativeDate))) {
      return;
    }

    if (!date.isSame(this.value, 'second')) { // Not same with original value
      this.value = date;
      this.valueChange.emit(this.value);
    }
  }

  toReadableInput(value: CandyDate): string {
    return value ? this.i18n.formatDateCompatible(value.nativeDate, this.format) : '';
  }

  private checkValidInputDate(input): CandyDate {
    const date = new CandyDate(input, this.format);

    this.invalidInputClass = '';
    if (date.isInvalid() || input !== this.toReadableInput(date)) { // Should also match the input format exactly
      this.invalidInputClass = `${this.prefixCls}-input-invalid`;
      return null;
    }

    return date;
  }
}
