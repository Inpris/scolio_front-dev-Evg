import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateRangePickerComponent } from './date-range-picker.component';

@Component({
  selector: 'sl-week-picker',
  templateUrl: 'date-range-picker.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => SlWeekPickerComponent),
  }],
})

export class SlWeekPickerComponent extends DateRangePickerComponent {
  showWeek: boolean = true;
}
