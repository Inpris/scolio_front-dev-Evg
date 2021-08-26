import { Contact, ContactResponse } from '@common/models/contact';
import { Entity } from '@common/interfaces/Entity';
import { extract } from '@common/utils/object';

export interface CompanyCreate {
  name: string;
  address: string;
  legalForm: string;
  inn: string;
  kpp: string;
  phone: string;
  otherDetails: string;
  isDeleted: string;
  proxyId: string;
  postalCode: string;
  regionId: string;
  cityId: string;
}

export interface CompanyUpdate extends CompanyCreate {
  id: string;
}

export class Company {
  id: string;
  name: string;
  address: string;
  legalForm: string;
  inn: string;
  kpp: string;
  isDeleted: string;
  phone: string;
  otherDetails: string;
  proxy: Contact;
  postalCode: string;
  region: Entity;
  city: Entity;

  constructor(data: Company) {
    this.id = data.id;
    this.name = data.name;
    this.address = data.address;
    this.legalForm = data.legalForm;
    this.inn = data.inn;
    this.kpp = data.kpp;
    this.isDeleted = data.isDeleted;
    this.phone = data.phone;
    this.otherDetails = data.otherDetails;
    this.proxy = data.proxy ? new Contact(data.proxy as ContactResponse) : null;
    this.postalCode = data.postalCode;
    this.region = data.region;
    this.city = data.city;
  }

  toUpdateRequest(): CompanyUpdate {
    return {
      id: this.id,
      name: this.name,
      address: this.address,
      legalForm: this.legalForm,
      inn: this.inn,
      kpp: this.kpp,
      phone: this.phone,
      otherDetails: this.otherDetails,
      isDeleted: this.isDeleted,
      proxyId: extract(this, 'proxy.id'),
      postalCode: this.postalCode,
      regionId: extract(this, 'region.id'),
      cityId: extract(this, 'city.id'),
    };
  }
}
