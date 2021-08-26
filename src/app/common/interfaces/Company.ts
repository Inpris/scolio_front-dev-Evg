import { Entity } from '@common/interfaces/Entity';

export interface Company {
  id?: string;
  name: string;
  region: Entity;
  city: Entity;
  address: string;
  inn: string;
}
