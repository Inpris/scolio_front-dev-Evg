import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimePickerPanelComponent } from './time-picker-panel.component';
import { TimePickerComponent } from './time-picker.component';
import { TimeValueAccessorDirective } from './time-value-accessor.directive';
import { NgZorroAntdModule, NzI18nModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [
    TimePickerComponent,
    TimePickerPanelComponent,
    TimeValueAccessorDirective,
  ],
  exports: [
    TimePickerPanelComponent,
    TimePickerComponent,
  ],
  imports: [CommonModule, FormsModule, OverlayModule, NgZorroAntdModule],
  entryComponents: [],
})
export class SlTimePickerModule {
}
