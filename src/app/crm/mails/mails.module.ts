import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailsComponent } from './mails.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MailService } from '@common/services/mail.service';
import { MailDataService } from '@common/helpers/mail-data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailMailComponent } from './detail-mail/detail-mail.component';
import { SendMsgModule } from '@common/modules/send-msg/send-msg.module';
import { MailsRoutingModule } from './mails-routing.module';
import { SharedModule } from '@common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SendMsgModule,
    MailsRoutingModule,
  ],
  exports: [
    MailsComponent,
    DetailMailComponent,
  ],
  declarations: [
    MailsComponent,
    DetailMailComponent,
  ],
  providers: [
    MailService,
    MailDataService,
  ],
})
export class MailsModule { }
