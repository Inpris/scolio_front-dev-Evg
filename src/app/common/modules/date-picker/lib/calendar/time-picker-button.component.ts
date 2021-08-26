import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzCalendarI18nInterface } from 'ng-zorro-antd/src/i18n/nz-i18n.interface';

@Component({
  // tslint:disable-next-line
  selector: 'time-picker-button',
  templateUrl: 'time-picker-button.component.html',
})

export class TimePickerButtonComponent {
  @Input() locale: NzCalendarI18nInterface;
  @Input() timePickerDisabled: boolean = false;

  @Input() showTimePicker: boolean = false;
  @Output() showTimePickerChange = new EventEmitter<boolean>();

  prefixCls: string = 'ant-calendar';

  onClick(): void {
    this.showTimePicker = !this.showTimePicker;
    this.showTimePickerChange.emit(this.showTimePicker);
  }
}
