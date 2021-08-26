import { AssignedUser } from '@common/interfaces/Assigned-user';
import { Status } from '@common/interfaces/Status';
import { ContactInfo } from '@common/interfaces/Contact-info';
import { Entity } from '@common/interfaces/Entity';

export interface EventResponse {
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
}

