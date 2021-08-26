import { Component, AfterViewInit, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { MsgCreate } from '@common/interfaces/Msg-create';
import { MailItem } from '@common/interfaces/Mail-item';
import { MailService } from '@common/services/mail.service';
import * as FileSaver from 'file-saver';
import { MsgService } from '@common/services/msg.service';
import { MailDataService } from '@common/helpers/mail-data';

const TYPE = 'email';

@Component({
  selector: 'sl-detail-mail',
  templateUrl: './detail-mail.component.html',
  styleUrls: ['./detail-mail.component.less'],
})
export class DetailMailComponent implements OnInit, AfterViewInit {
  @Input() data: MailItem;
  @Output() returnBack = new EventEmitter<any>();

  @ViewChild('formMsgModalContent')
  private formMsgModalContent: any;

  @ViewChild('container')
  htmlContainer: ElementRef;

  modalMsgForm: NzModalRef;
  msgData: MsgCreate;
  entityTypes: {
    Contact: string;
    Lead: string;
  } = {
    Contact: 'Контакт',
    Lead: 'Заявка',
  };

  readonly outgoingStatus = 'Outgoing';

  constructor(
    private modalService: NzModalService,
    private mailService: MailService,
    private mailDataService: MailDataService,
    private msgService: MsgService,
    private message: NzMessageService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const elem = this.htmlContainer.nativeElement;
    elem.innerHTML = this.data.htmlBody;
  }

  back(data) {
    this.returnBack.emit(data);
  }

  confirmRemove(data) {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите удалить письмо?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => { this.removeMsg(data); },
      nzZIndex: 1200,
    });
  }

  private removeMsg(data) {
    this.msgService.remove(data.id).subscribe((response) => {
      const msg = { data, type: 'isDeleted' };
      this.back(msg);
      this.mailDataService.data.pageParams.totalCount -= 1;
      let removeCount = null;
      this.mailDataService.data.items.some((item, i) => {
        if (item.id === data.id) {
          removeCount = i;
          return true;
        }
      });
      if (removeCount !== null) {
        this.mailDataService.data.items.splice(removeCount, 1);
      }
      const message = 'Письмо удалено';
      this.onMessage(message);
    }, (err) => {
      const message = 'При удалении письма произошла непредвиденная ошибка';
      this.onMessage(message, 'error');
      console.dir(err);
    });
  }

  private onMessage(content: string, type: string = 'success') {
    this.message.create(type, content, { nzDuration: 3000 });
  }

  confirmRestore(data) {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите восстановить письмо?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => { this.restoreMsg(data); },
      nzZIndex: 1200,
    });
  }

  private restoreMsg(data) {
    this.msgService.restore(data.id).subscribe((response) => {
      const msg = { data, type: 'isRestore' };
      this.back(msg);
      this.mailDataService.data.pageParams.totalCount -= 1;
      let restoreCount = null;
      this.mailDataService.data.items.some((item, i) => {
        if (item.id === data.id) {
          restoreCount = i;
          return true;
        }
      });
      if (restoreCount !== null) {
        this.mailDataService.data.items.splice(restoreCount, 1);
      }
      const message = 'Письмо восстановлено';
      this.onMessage(message);
    }, (err) => {
      const message = 'При восстановлении письма произошла непредвиденная ошибка';
      this.onMessage(message, 'error');
      console.dir(err);
    });
  }
  // send message
  sendMsg() {
    this.createMsgData();
    this.modalMsgForm = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: this.formMsgModalContent,
      nzFooter: null,
      nzWidth: '1200px',
    });
  }

  closeModalMsgForm(data) {
    this.modalMsgForm.close();
    this.returnBack.emit(data);
  }

  private createMsgData() {
    this.msgData = {
      type: TYPE,
      entityId: this.data.entity.id,
      entityType: this.data.entity.type, // либо lead, либо email
      to: this.data.from,
      inReplyToMessageId: this.data.inReplyToMessageId,
      htmlBody: this.data.htmlBody,
      subject: this.data.subject,
    };

  }

  downloadFile(data) {
    const reader = new FileReader();
    this.mailService.downloadFile(data.id)
      .subscribe(
      (response) => {
        const file = new Blob([response], { type: response.type });
        FileSaver.saveAs(file, data.name);
      },
      (err) => {
        console.log(err);
      },
    );
  }
  // end send message

  get isShowAnswerButton() {
    return (this.data.emailStatus !== this.outgoingStatus) && (!this.data.isDeleted);
  }

  get isShowDeleteButton() {
    return !this.data.isDeleted;
  }

  get isShowRestoreButton() {
    return this.data.isDeleted;
  }
}
