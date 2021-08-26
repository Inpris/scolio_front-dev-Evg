import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesComponent } from './purchases.component';
import { PurchasesRoutingModule } from './purchases-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DeadlineComponent } from './deadline/deadline.component';
import { PurchaseService } from '@common/services/purchase.service';
import { DeadlineDataService } from '@common/helpers/deadline-data';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProductService } from '@common/services/product.service';
import { PurchasePatientsListComponent } from './purchase-list/purchase-patients-list/purchase-patients-list.component';
import { PurchaseCalendarComponent } from './purchase-calendar/purchase-calendar.component';
import { SubstrPipe } from '@common/pipes/substr-pipe';
import { PatientService } from '@common/services/patient.service';
import { PurchaseSharedModule } from './purchase-shared/purchase-shared.module';
import { TableFilterModule } from '@common/modules/table-filter/table-filter.module';
import { PurchaseCreateComponent } from './purchase-create/purchase-create.component';
import { PurchaseDetailModule } from './purchase-detail/purchase-detail.module';
import { EisService } from '@common/services/eis.service';
import { InfinityScrollModule } from '@common/modules/infinity-scroll/infinity-scroll.module';
import { PurchaseTabService } from '@common/services/purchase-tab';
import { PurchaseCreateService } from '@common/services/purchase-create.service';
import { SharedModule } from '@common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PurchasesRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    FormsModule,
    PurchaseSharedModule,
    TableFilterModule,
    PurchaseDetailModule,
    InfinityScrollModule,
    ReactiveFormsModule,
  ],
  declarations: [
    PurchasesComponent,
    DeadlineComponent,
    PurchaseListComponent,
    PurchasePatientsListComponent,
    PurchaseCalendarComponent,
    SubstrPipe,
    PurchaseCreateComponent,
  ],
  providers: [
    PurchaseService,
    DeadlineDataService,
    ProductService,
    PatientService,
    PurchaseCreateService,
    EisService,
    PurchaseTabService,
  ],
  exports: [
    PurchasePatientsListComponent
  ]
})
export class PurchasesModule { }
