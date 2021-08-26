import { Entity } from '@common/interfaces/Entity';

export interface DocumentResponse {
  id: string;
  fileName: string;
  attachmentId: string;
  createdBy: Entity;
  createdDate: string;
  lastModifiedBy: Entity;
  lastModifiedDate: string;
  documentType: Entity;
  tempAttachmentId?: string;
}
