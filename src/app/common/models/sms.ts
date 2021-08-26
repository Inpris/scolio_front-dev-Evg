import { Status } from '@common/interfaces/Status';
import { SmsItem } from '@common/interfaces/Sms-item';
import { SmsResponse } from '@common/interfaces/Sms-response';
import { AssignedUser } from '@common/interfaces/Assigned-user';

export class Sms implements SmsItem {
  id: string;
  to: string;
  message: string;
  entityType: string;
  eventStatus: Status;
  dueDateTime: any;
  createdDate: string;
  isDeleted: boolean;
  assignedUser: AssignedUser;
  dateTime: string;
  entity: {
    name: string;
    id: string;
    type: string;
  } = {
    name: null,
    id: null,
    type: null,
  };


  constructor(data: SmsResponse) {
    this.id = data.id;
    this.to = data.phone;
    this.entity.name = data.entityName;
    this.entity.id = data.entityId;
    this.entity.type = data.entityType;
    this.message = data.message;
    this.dateTime = data.createdDate;
    this.isDeleted = data.isDeleted;
    this.assignedUser = data.assignedUser;
    this.eventStatus = data.eventStatus;
    this.createdDate = data.createdDate;
  }
}
