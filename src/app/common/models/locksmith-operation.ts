import { Entity } from '@common/interfaces/Entity';
import { LocksmithOperationResponse } from '@common/interfaces/LocksmithOperationResponse';
import * as moment from 'moment';

export class LocksmithOperation {
  executor: Entity;
  note: string;
  start: Date;
  end: Date;
  edit: boolean;
  createdBy: Entity;
  createdDate: Date;
  lastModifiedBy: Entity;
  lastModifiedDate: Date;
  id: string;

  constructor(data: LocksmithOperationResponse) {
    this.executor = data.executor;
    this.note = data.name;
    this.start = data.start ? new Date(moment(data.start).format()) : null;
    this.end = data.end ? new Date(moment(data.end).format()) : null;
    this.edit = data.edit;
    this.createdBy = data.createdBy;
    this.createdDate = new Date(moment(data.createdDate).format());
    this.lastModifiedBy = data.lastModifiedBy;
    this.lastModifiedDate = new Date(moment(data.lastModifiedDate).format());
    this.id = data.id;
  }
}
