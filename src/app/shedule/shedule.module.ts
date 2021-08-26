import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { DaySheduleComponent } from './day-shedule/day-shedule.component';
import { ContactCardComponent } from './contact-card/contact-card.component';
import { SheduleComponent } from './shedule.component';
import { SheduleRoutingModule } from './shedule-routing.module';
import { WeekSheduleComponent } from './week-shedule/week-shedule.component';
import { PipesModule } from '@common/pipes/pipes.module';
import { SharedModule } from '@common/shared.module';
import { ConsentToTreatmentService } from '@common/services/consent-to-treatment.service';
import { FilesService } from '@common/services/file.service';
import { FormControlsModule } from '@common/modules/form-controls';
import { AddAccessModule } from "@modules/shedule/appointment-form/components/add-access/add-access.module";
import { AddAccessComponent } from "@modules/shedule/appointment-form/components/add-access/add-access.component";
import { AccessesService } from "@common/services/accesses-service.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    SharedModule,
    SheduleRoutingModule,
    PipesModule,
    FormControlsModule,
    AddAccessModule
  ],
  exports: [
    SheduleComponent,
  ],
  declarations: [
    AppointmentFormComponent,
    DaySheduleComponent,
    ContactCardComponent,
    SheduleComponent,
    WeekSheduleComponent,
  ],
  entryComponents: [
    DaySheduleComponent,
    AddAccessComponent,
  ],
  providers: [
    ConsentToTreatmentService,
    FilesService,
    AccessesService,
  ],
})
export class SheduleModule {
}
