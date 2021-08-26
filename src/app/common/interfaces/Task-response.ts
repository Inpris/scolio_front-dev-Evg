import { AssignedUser } from '@common/interfaces/Assigned-user';
import { Status } from '@common/interfaces/Status';
import { Entity } from '@common/interfaces/Entity';
import { ContactInfo } from '@common/interfaces/Contact-info';

export interface TaskResponse {
  subject: string;
  description: string;
  eventDetailId: string;
  dueDateTime: string;
  entityType: string;
  entity: Entity;
  assignedUser: AssignedUser;
  eventStatus: Status;
  contact: ContactInfo;
  taskStatus: Status;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}
