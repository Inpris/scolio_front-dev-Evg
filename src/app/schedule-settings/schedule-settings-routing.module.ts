import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleSettingsComponent } from '@modules/schedule-settings/schedule-settings.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleSettingsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ScheduleSettingsRoutingModule {}
