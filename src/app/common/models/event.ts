import { AssignedUser } from '@common/interfaces/Assigned-user';
import { Status } from '@common/interfaces/Status';
import { ContactInfo } from '@common/interfaces/Contact-info';
import { Entity } from '@common/interfaces/Entity';
import { EventResponse } from '@common/interfaces/Event-response';

export class Event {
  assignedUser: AssignedUser;
  contact: ContactInfo;
  createdBy: Entity;
  createdDate: string;
  dueDateTime: string;
  entity: Entity;
  entityId: string; // id контакта или лида
  entityType: string; // например lead или contact
  eventDetailId: string;  // id письма
  eventDetailType: string;  // например Email, Task
  eventId: string;
  eventStatus: Status;
  lastModifiedBy: Entity;
  lastModifiedDate: string;
  parentId: string;
  subject: string;

  constructor(data: EventResponse) {
    this.assignedUser = data.assignedUser;
    this.contact = data.contact;
    this.createdBy = data.createdBy;
    this.createdDate = data.createdDate;
    this.dueDateTime = data.dueDateTime;
    this.entity = data.entity;
    this.entityId = data.entityId;
    this.entityType = data.entityType;
    this.eventDetailId = data.eventDetailId;
    this.eventDetailType = data.eventDetailType;
    this.eventId = data.eventId;
    this.eventStatus = data.eventStatus;
    this.lastModifiedBy = data.lastModifiedBy;
    this.lastModifiedDate = data.lastModifiedDate;
    this.parentId = data.parentId;
    this.subject = data.subject;
  }
}
