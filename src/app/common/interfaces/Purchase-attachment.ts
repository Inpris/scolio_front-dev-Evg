import { Entity } from '@common/interfaces/Entity';

export interface PurchaseAttachment {
  id: string;
  fileName: string;
  fileType: string;
  createdBy: Entity;
  createdDate: string;
}
