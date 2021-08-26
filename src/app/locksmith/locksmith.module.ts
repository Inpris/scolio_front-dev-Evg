import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocksmithRoutingModule } from '@modules/locksmith/locksmith-routing.module';
import { LocksmithComponent } from '@modules/locksmith/locksmith/locksmith.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableFilterModule } from '@common/modules/table-filter/table-filter.module';
import { InfinityScrollModule } from '@common/modules/infinity-scroll/infinity-scroll.module';
import { LocksmithDetailComponent } from '@modules/locksmith/locksmith/locksmith-detail/locksmith-detail.component';
import { DetailRowComponent } from '@modules/locksmith/locksmith/locksmith-detail/detail-row/detail-row.component';
import { FormControlsModule } from '@common/modules/form-controls';
import { EditRowComponent } from '@modules/locksmith/locksmith/locksmith-detail/detail-row/edit-row/edit-row.component';
import { SharedModule } from '@common/shared.module';
import { IfHasAccessModule } from '@common/modules/if-has-access/if-has-access.module';
import { LocksmithReportComponent } from './locksmith/locksmith-report/locksmith-report.component';
import { LocksmithService } from '@common/services/locksmith.service';

@NgModule({
  imports: [
    CommonModule,
    LocksmithRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TableFilterModule,
    InfinityScrollModule,
    FormControlsModule,
    IfHasAccessModule,
  ],
  declarations: [
    LocksmithComponent,
    LocksmithDetailComponent,
    DetailRowComponent,
    EditRowComponent,
    LocksmithReportComponent,
  ],
  entryComponents: [
    LocksmithReportComponent,
  ],
  providers: [
    LocksmithService,
  ],
})
export class LocksmithModule {
}
