import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchasesComponent } from './purchases.component';
import { PurchaseCreateComponent } from './purchase-create/purchase-create.component';

const routes: Routes = [
  {
    path: '',
    component: PurchasesComponent,
  },
  {
    path: 'create',
    component: PurchaseCreateComponent,
  },
  {
    path: ':purchaseId',
    loadChildren: './purchase-detail/purchase-detail.module#PurchaseDetailModule',
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
export class PurchasesRoutingModule {}
