import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseDetailComponent } from './purchase-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseDetailComponent,
  },
  {
    path: ':tab',
    component: PurchaseDetailComponent,
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
export class PurchaseDetailRoutingModule {}
