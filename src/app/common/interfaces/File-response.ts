import { Entity } from '@common/interfaces/Entity';

export interface FileResponse {
  id?: string;
  fileName: string;
  createdBy?: Entity;
  createdDate?: string;
  lastModifiedBy?: Entity;
  lastModifiedDate?: string;
  tempAttachmentId?: string;
  attachmentId?: string;
}
