import { Entity } from '@common/interfaces/Entity';
import { DocumentResponse } from '@common/interfaces/Document-response';

export class DocumentItem {
  id: string;
  fileName: string;
  attachmentId: string;
  createdBy: Entity;
  createdDate: string;
  lastModifiedBy: Entity;
  lastModifiedDate: string;
  documentType: Entity;
  tempAttachmentId: string;

  constructor(data: DocumentResponse) {
    this.id = data.id;
    this.fileName = data.fileName;
    this.attachmentId = data.attachmentId;
    this.createdBy = data.createdBy;
    this.documentType = data.documentType;
    this.createdDate = data.createdDate;
    this.lastModifiedBy = data.lastModifiedBy;
    this.lastModifiedDate = data.lastModifiedDate;
    this.tempAttachmentId = data.tempAttachmentId;
  }
}

