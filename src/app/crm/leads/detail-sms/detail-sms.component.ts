import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { MsgService } from '@common/services/msg.service';
import { SmsItem } from '@common/interfaces/Sms-item';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'sl-detail-sms',
  templateUrl: './detail-sms.component.html',
  styleUrls: ['./detail-sms.component.less'],
})
export class DetailSmsComponent {
  @Input() data: SmsItem;
  @Output() returnBack = new EventEmitter<any>();

  @ViewChild('formMsgModalContent')
  private formMsgModalContent: any;

  entityTypes: {
    Contact: string;
    Lead: string;
  } = {
    Contact: 'Контакт',
    Lead: 'Заявка',
  };

  constructor(
    private modalService: NzModalService,
    private msgService: MsgService,
    private message: NzMessageService,
  ) { }

  back(data) {
    this.returnBack.emit(data);
  }

  confirmRemove(data) {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите удалить сообщение?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => { this.removeMsg(data); },
      nzZIndex: 1200,
    });
  }

  private removeMsg(data) {
    this.msgService.removeSms(data.id).subscribe(
      () => {
        const msg = { data, type: 'isDeleted' };
        this.back(msg);
        this.onSuccess();
      }
      , err => this.onError(err));
  }

  private onSuccess() {
    const content = `Сообщение удалено`;
    this.message.info(content, { nzDuration: 3000 });
  }

  private onError(response: HttpErrorResponse) {
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.message.error(errors[0], { nzDuration: 3000 });
    }
  }
}
