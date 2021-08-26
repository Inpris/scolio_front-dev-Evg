import { Entity } from '@common/interfaces/Entity';


import { AssignedUser } from '@common/interfaces/Assigned-user';
import { Status } from '@common/interfaces/Status';
import { ContactInfo } from '@common/interfaces/Contact-info';

export interface NoteResponse {

  text: string;
  eventId: string;
  eventDetailType: string;
  eventDetailId: string;
  entityId: string;
  entity: Entity;
  contact: ContactInfo;
  entityType: string;
  eventStatus: Status;
  assignedUser: AssignedUser;
  subject: string;
  dueDateTime: string;
  parentId: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}
