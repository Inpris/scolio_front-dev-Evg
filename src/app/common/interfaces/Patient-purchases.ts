import { Entity } from '@common/interfaces/Entity';

export interface PatientPurchases {
  id: string;
  noticeNumber: string;
  purchaseStatus: Entity;
}
