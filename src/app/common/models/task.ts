import { TaskResponse } from '@common/interfaces/Task-response';
import { Entity } from '@common/interfaces/Entity';
import { AssignedUser } from '@common/interfaces/Assigned-user';
import { ContactInfo } from '@common/interfaces/Contact-info';
import { TaskItem } from '@common/interfaces/Task-item';
import { Status } from '@common/interfaces/Status';
import * as moment from 'moment';

export class Task implements TaskItem {
  subject: string;
  description: string;
  taskId: string;
  priority: string;
  dueDateTime: Date;
  entityType: string;
  entity: Entity;
  assignedUser: AssignedUser;
  eventStatusId: string;
  contact: ContactInfo;
  failed: boolean;
  taskStatus: Status;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;

  constructor(data: TaskResponse) {
    this.subject = data.subject;
    this.description = data.description;
    this.taskId = data.eventDetailId;
    this.priority = 'First';
    this.dueDateTime = new Date(moment(data.dueDateTime).format());
    this.entityType = data.entityType;
    this.entity = data.entity;
    this.assignedUser = data.assignedUser;
    this.eventStatusId = data.eventStatus.id;
    this.contact = data.contact;
    this.failed = this.dueDateTime < new Date();
    this.taskStatus = data.taskStatus;
    this.createdDate = data.createdDate;
    this.lastModifiedBy = data.lastModifiedBy;
    this.lastModifiedDate = data.lastModifiedDate;
  }
}
