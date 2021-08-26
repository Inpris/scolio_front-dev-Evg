import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { LeadItem } from '@common/interfaces/Lead-item';
import { NzModalService, NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { MsgCreate } from '@common/interfaces/Msg-create';
import { NoteService } from '@common/services/note.service';
import { NoteCreate } from '@common/interfaces/Note-create';
import { Note } from '@common/models/note';
import { DateUtils } from '@common/utils/date';
import { TaskService } from '@common/services/task.service';
import { MailService } from '@common/services/mail.service';
import { MailItem } from '@common/interfaces/Mail-item';
import { MailDataService } from '@common/helpers/mail-data';
import { MsgService } from '@common/services/msg.service';
import { EventService } from '@common/services/event.service';
import { EntityTypes } from '@common/models/entity-types';
import { Contact } from '@common/models/contact';
import * as moment from 'moment';

@Component({
  selector: 'sl-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.less'],
})
export class TimeLineComponent implements OnInit {
  @Input() entity;
  @Input() entityType;
  @Input() checkAccept: boolean;

  get contact() {
    switch (this.entityType) {
      case EntityTypes.CONTACT:
        return <Contact>this.entity;
      case EntityTypes.LEAD:
        return (<LeadItem>this.entity).leadInfo;
    }
  }

  @ViewChild('detailMailModalContent')
  private detailMailModalContent: any;
  modalMailDetail: NzModalRef;
  mailForDetail: MailItem;

  @ViewChild('formMsgModalContent')
  private formMsgModalContent: any;
  modalMsgForm: NzModalRef;
  msgData: MsgCreate;

  @ViewChild('formTaskModalContent')
  private formTaskModalContent: any;
  modalTaskForm: NzModalRef;
  dataForCreateTask: any = {
    entityId: null,
    entityType: null,
    assignedUserId: null,
  };
  dataTask: any;

  @ViewChild('detailSmsModalContent')
  private detailSmsModalContent: any;
  smsForDetail;

  @Output()
  eventUpdated = new EventEmitter<{eventType: string; prevValue: any; newValue: any}>();

  noteText: string;
  note: Note = {
    text: null,
    dueDateTime: null,
    entityType: null,
    entityId: null,
    assignedUser: null,
    eventStatusId: null,
    createdDate: null,
  };
  noteEdit = false;

  taskModalType: string;

  eventsObj: {
    planned: {
      ruName: string;
      show: boolean;
      items: any[];
    };
    doneToday: {
      ruName: string;
      show: boolean;
      items: any[];
    };
    doneYesterday: {
      ruName: string;
      show: boolean;
      items: any[];
    };
    doneBefore: {
      ruName: string;
      show: boolean;
      items: any[];
    };
  } = {
    planned: {
      ruName: 'Запланированно',
      show: true,
      items: [],
    },
    doneToday: {
      ruName: 'Выполнено сегодня',
      show: true,
      items: [],
    },
    doneYesterday: {
      ruName: 'Выполнено вчера',
      show: true,
      items: [],
    },
    doneBefore: {
      ruName: 'Выполнено ранее',
      show: true,
      items: [],
    },
  };

  selectedItem: any;
  eventsLoading = true;

  public get smsTooltip() {
    switch (true) {
      case !this.contact.phone: return 'Не указан номер телефона контакта';
      case this.contact.phone && !this.checkAccept: return 'Отправить SMS';
      case this.contact.phone && this.contact.acceptSms && this.checkAccept: return 'Отправить SMS';
      case this.contact.phone && !this.contact.acceptSms: return 'Отсутствует согласие на получение SMS-сообщений';
      default: return '';
    }
  }

  public get isContactSMS() {
    return this.contact.phone &&
      (!this.checkAccept ||
        (this.checkAccept && this.contact.acceptSms)
    );
  }

  constructor(
    private modalService: NzModalService,
    private noteService: NoteService,
    private eventService: EventService,
    private message: NzMessageService,
    private taskService: TaskService,
    private mailService: MailService,
    private mailDataService: MailDataService,
    private msgService: MsgService,
  ) {
  }

  ngOnInit() {
    this.mailDataService.emailCreated.subscribe((email) => {
      this.updateTimelineMail(email);
    });

    this.mailDataService.emailChanged.subscribe((email) => {
      this.replaseItemFromLocalObj();
      this.updateTimelineMail(email);
    });
    this.dataForCreateTask.entityId = this.entity.id;
    this.dataForCreateTask.entityType = this.entityType;
    this.dataForCreateTask.assignedUserId = this.entity.assignedUser && this.entity.assignedUser.id;
    this.getTimelineData();
  }

  updateTimelineMail(email) {
    if (email.entity.id !== this.entity.id) {
      return;
    }
    const obj = { data: email };
    this.createEventDataFromMsgResponse('Email', obj);
  }

  getTimelineData() {
    const eventsParams = {
      entityId: this.entity.id,
      entityType: this.entityType,
    };
    const pageParams = {
      pageSize: 100,
    };
    this.eventService.get(eventsParams, pageParams).subscribe((events) => {
      this.eventsLoading = false;
      events.data.forEach((event) => {
        if (event.eventDetailType === 'Note') {
          this.createLocalNoteData(event);
        } else if (
          event.eventDetailType === 'Email' ||
          event.eventDetailType === 'Sms' ||
          event.eventDetailType === 'Task'
        ) {
          this.createLocalData(event);
        }
      });
    }, (err) => {
      console.log(err);
    });
  }

  showMenu(col) {
    this.eventsObj[col].show = !this.eventsObj[col].show;
  }

  createLocalNoteData(event) {
    this.note.text = event.subject;
    this.note.assignedUser = event.assignedUser;
    this.note.createdDate = event.createdDate;
  }

  goToDetailItem(data) {
    this.selectedItem = data;
    switch (data.eventType) {
      case 'task' :
        return this.goTaskDetail();
      case 'email':
        return this.goMsgDetail();
      case 'sms'  :
        return this.goSmsDetail();
    }
  }

  private goSmsDetail() {
    this.eventsLoading = true;
    this.msgService.getSms(this.selectedItem.id)
      .subscribe(
        (response) => {
          this.smsForDetail = response;
          this.showSmsDetail(response);
          this.eventsLoading = false;
        },
        (error) => {
          this.eventsLoading = false;
          console.dir(error);
        });
  }

  // show mail detail
  private goMsgDetail() {
    const params = { id: this.selectedItem.id };
    this.eventsLoading = true;
    this.mailService.get(params).subscribe((response) => {
      this.mailForDetail = response.data[0];
      this.privateShowMailDetail();
      this.eventsLoading = false;
    }, (err) => {
      this.eventsLoading = false;
      console.dir(err);
    });
  }

  private showSmsDetail(data) {
    if (this.modalMailDetail) {
      return;
    }
    this.modalMailDetail = this.modalService.create({
      nzTitle: null,
      nzZIndex: 10,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: this.detailSmsModalContent,
      nzFooter: null,
      nzWidth: '600px',
    });
  }

  private privateShowMailDetail() {
    if (this.modalMailDetail) {
      return;
    }
    this.modalMailDetail = this.modalService.create({
      nzTitle: null,
      nzZIndex: 10,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: this.detailMailModalContent,
      nzFooter: null,
      nzWidth: '800px',
    });
  }

  returnToLeadDitail(data) {
    if (data && data.data != null && data.type === 'isDeleted') {
      this.replaseItemFromLocalObj();
    } else if (data && data.data != null && data.type === 'email') {
      // this.replaseItemFromLocalObj();
      // if (data.data.emailStatus = 'Outgoing') {
      //   this.createEventDataFromMsgResponse('Email', data);
      // }
    }
    if (this.modalMailDetail) {
      this.modalMailDetail.close();
      this.modalMailDetail = null;
    }
  }

  private replaseItemFromLocalObj() {
    let removeCount = null;
    this.eventsObj[this.selectedItem.col].items.some((item, i) => {
      if (item.id === this.selectedItem.id) {
        removeCount = i;
        return true;
      }
    });
    if (removeCount !== null) {
      this.eventsObj[this.selectedItem.col].items.splice(removeCount, 1);
    }
    this.selectedItem = null;
  }

  // end show mail detail

  private goTaskDetail() {
    this.taskModalType = 'edit';
    this.eventsLoading = true;
    this.taskService.get(this.selectedItem.id, this.entityType).subscribe(
      (task) => {
        this.dataTask = task;
        this.openFormTask();
        this.eventsLoading = false;
      },
      (err) => {
        this.eventsLoading = false;
        console.dir(err);
      });
  }

  createLocalData(event) {
    const obj = {
      eventType: event.eventDetailType.toLowerCase(),
      assignedUser: event.assignedUser,
      text: event.subject || 'Тема письма не указана', // email title
      status: event.eventStatus.sysName.toLowerCase(), // done, new
      date: null,
      fail: null,
      id: event.eventDetailId,
      col: null,
      lastModifiedDate: null,
      lastModifiedBy: null,
    };

    if (event.eventDetailType === 'Task') {
      obj.date = event.dueDateTime;
      obj.fail = new Date(moment(event.dueDateTime).format()) < new Date();
    }

    if (event.eventStatus.sysName === 'Done') {
      let finishedDate = null;
      if (event.eventDetailType === 'Email' || event.eventDetailType === 'Sms') {
        obj.date = event.createdDate;
        finishedDate = DateUtils.parse(obj.date).toString();
      }
      if (event.eventDetailType === 'Task' && event.lastModifiedDate) {
        obj.lastModifiedDate = event.lastModifiedDate;
        obj.lastModifiedBy = event.lastModifiedBy;
        finishedDate = DateUtils.parse(obj.lastModifiedDate).toString();
      }
      const now = DateUtils.nowDate().toString();
      const yesterday = DateUtils.addDays(now, -1).toString();
      if (finishedDate === now) {
        obj.col = 'doneToday';
      } else if (finishedDate === yesterday) {
        obj.col = 'doneYesterday';
      } else {
        obj.col = 'doneBefore';
      }
    } else {
      if (event.eventDetailType === 'Email') {
        obj.date = null;
      }
      obj.col = 'planned';
    }
    this.eventsObj[obj.col].items.unshift(obj);
  }

  changeNoteText() {
    // if (this.noteText && this.noteText.length > 250) {
    //   this.message.error(`Максимальное количество символов должно быть не больше 250.`, { nzDuration: 4000 });

    // }
  }

  editNote() {
    this.noteText = this.note.text;
    this.noteEdit = true;
  }

  getNoteModel(): NoteCreate {
    return {
      text: this.note.text,
      entityType: this.entityType,
      entityId: this.entity.id,
    };
  }

  saveNote() {
    if (!this.noteText) {
      this.message.error(`Введите текст заметки`, { nzDuration: 4000 });
      return;
    }
    if (this.noteText && this.noteText.length > 250) {
      this.message.error(`Максимальное количество символов должно быть не больше 250.`, { nzDuration: 4000 });
      return;
    }
    this.note.text = this.noteText;
    const model = this.getNoteModel();
    this.eventsLoading = true;
    this.noteService.create(model).subscribe((note) => {
      this.note.assignedUser = note.assignedUser;
      this.note.createdDate = note.createdDate;
      this.cancelNote();
      this.eventsLoading = false;
    }, (err) => {
      this.eventsLoading = false;
      console.log(err);
    });
  }

  cancelNote() {
    this.noteEdit = false;
  }

  // send message
  sendMsg(type) {
    if (this.isContactSMS) {
      this.createMsgData(type);

      this.modalMsgForm = this.modalService.create({
        nzTitle: null,
        nzClosable: false,
        nzMaskClosable: false,
        nzContent: this.formMsgModalContent,
        nzFooter: null,
        nzWidth: '600px',
      });
    }
  }

  closeModalMsgForm(data) {
    if (data.type === 'email' && data.data) {
      // this.createEventDataFromMsgResponse('Email', data);
    }
    if (data.type === 'sms' && data.data) {
      this.createEventDataFromMsgResponse('Sms', data);
    }
    if (this.modalMsgForm) {
      this.modalMsgForm.close();
    }
  }

  createEventDataFromMsgResponse(type, data) {
    const res = {
      eventDetailType: type,
      assignedUser: data.data.assignedUser,
      subject: data.data.subject,
      eventStatus: data.data.eventStatus,
      createdDate: data.data.createdDate,
      eventDetailId: data.data.id,
    };
    this.createLocalData(res);
  }

  private createMsgData(typeMsg) {
    this.msgData = {
      type: typeMsg,
      entityId: this.entity.id,
      entityType: this.entityType,
      to: typeMsg === 'email' ? this.contact.email : this.contact.phone,
    };
  }

  // end send message

  // task form
  openModalTaskForm() {
    this.taskModalType = 'create';
    this.dataTask = this.dataForCreateTask;
    this.openFormTask();
  }

  private openFormTask() {
    this.modalTaskForm = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: this.formTaskModalContent,
      nzFooter: null,
      nzWidth: '600px',
    });

  }

  closeModalTaskForm(data) {
    const task = data.data;
    if (task && task.taskId) {
      if (this.taskModalType === 'edit') {
        this.eventUpdated.emit({
          eventType: this.selectedItem.eventType,
          prevValue: this.selectedItem,
          newValue: task,
        });
        this.replaseItemFromLocalObj();
      }
      const res = {
        eventDetailType: 'Task',
        assignedUser: data.data.assignedUser,
        subject: data.data.subject,
        eventStatus: data.data.taskStatus,
        dueDateTime: data.data.dueDateTime,
        eventDetailId: data.data.taskId,
        createdDate: data.data.createdDate,
        lastModifiedDate: data.data.lastModifiedDate,
        lastModifiedBy: data.data.lastModifiedBy,
      };
      this.createLocalData(res);
    }
    this.modalTaskForm.close();
    this.modalTaskForm = null;
  }

  // end task form
}
