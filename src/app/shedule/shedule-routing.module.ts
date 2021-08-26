import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SheduleComponent } from './shedule.component';

const routes: Routes = [
  {
    path: '',
    component: SheduleComponent,
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
export class SheduleRoutingModule {}
