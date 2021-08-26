import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { UsersListComponent } from '@modules/users/users-list/users-list.component';

const routes: Route[] = [
  {
    path: '',
    component: UsersListComponent,
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
export class UsersRoutingModule {
}
