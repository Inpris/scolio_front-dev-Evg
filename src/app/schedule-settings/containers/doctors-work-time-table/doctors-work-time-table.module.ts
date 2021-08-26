import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorsWorkTimeTableComponent } from './doctors-work-time-table.component';
import {NgZorroAntdModule} from "ng-zorro-antd";
import {FormsModule} from "@angular/forms";
import {InfinityScrollModule} from "@common/modules/infinity-scroll/infinity-scroll.module";

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    InfinityScrollModule
  ],
  exports: [
    DoctorsWorkTimeTableComponent
  ],
  declarations: [DoctorsWorkTimeTableComponent]
})
export class DoctorsWorkTimeTableModule { }
