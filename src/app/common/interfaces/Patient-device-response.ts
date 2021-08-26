import { ProductResponse } from '@common/interfaces/Product-response';
import { Entity } from '@common/interfaces/Entity';
import { Service } from '@common/models/service';

export interface PatientDeviceResponse {
  purchaseDevice: ProductResponse;
  given: number;
  inWork: number;
  reserved: number;
  remain: number;
  comment: string;
  createdBy: Entity;
  lastModifiedBy: Entity;
  createdDate: string;
  lastModifiedDate: string;
  medicalsService?: Service;
}
