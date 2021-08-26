import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '@common/services/event.service';
import { NoteService } from '@common/services/note.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MailsModule } from '@modules/crm/mails/mails.module';
import { TasksModule } from '@modules/crm/tasks/tasks.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SendMsgModule } from '@common/modules/send-msg/send-msg.module';
import { TimeLineComponent } from '@modules/crm/leads/time-line/time-line.component';
import { DetailSmsComponent } from '@modules/crm/leads/detail-sms/detail-sms.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SendMsgModule,
    TasksModule,
    MailsModule,
    RouterModule,
  ],
  providers: [
    NoteService,
    EventService,
  ],
  declarations: [
    TimeLineComponent,
    DetailSmsComponent,
  ],
  exports: [
    TimeLineComponent,
  ],
})
export class TimeLineModule {
}
