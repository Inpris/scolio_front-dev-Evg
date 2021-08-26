import { MailResponse } from '../interfaces/Mail-response';
import { MailAttachment } from '../interfaces/Mail-attachment';
import { MailItem } from '../interfaces/Mail-item';
import { AssignedUser } from '@common/interfaces/Assigned-user';
import { Status } from '@common/interfaces/Status';

export class Mail implements MailItem {
  id: string;
  from: string;
  fromName: string;
  to: string;
  subject: string;
  dateTime: string;
  attachments: MailAttachment[];
  checked: boolean;
  emailStatus: string;
  entity: {
    name: string;
    id: string;
    type: string;
  } = {
    name: null,
    id: null,
    type: null,
  };
  htmlBody: string;
  inReplyToMessageId: string;
  isDeleted: boolean;
  assignedUser: AssignedUser;
  eventStatus: Status;
  createdDate: string;

  constructor(data: MailResponse) {
    this.id = data.id;
    this.from = data.from;
    this.fromName = data.fromName;
    this.entity.name = data.entityName;
    this.entity.id = data.entityId;
    this.entity.type = data.entityType;

    this.subject = data.subject || 'Без темы';
    this.dateTime = data.dateTime;
    this.attachments = data.attachments;
    this.checked = false;
    this.htmlBody = data.htmlBody;
    this.to = data.to;
    this.inReplyToMessageId = data.messageId;
    this.emailStatus = data.emailStatus;
    this.isDeleted = data.isDeleted;
    this.assignedUser = data.assignedUser;
    this.eventStatus = data.eventStatus;
    this.createdDate = data.createdDate;
  }
}
