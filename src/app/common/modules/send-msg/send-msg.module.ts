import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendMsgComponent } from '@common/modules/send-msg/send-msg.component';
import { MsgService } from '@common/services/msg.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { KeysPipe } from '@common/pipes/keys-pipe';
import { SharedModule } from '@common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
  ],
  declarations: [
    SendMsgComponent,
    KeysPipe,
  ],
  exports: [
    SendMsgComponent,
    KeysPipe,
  ],
  providers: [
    MsgService,
  ],
})
export class SendMsgModule {
}
