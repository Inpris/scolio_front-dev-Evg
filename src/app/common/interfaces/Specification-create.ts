import { Entity } from '@common/interfaces/Entity';

export interface SpecificationCreate {
  id: string;
  name: string;
  count: number;
  price: number;
  note: string;
  code: string;
  manufacturer: string;
}
