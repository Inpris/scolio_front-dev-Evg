import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgePipe } from '@common/pipes/age';
import { EnumToArrayPipe } from '@common/pipes/enum-to-array';
import { BooleanFormatterPipe } from './booleanFormatter';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    AgePipe,
    EnumToArrayPipe,
    BooleanFormatterPipe,

  ],
  exports: [
    AgePipe,
    BooleanFormatterPipe,

  ],
})
export class PipesModule {
}
