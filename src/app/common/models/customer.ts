import { CustomerResponse } from '@common/interfaces/Customer-response';
import { Company } from '@common/interfaces/Company';
import { CustomerDirector } from '@common/interfaces/Customer-director';
import { TenderDepartmentContact } from '@common/interfaces/Tender-department-contact';
import { TsrDepartmentContact } from '@common/interfaces/Tsr-department-contact';
import { Entity } from '@common/interfaces/Entity';

export class Customer {
  id: string;
  company: Company;
  director: CustomerDirector;
  tenderDepartmentContact: TenderDepartmentContact;
  tsrDepartmentContact: TsrDepartmentContact;
  diffHours: number;
  comment: string;
  warningText: string;
  isStacionar: boolean;
  isDeleted: boolean;
  createdBy: Entity;
  createdDate: string;
  lastModifiedBy: Entity;
  lastModifiedDate: string;

  constructor(data: CustomerResponse) {
    this.id = data.id;
    this.company = data.company;
    this.director = data.director;
    this.tenderDepartmentContact = data.tenderDepartmentContact;
    this.tsrDepartmentContact = data.tsrDepartmentContact;
    this.diffHours = data.diffHours;
    this.comment = data.comment;
    this.isStacionar = data.isStacionar;
    this.isDeleted = data.isDeleted;
    this.createdBy = data.createdBy;
    this.createdDate = data.createdDate;
    this.lastModifiedBy = data.lastModifiedBy;
    this.lastModifiedDate = data.lastModifiedDate;
    this.warningText = data.warningText;
  }
}

