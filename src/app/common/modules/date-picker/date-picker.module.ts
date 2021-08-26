import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LibPackerModule } from './lib/lib-packer.module';

import { SlDatePickerComponent } from './date-picker.component';
import { DateRangePickerComponent } from './date-range-picker.component';
import { SlMonthPickerComponent } from './month-picker.component';
import { SlPickerComponent } from './picker.component';
import { SlRangePickerComponent } from './range-picker.component';
import { SlWeekPickerComponent } from './week-picker.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    LibPackerModule,
  ],
  exports: [
    SlDatePickerComponent,
    SlRangePickerComponent,
    SlMonthPickerComponent,
    SlWeekPickerComponent,
  ],
  declarations: [
    DateRangePickerComponent,
    SlDatePickerComponent,
    SlMonthPickerComponent,
    SlWeekPickerComponent,
    SlRangePickerComponent,
    SlPickerComponent,
  ],
  providers: [],
})
export class SlDatePickerModule {
}
