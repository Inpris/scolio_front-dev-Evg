import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfinityScrollComponent } from './infinity-scroll/infinity-scroll.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
  ],
  declarations: [InfinityScrollComponent],
  exports: [InfinityScrollComponent],
})
export class InfinityScrollModule {
}
