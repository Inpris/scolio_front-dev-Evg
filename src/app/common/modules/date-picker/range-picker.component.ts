import { forwardRef, Component } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { DateRangePickerComponent } from './date-range-picker.component';

@Component({
  selector: 'sl-range-picker',
  templateUrl: 'date-range-picker.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => SlRangePickerComponent),
  }],
})

export class SlRangePickerComponent extends DateRangePickerComponent {
  isRange: boolean = true;
}
