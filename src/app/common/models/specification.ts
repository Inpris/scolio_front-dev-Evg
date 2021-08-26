import { SpecificationResponse } from '@common/interfaces/Specification-response';
import { Entity } from '@common/interfaces/Entity';


export class Specification {
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

  constructor(data: SpecificationResponse) {
    this.id = data.id;
    this.name = data.name;
    this.count = data.count;
    this.note = data.note;
    this.createdBy =  data.createdBy;
    this.lastModifiedBy = data.lastModifiedBy;
    this.createdDate = data.createdDate;
    this.lastModifiedDate = data.lastModifiedDate;
    this.isDeleted = data.isDeleted;
    this.code = data.code;
    this.manufacturer = data.manufacturer;
    this.price = data.price;
    this.totalAmount = data.totalAmount;
  }
}
