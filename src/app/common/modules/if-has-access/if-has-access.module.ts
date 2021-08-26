import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IfHasAccessDirective } from '@common/modules/if-has-access/if-has-access.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IfHasAccessDirective,
  ],
  exports: [
    IfHasAccessDirective,
  ],
})
export class IfHasAccessModule {
}
