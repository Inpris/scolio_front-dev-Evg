import { DateUtils } from '@common/utils/date';
import { LeadSource } from '@common/interfaces/Lead-source';
import { Contact } from '@common/models/contact';
import { Room } from '@common/models/room';
import { Service } from '@common/models/service';
import { DefaultVisitReason, VisitReason } from '@common/models/visit-reason';
import { AppointmentContact } from '../interfaces/Appointment-contact';
import { UtmTags } from '@common/interfaces/Utm-tags';
import { Doctor } from '@common/models/doctor';
import { Region } from '@common/models/region';
import * as moment from 'moment';
import { extract } from '@common/utils/object';

export type AppointmentStatus = 'NotConfirmed' | 'Confirmed' | 'PatientCome' | 'WaitApprove';

export interface AppointmentResponse {
  id: string;
  contact: AppointmentContact;
  service: Service;
  visitReason: VisitReason;
  room: Room;
  dateTime: string;
  leadSource: LeadSource;
  status: AppointmentStatus;
  comment: string;
  doctor: Doctor;
  utmTags: UtmTags;
  region: Region;
  createdBy: User;
  lastModifiedBy: User;
  createdDate: Date;
  lastModifiedDate: Date;
  medicalService?: string;
  purchaseId?: string;
}


// если передаем leadId, а dealId= null, тогда создаем новое дело по лиду
// если передеаем dealId, то leadId должен быть null и тут мы добавляем к делу новую запись на прием
// если leadId = null и dealId = null, создается новое дело и в нем запись на прием
export interface AppointmentCreate {
  id?: string;
  contactId: string;
  medicalServiceId: string;
  visitReasonId?: string;
  roomId: string;
  dateTime: string;
  leadSourceId: string;
  dealId: string;
  leadId: string;
  status: AppointmentStatus;
  comment?: string;
  doctorId?: string;
  purchaseId?: string;
}

export interface User {
  id: string;
  name: string;
  sort: number;
}

export class Appointment {
  id: string;
  service: Service;
  visitReason: VisitReason;
  room: Room;
  dateTimeStart: Date;
  dateTimeEnd: Date;
  dateTime: Date;
  status: AppointmentStatus;
  contact: Contact;
  leadSource: LeadSource;
  comment: string;
  doctor: Doctor;
  createdBy: User;
  lastModifiedBy: User;
  createdDate: Date;
  lastModifiedDate: Date;
  medicalService?: string;
  purchaseId?: string;

  constructor(data: AppointmentResponse) {
    this.id = data.id;
    this.service = data.service;
    this.medicalService = data.medicalService;
    this.visitReason = data.visitReason || DefaultVisitReason;
    this.room = data.room;
    this.leadSource = data.leadSource;
    this.dateTimeStart = new Date(moment(data.dateTime).format());
    this.dateTime = new Date(moment(data.dateTime).format());
    this.dateTimeEnd = DateUtils.addMinutes(this.dateTimeStart, this.visitReason.visitReasonTime);
    this.status = data.status;
    this.comment = data.comment;
    this.doctor = data.doctor;
    this.contact = data.contact ? new Contact(data.contact) : null;
    this.createdBy = data.createdBy;
    this.lastModifiedBy = data.lastModifiedBy;
    this.createdDate = new Date(moment(data.createdDate).format());
    this.lastModifiedDate = new Date(moment(data.lastModifiedDate).format());
    this.purchaseId = extract(data, 'purchase.id');
  }
}
