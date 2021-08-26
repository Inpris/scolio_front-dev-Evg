import { Entity } from '@common/interfaces/Entity';

export interface SpecificationResponse {
  id: string;
  name: string;
  count: number;
  note: string;
  createdBy: Entity;
  lastModifiedBy: Entity;
  createdDate: string;
  lastModifiedDate: string;
  isDeleted: boolean;
  code: string;
  manufacturer: string;
  price: number;
  totalAmount: number;
}
