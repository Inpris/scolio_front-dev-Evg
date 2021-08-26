import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { LocksmithComponent } from '@modules/locksmith/locksmith/locksmith.component';

const routes: Route[] = [
  {
    path: '',
    component: LocksmithComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
  declarations: [],
})
export class LocksmithRoutingModule {
}
