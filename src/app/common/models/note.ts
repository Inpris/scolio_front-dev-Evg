import { NoteResponse } from '@common/interfaces/Note-response';
import { AssignedUser } from '@common/interfaces/Assigned-user';
import * as moment from 'moment';

export class Note {
  text: string;
  dueDateTime: Date;
  entityType: string;
  entityId: string;
  assignedUser: AssignedUser;
  eventStatusId: string;
  createdDate: Date;

  constructor(data: NoteResponse) {
    this.text = data.text;
    this.dueDateTime = new Date(moment(data.dueDateTime).format());
    this.entityType = data.entityType;
    this.entityId = data.entityId;
    this.assignedUser = data.assignedUser;
    this.eventStatusId = data.eventStatus.id;
    this.createdDate = new Date(moment(data.createdDate).format());
  }
}
