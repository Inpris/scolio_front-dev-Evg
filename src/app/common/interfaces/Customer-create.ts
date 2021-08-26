import { Entity } from '@common/interfaces/Entity';
import { CustomerDirector } from '@common/interfaces/Customer-director';
import { Company } from '@common/interfaces/Company';
import { TenderDepartmentContact } from '@common/interfaces/Tender-department-contact';
import { TsrDepartmentContact } from '@common/interfaces/Tsr-department-contact';

export interface CustomerCreate {
  company: Company;
  director: CustomerDirector;
  tenderDepartmentContact: TenderDepartmentContact;
  tsrDepartmentContact: TsrDepartmentContact;
  diffHours: number;
  comment: string;
  warningText: string;
  isStacionar: boolean;
}
