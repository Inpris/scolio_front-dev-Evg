import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { PatientsReportComponent } from './patients-report/patients-report.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from '@common/shared.module';
import { TableFilterModule } from '@common/modules/table-filter/table-filter.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfinityScrollModule } from '@common/modules/infinity-scroll/infinity-scroll.module';
import { VisitsReportComponent } from './visits-report/visits-report.component';
import { ReportExactStringComponent } from './report-filters/report-exact-string/report-exact-string.component';
import { ReportFiltersComponent } from './report-filters/report-filters.component';
import { ReportDateComponent } from './report-filters/report-date/report-date.component';
import { ReportSelectComponent } from './report-filters/report-select/report-select.component';
import { FormControlsModule } from '@common/modules/form-controls';
import { VisitsReportHelper } from '@modules/reports/helpers/visits-report-helper';
import { ReportNumberComponent } from './report-filters/report-number/report-number.component';
import { ReportsComponent } from './reports.component';
import { PatientsReportHelper } from './helpers/patients-report-helper';
import { ReportConfigurationComponent } from './patients-report/report-configuration/report-configuration.component';
import {ReportConfigurationTableComponent} from "@modules/reports/patients-report/report-configuration-table/report-configuration-table.component";
import {IfHasAccessModule} from "@common/modules/if-has-access/if-has-access.module";

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    InfinityScrollModule,
    TableFilterModule,
    FormsModule,
    ReactiveFormsModule,
    FormControlsModule,
    IfHasAccessModule,
  ],
  providers: [
    VisitsReportHelper,
    PatientsReportHelper,
  ],
  declarations: [
    ReportsComponent,
    PatientsReportComponent,
    VisitsReportComponent,
    ReportExactStringComponent,
    ReportFiltersComponent,
    ReportDateComponent,
    ReportSelectComponent,
    ReportNumberComponent,
    ReportConfigurationComponent,
    ReportConfigurationTableComponent,
  ],
  exports: [
    ReportConfigurationComponent,
    ReportConfigurationTableComponent,
  ],
  entryComponents: [
    ReportConfigurationComponent,
    ReportConfigurationTableComponent,
  ],
})
export class ReportsModule {
}
