import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CrmComponent } from './crm.component';
import { CrmRoutingModule } from './crm-routing.module';
import { LeadsModule } from './leads/leads.module';
import { MailsModule } from './mails/mails.module';
import { TasksModule } from './tasks/tasks.module';
import { LeadDataService } from '@common/helpers/lead-data';
import { LeadService } from '@common/services/lead.service';
import { RejectResultsService } from '@common/services/rejectResults';
import { RejectsService } from '@common/services/rejects';
import { EventService } from '@common/services/event.service';
import { SharedModule } from '@common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    CrmRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    LeadsModule,
    MailsModule,
    TasksModule,
  ],
  declarations: [
    CrmComponent,
  ],
  providers: [
    LeadDataService,
    LeadService,
    RejectResultsService,
    RejectsService,
    EventService,
  ],

})
export class CrmModule {
}
