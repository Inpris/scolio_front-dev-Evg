import { Entity } from '@common/interfaces/Entity';
import { AssignedUser } from '@common/interfaces/Assigned-user';
import { ContactInfo } from '@common/interfaces/Contact-info';
import { Status } from '@common/interfaces/Status';

export interface TaskItem {
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
  lastModifiedBy: string;
  lastModifiedDate: string;
}
