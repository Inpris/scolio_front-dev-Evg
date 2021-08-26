import { MailAttachment } from './Mail-attachment';
import { AssignedUser } from '@common/interfaces/Assigned-user';
import { Status } from '@common/interfaces/Status';

export interface MailResponse {
  id: string;
  from: string;
  fromName: string;
  to: string;
  dateTime: string;
  htmlBody: string;
  messageId: string;
  inReplyToMessageId: string;
  textBody: string;
  attachments: MailAttachment[];
  eventId: string;
  eventStatus: Status;
  eventDetailType: string;  // например email
  eventDetailId: string;  // id письма
  entityId: string; // id контакта или лида
  entityName: string; // имя контакта или лида
  entityType: string; // например lead или contact
  assignedUser: AssignedUser;
  subject: string;
  dueDateTime: string;
  parentId: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  emailStatus: string;
  isDeleted: boolean;
}

