import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '@common/utils/form';

import { LeadItem } from '@common/interfaces/Lead-item';
import { MsgService } from '@common/services/msg.service';
import { SmsCreate } from '@common/interfaces/Sms-create';
import { EmailCreate } from '@common/interfaces/Email-create';
import { HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { MsgCreate } from '@common/interfaces/Msg-create';
import * as CKEDITOR from 'ng2-ckeditor';
const EMAIL = 'testscol@yandex.ru';

@Component({
  selector: 'sl-send-msg',
  templateUrl: './send-msg.component.html',
  styleUrls: ['./send-msg.component.less'],
})
export class SendMsgComponent implements OnInit {
  @Input() data: MsgCreate;
  @Output() closeModal = new EventEmitter<any>();

  form: FormGroup;
  private email: string;
  private ckeConfig: any;
  countSymbol = 0;
  typeMsg: string;
  htmlBody: string;

  editorError: boolean;
  msgFormLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private msgService: MsgService,
    private message: NzMessageService,
  ) {
    this.ckeConfig = {
      toolbar: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'RemoveFormat'] },
      ],
      resize_enabled: false,
    };
  }

  ngOnInit() {
    this.initType();
  }

  onReady(e) {
    if (this.data.inReplyToMessageId && this.data.htmlBody) {
      this.appendHtml(e);
    }
  }

  private appendHtml(e) {
    if (
      e.editor &&
      e.editor.document &&
      e.editor.document.$ &&
      e.editor.document.$.body &&
      e.editor.document.$.body.appendChild
    ) {
      const div = this.createBody();
      e.editor.document.$.body.appendChild(div);
    } else {
      setTimeout(this.appendHtml(e), 500);
    }
  }

  private createBody() {
    const div = `<blockquote style="border-left-width: 2px;">${this.data.htmlBody}</blockquote>`;
    const body = document.createElement('div');
    body.innerHTML = div;
    return body;
  }

  private initType() {
    this.typeMsg = this.data.type;
    if (this.typeMsg === 'email') {
      this.form = this.formBuilder.group({
        to: [{ value: null, disabled: true }, Validators.required],
        subject: [null, Validators.required],
        htmlBody: [null, Validators.required],
      });
      this.form.patchValue({
        subject: this.data.inReplyToMessageId ? `Re: ${this.data.subject}` : null,
      });
    } else if (this.typeMsg === 'sms') {
      this.form = this.formBuilder.group({
        to: [null, Validators.required],
        htmlBody: [null, Validators.required],
      });
      this.form.get('htmlBody').valueChanges.subscribe((text) => {
        if (!text) { return; }
        this.countSymbol = text.length;
      });
    }
    this.form.patchValue({
      to: this.data.to,
    });
  }

  editorCheck() {
    if (this.typeMsg === 'email') {
      this.htmlBody && this.htmlBody.length > 0 ? this.editorError = false : this.editorError = true;
    }
  }

  editorOnChange() {
    this.form.get('htmlBody').valueChanges.skip(1).subscribe((text) => {
      this.editorCheck();
    });
  }

  public closeForm(msg) {
    const result = { data: msg, type: this.typeMsg };
    this.closeModal.emit(result);
  }

  public onSubmit(form: FormGroup) {
    if (form.invalid) {
      FormUtils.markAsDirty(form);
      this.editorCheck();
      return;
    }
    this.msgFormLoading = true;

    if (this.typeMsg === 'email') {
      const dataMail = this.getEmailModel();
      this.sendEmail(dataMail)
        .finally(() => { this.msgFormLoading = false; })
        .subscribe((response) => {
          this.closeForm(response);
          this.message.info('Отправлено.', { nzDuration: 3000 });
        }, (err) => {
          console.log(err);
          this.onError(err);
        });
    } else if (this.typeMsg === 'sms') {
      const dataSms: SmsCreate = this.getSmsModel();
      this.sendSms(dataSms)
        .finally(() => { this.msgFormLoading = false; })
        .subscribe((response) => {
          this.closeForm(response);
          this.message.info('Отправлено.', { nzDuration: 3000 });
        }, (err) => {
          console.log(err);
          this.onError(err);
        });
    }
  }

  private getEmailModel(): EmailCreate {
    const {
      to,
      subject,
      htmlBody,
    } = this.form.getRawValue();

    return {
      to,
      htmlBody,
      subject,
      entityType: this.data.entityType,  // либо 'lead', либо 'email'
      entityId: this.data.entityId, // leadId
      from: EMAIL,
      inReplyToMessageId: this.data.inReplyToMessageId ? this.data.inReplyToMessageId : null, // id сообщения на которое надо ответить
    };
  }

  private getSmsModel(): SmsCreate {
    const {
      to,
      htmlBody,
    } = this.form.getRawValue();

    return {
      phone: to,
      message: htmlBody,
      entityType: this.data.entityType,
      entityId: this.data.entityId,
    };
  }

  private sendEmail(dataMail: EmailCreate) {
    return this.msgService.sendEmail(dataMail);
  }
  private sendSms(dataSms: SmsCreate) {
    return this.msgService.sendSms(dataSms);
  }

  private onError(response: HttpErrorResponse) {
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.message.error(errors[0], { nzDuration: 3000 });
    }
  }
}
