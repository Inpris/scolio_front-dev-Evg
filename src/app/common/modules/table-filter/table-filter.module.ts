import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFilterRangeComponent } from './table-filter-range/table-filter-range.component';
import { TableFilterTextComponent } from './table-filter-text/table-filter-text.component';
import { TableFilterDateRangeComponent } from './table-filter-date-range/table-filter-date-range.component';
import { TableFilterMultipleComponent } from './table-filter-multiple/table-filter-multiple.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { TableFilterSelectComponent } from '@common/modules/table-filter/table-filter-select/table-filter-select.component';
import { TableFilterDateComponent } from './table-filter-date/table-filter-date.component';
import { SharedModule } from '@common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    FormsModule,
  ],
  declarations: [
    TableFilterRangeComponent,
    TableFilterTextComponent,
    TableFilterDateRangeComponent,
    TableFilterDateComponent,
    TableFilterMultipleComponent,
    TableFilterSelectComponent,
  ],
  exports: [
    TableFilterRangeComponent,
    TableFilterTextComponent,
    TableFilterDateComponent,
    TableFilterDateRangeComponent,
    TableFilterMultipleComponent,
    TableFilterSelectComponent,
  ],
})
export class TableFilterModule {
}
