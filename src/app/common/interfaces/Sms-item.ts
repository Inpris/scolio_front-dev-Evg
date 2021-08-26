import { Status } from '@common/interfaces/Status';
import { AssignedUser } from '@common/interfaces/Assigned-user';

export interface SmsItem {
  id: string;
  to: string;
  message: string;
  entityType: string;
  eventStatus: Status;
  dateTime: string;
  entity: {
    name: string,
    id: string,
    type: string,
  };
  isDeleted: boolean;
  assignedUser: AssignedUser;
}
