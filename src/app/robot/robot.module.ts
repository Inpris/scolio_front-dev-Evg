import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RobotComponent } from './robot/robot.component';
import { RobotRoutingModule } from '@modules/robot/robot-routing.module';
import { RobotService } from '@modules/common/services/robot.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { InfinityScrollModule } from '@common/modules/infinity-scroll/infinity-scroll.module';
import { PatientVisitsModule } from '@modules/patients/patient/patient-visits/patient-visits.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableFilterModule } from '@common/modules/table-filter/table-filter.module';
import { RobotStatisticComponent } from './robot/robot-statistic/robot-statistic.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { RobotXAxisComponent } from './robot/robot-statistic/robot-x-axis/robot-x-axis.component';
import { RobotXAxisLabelComponent } from './robot/robot-statistic/robot-x-axis/robot-x-axis-label/robot-x-axis-label.component';
import { RobotXAxisTicksComponent } from './robot/robot-statistic/robot-x-axis/robot-x-axis-ticks/robot-x-axis-ticks.component';
import { RobotStatisticSeriesVerticalComponent } from './robot/robot-statistic/robot-statistic-series-vertical/robot-statistic-series-vertical.component';
import { RobotStatisticChartsBarComponent } from './robot/robot-statistic/robot-statistic-series-vertical/robot-statistic-charts-bar/robot-statistic-charts-bar.component';
import { RobotStatisticLimitComponent } from './robot/robot-statistic/robot-statistic-limit/robot-statistic-limit.component';
import { IfHasAccessModule } from '@common/modules/if-has-access/if-has-access.module';
import { SharedModule } from '@common/shared.module';
import { RobotReportComponent } from '@modules/robot/robot/robot-report/robot-report.component';
import { FormControlsModule } from '@common/modules/form-controls';

@NgModule({
  imports: [
    CommonModule,
    RobotRoutingModule,
    NgZorroAntdModule,
    IfHasAccessModule,
    SharedModule,
    InfinityScrollModule,
    PatientVisitsModule,
    ReactiveFormsModule,
    FormsModule,
    TableFilterModule,
    NgxChartsModule,
    FormControlsModule,
  ],
  providers: [
    RobotService,
  ],
  declarations: [
    RobotComponent,
    RobotStatisticComponent,
    RobotXAxisComponent,
    RobotXAxisLabelComponent,
    RobotXAxisTicksComponent,
    RobotStatisticSeriesVerticalComponent,
    RobotStatisticChartsBarComponent,
    RobotStatisticLimitComponent,
    RobotReportComponent,
  ],
  entryComponents: [
    RobotStatisticLimitComponent,
    RobotReportComponent,
  ],
})
export class RobotModule {
}
