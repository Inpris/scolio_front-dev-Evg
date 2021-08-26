import { ProductResponse } from '@common/interfaces/Product-response';
import { Entity } from '@common/interfaces/Entity';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';

export class Product {
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
  disabled?: boolean;
  productType?: EntityWithSysName;

  constructor(data: ProductResponse) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.count = data.count;
    this.price = data.price;
    this.note = data.note;
    this.createdBy = data.createdBy;
    this.lastModifiedBy = data.lastModifiedBy;
    this.createdDate = data.createdDate;
    this.lastModifiedDate = data.lastModifiedDate;
    this.avalible = data.avalible;
    this.totalInWork = data.totalInWork;
    this.totalGiven = data.totalGiven;
    this.totalAmount = data.totalAmount;
    this.disabled = false;
    this.productType = data.productType;
  }
}

