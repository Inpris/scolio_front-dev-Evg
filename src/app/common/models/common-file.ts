import { FileResponse } from '@common/interfaces/File-response';
import { Entity } from '@common/interfaces/Entity';

export class CommonFile {
  id: string;
  fileName: string;
  createdBy: Entity;
  createdDate: string;
  lastModifiedBy: Entity;
  lastModifiedDate: string;
  tempAttachmentId: string;
  attachmentId: string;
  get contentURI() {
    return `/api/v1/files/${
      this.isTemp
        ? 'temp/' + this.tempAttachmentId
        : this.attachmentId
      }`;
  }
  get isTemp() {
    return !Boolean(this.id);
  }

  constructor(data: FileResponse) {
    this.id = data.id;
    this.fileName = data.fileName;
    this.createdBy = data.createdBy;
    this.createdDate = data.createdDate;
    this.lastModifiedBy = data.lastModifiedBy;
    this.lastModifiedDate = data.lastModifiedDate;
    this.tempAttachmentId = data.tempAttachmentId;
    this.attachmentId = data.attachmentId;
  }
}

