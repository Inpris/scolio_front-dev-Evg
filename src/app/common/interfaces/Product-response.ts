import { Entity } from '@common/interfaces/Entity';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  count: number;
  price: number;
  note: string;
  createdBy: Entity;
  lastModifiedBy: Entity;
  createdDate: string;
  lastModifiedDate: string;
  avalible: number;
  totalInWork: number;
  totalGiven: number;
  totalAmount: number;
  productType?: EntityWithSysName;
}
