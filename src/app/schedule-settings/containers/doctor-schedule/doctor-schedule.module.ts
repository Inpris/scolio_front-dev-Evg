import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlsModule } from '@common/modules/form-controls';
import { SharedModule } from '@common/shared.module';
import { DayScheduleModule } from '@modules/schedule-settings/components/day-schedule/day-schedule.module';
import { DoctorScheduleComponent } from '@modules/schedule-settings/containers/doctor-schedule/doctor-schedule.component';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FormControlsModule,
    DayScheduleModule,
  ],
  declarations: [
    DoctorScheduleComponent,
  ],
  exports: [
    DoctorScheduleComponent,
  ],
})
export class DoctorScheduleModule {
}
