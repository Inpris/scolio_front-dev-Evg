import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LeadsComponent } from './leads.component';
import { LeadsRoutingModule } from './leads-routing.module';
import { ColumnComponent } from './column/column.component';
import { CardComponent } from './card/card.component';
import { FormLeadComponent } from './form-lead/form-lead.component';
import { SheduleModule } from '../../shedule/shedule.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendMsgModule } from '@common/modules/send-msg/send-msg.module';
import { DetailLeadComponent } from './detail-lead/detail-lead.component';
import { UserFilterModule } from '@common/modules/user-filter/user-filter.module';
import { TasksModule } from '../tasks/tasks.module';
import { MailsModule } from '../mails/mails.module';
import { FormRejectComponent } from './form-reject/form-reject.component';
import { ContactListModule } from '@common/modules/contact-list/contact-list.module';
import { TimeLineModule } from '@modules/crm/leads/time-line/time-line.module';
import { SharedModule } from '@common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    LeadsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SheduleModule,
    SendMsgModule,
    UserFilterModule,
    TasksModule,
    MailsModule,
    ContactListModule,
    TimeLineModule,
  ],
  exports: [
    LeadsComponent,
    DetailLeadComponent,
  ],
  declarations: [
    LeadsComponent,
    ColumnComponent,
    CardComponent,
    FormLeadComponent,
    DetailLeadComponent,
    FormRejectComponent,
  ],
})
export class LeadsModule {}
