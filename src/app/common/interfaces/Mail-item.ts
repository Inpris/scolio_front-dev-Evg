import { MailAttachment } from './Mail-attachment';
import { AssignedUser } from '@common/interfaces/Assigned-user';
import { Status } from '@common/interfaces/Status';
export interface MailItem {
  id: string;
  from: string;
  to: string;
  fromName: string;
  subject: string;
  dateTime: string;
  attachments: MailAttachment[];
  checked: boolean;
  entity: {
    name: string,
    id: string,
    type: string,
  };
  inReplyToMessageId: string;
  htmlBody: string;
  emailStatus: string;
  isDeleted: boolean;
  assignedUser: AssignedUser;
  eventStatus: Status;
  createdDate: string;
}
