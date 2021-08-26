import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzCalendarI18nInterface } from 'ng-zorro-antd/src/i18n/nz-i18n.interface';

@Component({
  // tslint:disable-next-line
  selector: 'ok-button',
  templateUrl: 'ok-button.component.html',
})

export class OkButtonComponent {
  @Input() locale: NzCalendarI18nInterface;
  @Input() okDisabled: boolean = false;
  @Output() clickOk = new EventEmitter<void>();

  prefixCls: string = 'ant-calendar';
}
