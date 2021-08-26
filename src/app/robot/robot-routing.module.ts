import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RobotComponent } from '@modules/robot/robot/robot.component';

const routes: Routes = [
  {
    path: '',
    component: RobotComponent,
  },
  {
    path: '**', redirectTo: '',
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
export class RobotRoutingModule {
}
