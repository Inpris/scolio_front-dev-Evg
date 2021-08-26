import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrmComponent } from './crm.component';
import { DetailLeadComponent } from './leads/detail-lead/detail-lead.component';

const routes: Routes = [
  {
    path: '',
    component: CrmComponent,
  },
  {
    path: ':tab',
    component: CrmComponent,
  },
  {
    path: 'leads/:id',
    component: DetailLeadComponent,
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
export class CrmRoutingModule {}
