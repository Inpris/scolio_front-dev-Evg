import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCountComponent } from './product-count/product-count.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ProductCountComponent,
  ],
  exports: [
    ProductCountComponent,
  ],
})
export class PurchaseSharedModule {
}
