import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Appointment } from '@common/models/appointment';
import { Contact, ContactsService } from '@common/services/contacts';
import { LeadItem } from '@common/interfaces/Lead-item';
import { LeadService } from '@common/services/lead.service';
import { LeadDataService } from '@common/helpers/lead-data';
import { LeadCreate } from '@common/interfaces/Lead-create';
import { SmsCreate } from '@common/interfaces/Sms-create';
import { EmailCreate } from '@common/interfaces/Email-create';
import { MsgCreate } from '@common/interfaces/Msg-create';
import { EntityTypes } from '@common/models/entity-types';


const  ENTITY_TYPE = 'lead';
@Component({
  selector: 'sl-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less'],
})


export class CardComponent implements OnInit, OnDestroy {
  @Input() lead: LeadItem ;

  @ViewChild('sheduleModalContent')
  private sheduleModalContent: any;

  @ViewChild('formTaskModalContent')
  private formTaskModalContent: any;

  @ViewChild('formMsgModalContent')
  private formMsgModalContent: any;

  modalFormLead: any;
  sheduleForm: NzModalRef;
  contact: Contact;
  modalTaskForm: NzModalRef;
  modalMsgForm: NzModalRef;
  typeMsg: string;
  showLeadSource: boolean;
  msgData: MsgCreate;
  fullNameObj: {
    lastName: string;
    firstName: string;
    secondName: string;
    birthday: string;
  };

  dataForCreateTask: any = {
    entityId: null,
    entityType: EntityTypes.LEAD,
    assignedUserId: null,
  };

  constructor(
    private modalService: NzModalService,
    private leadService: LeadService,
    private leadDataService: LeadDataService,
    private contactsService: ContactsService,
  ) {
  }

  ngOnInit() {
    this.checkUtmTags();
    this.dataForCreateTask.entityId = this.lead.id;
    this.dataForCreateTask.assignedUserId = this.lead.assignedUser.id;

    this.setFullNameVar();
  }

  private setFullNameVar() {

    const data = this.lead.leadStatus.sysName === 'BecamePatient' ?
      this.lead.contactInfo : this.lead.leadInfo;
    if (data) {
      const { lastName, firstName, secondName, birthday } = data;
      this.fullNameObj = { lastName, firstName, secondName, birthday };
    }
  }

  private checkUtmTags() {
    this.showLeadSource = Object.keys(this.lead.utmTags).every(key => !this.lead.utmTags[key]);
  }

  ngOnDestroy() {

  }

  createProcessing() {
    const statusName = 'Processing';
    this.updateLeadData(statusName);
  }


  clickWorkBtn() {
    this.createContactForForm();
  }

  private createContactForForm() {
    // если пацент уже создан, запрашиваем его
    // данные по id, иначе создаем их из данных лида

    if (this.lead.contactInfo && this.lead.contactInfo.contactId) {
      this.contactsService.getList(null, { id: this.lead.contactInfo.contactId })
        .map(response => response.data)
        .subscribe((contact) => {
          contact[0].leadId = this.lead.id;
          this.contact = contact[0];
          this.openModalSheduleForm();
        });
    } else {
      this.contact = Contact.fromLead(this.lead);
      this.openModalSheduleForm();
    }
  }

  private openModalSheduleForm() {
    this.sheduleForm = this.modalService.create({
      nzTitle: null,
      nzMaskClosable: false,
      nzContent: this.sheduleModalContent,
      nzFooter: null,
      nzWidth: '100%',
    });
  }

  // вызывается после того как была создана заявка записи на прием
  public onAppointmentCreated(appointment: Appointment) {
    this.leadDataService.data.Processing.pageParams.totalCount -= 1;
    this.leadDataService.data.BecamePatient.pageParams.totalCount += 1;
    this.sheduleForm.close();
  }

  private getLeadModel(statusName): LeadCreate {
    const {
      id,
      title,
      comment,
      roistatInfo,
      utmTags,
    } = this.lead;

    return {
      id,
      title,
      comment,
      roistatInfo,
      utmTags,
      phone: this.lead.leadInfo.phone,
      email: this.lead.leadInfo.email,
      address: null,
      firstName: this.lead.leadInfo.firstName,
      lastName: this.lead.leadInfo.lastName,
      secondName: this.lead.leadInfo.secondName,
      birthday: this.lead.leadInfo.birthday,
      leadSourceId: this.lead.leadSource.id,
      medicalServiceId: this.lead.medicalService ? this.lead.medicalService.id : null,
      assignedUserId: this.lead.assignedUser.id,
      leadStatusId: this.getStatusId(statusName),
      contactId: this.lead.contactInfo && this.lead.contactInfo.contactId ? this.lead.contactInfo.contactId : null,
    };
  }

  private getStatusId(statusName: string) {
    let result = '';
    this.leadDataService.data.statusesList.forEach((status) => {
      if (status.sysName === statusName) { result = status.id; }
    });
    return result;
  }

  private updateCountColumn(status: string) {
    if (status === 'Processing') {
      this.leadDataService.data.NotProcessed.pageParams.totalCount -= 1;
      this.leadDataService.data.Processing.pageParams.totalCount += 1;
    }
  }

  private updateLeadData(statusName) {
    const model = this.getLeadModel(statusName);
    this.leadService.update(model).subscribe((lead) => {
      this.updateCountColumn(statusName);
    }, (err) => {
      console.log(err);
    });
  }

  // task form
  public openModalTaskForm() {
    this.modalTaskForm = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: this.formTaskModalContent,
      nzFooter: null,
      nzWidth: 600,
    });
  }

  closeModalTaskForm(data) {
    this.modalTaskForm.close();
  }
  // end task form

  // send message
  sendMsg(type) {
    if (this.lead.leadInfo.phone) {
      this.typeMsg = type;
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

  closeModalMsgForm(flag) {
    this.modalMsgForm.close();
  }

  private createMsgData(typeMsg) {
    this.msgData = {
      type: typeMsg,
      entityId: this.lead.id,
      entityType: ENTITY_TYPE, // либо lead, либо email
      to: typeMsg === 'email' ? this.lead.leadInfo.email : this.lead.leadInfo.phone,
    };

  }
  // end send message
  public get phoneTooltip() {
    switch (true) {
      case !this.lead.leadInfo: return '';
      case !this.lead.leadInfo.phone: return 'Не указан номер телефона контакта';
      case !!this.lead.leadInfo.phone: return this.lead.leadInfo.phone;
      default: return '';
    }
  }

  public get smsTooltip() {
    switch (true) {
      case !this.lead.leadInfo: return '';
      case !this.lead.leadInfo.phone: return 'Не указан номер телефона контакта';
      case !!this.lead.leadInfo.phone: return 'Отправить SMS';
      default: return '';
    }
  }
}
