import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedSavePanelComponent } from '@common/modules/fixed-save-panel/fixed-save-panel.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
  ],
  declarations: [
    FixedSavePanelComponent,
  ],
  exports: [
    FixedSavePanelComponent,
  ],
})
export class FixedSavePanelModule {
}
