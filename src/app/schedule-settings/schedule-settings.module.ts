import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlsModule } from '@common/modules/form-controls';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PipesModule } from '@common/pipes/pipes.module';
import { CanDeactivateGuard } from '@modules/patients/patient/guards/can-deactivate-guard.service';
import { ScheduleSettingsComponent } from '@modules/schedule-settings/schedule-settings.component';
import { IfHasAccessModule } from '@common/modules/if-has-access/if-has-access.module';
import { DoctorScheduleModule } from '@modules/schedule-settings/containers/doctor-schedule/doctor-schedule.module';
import { ScheduleSettingsRoutingModule } from '@modules/schedule-settings/schedule-settings-routing.module';
import { RoomScheduleModule } from '@modules/schedule-settings/containers/room-schedule/room-schedule.module';
import {RoomDayScheduleModule} from '@modules/schedule-settings/containers/room-day-schedule/room-day-schedule.module';
import {RoomWeekSheduleComponent} from '@modules/schedule-settings/components/room-week-shedule/room-week-shedule.component';
import {DoctorsWorkTimeTableModule} from "@modules/schedule-settings/containers/doctors-work-time-table/doctors-work-time-table.module";

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    FormControlsModule,
    PipesModule,
    DoctorScheduleModule,
    IfHasAccessModule,
    ScheduleSettingsRoutingModule,
    RoomScheduleModule,
    RoomDayScheduleModule,
    DoctorsWorkTimeTableModule,
  ],
  declarations: [
    ScheduleSettingsComponent,
    RoomWeekSheduleComponent,
  ],
  providers: [
    CanDeactivateGuard,
  ],
  exports: [],
})
export class ScheduleSettingsModule {}
