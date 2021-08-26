import { Status } from '@common/interfaces/Status';
import { AssignedUser } from '@common/interfaces/Assigned-user';

export interface SmsResponse {
  id: string;
  phone: string;
  message: string;
  smsId: string;
  isDeleted: boolean;
  eventId: string;
  eventDetailType: string;
  eventDetailId: string;
  entityId: string;
  entity: any;
  contact: any;
  entityType: string;
  entityName: string;
  eventStatus: Status;
  assignedUser: AssignedUser;
  subject: any;
  dueDateTime: any;
  parentId: string;
  createdDate: string;
  createdBy: AssignedUser;
  lastModifiedDate: string;
  lastModifiedBy: AssignedUser;
}
