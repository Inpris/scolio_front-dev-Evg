import { PatientDeviceResponse } from '@common/interfaces/Patient-device-response';
import { Entity } from '@common/interfaces/Entity';
import { Product } from '@common/models/product';
import { Service } from '@common/models/service';

export class PatientDevice {
  purchaseDevice: Product;
  given: number;
  inWork: number;
  reserved: number;
  remain: number;
  comment: string;
  createdBy: Entity;
  lastModifiedBy: Entity;
  createdDate: string;
  lastModifiedDate: string;
  medicalService?: Service;

  constructor(data: PatientDeviceResponse) {
    this.purchaseDevice = data.purchaseDevice ? new Product(data.purchaseDevice) : null;
    this.given = data.given;
    this.inWork = data.inWork;
    this.reserved = data.reserved;
    this.remain = data.remain;
    this.comment = data.comment;
    this.createdBy = data.createdBy;
    this.lastModifiedBy = data.lastModifiedBy;
    this.createdDate = data.createdDate;
    this.lastModifiedDate = data.lastModifiedDate;
    this.medicalService = data.medicalsService;
  }
}
