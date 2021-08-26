import { extract } from '@common/utils/object';
import { Contact, ContactResponse } from '@common/models/contact';
import { Company } from '@common/models/company';

export interface ContractCreateRequest {
  contractNumber: string;
  contractDate: string;
  expirationDate: string;
  note: string;
  contractTypeId: string;
  dealId: string;
  contactContragentId: string;
  companyContragentId: string;
}

export interface ContractUpdateRequest extends ContractCreateRequest {
  id: string;
}

export class Contract {
  public id: string;
  public contractNumber: string;
  public contractDate: string;
  public expirationDate: string;
  public note: string;
  public contractTypeId: string;
  public dealId: string;
  public contactContragent: Contact;
  public companyContragent: Company;
  public products: any[];

  constructor(data: Contract) {
    this.id = data.id;
    this.contractNumber = data.contractNumber;
    this.contractDate = data.contractDate;
    this.expirationDate = data.expirationDate;
    this.note = data.note;
    this.contractTypeId = data.contractTypeId;
    this.dealId = data.dealId;
    this.contactContragent = data.contactContragent ? new Contact(data.contactContragent as ContactResponse) : null;
    this.companyContragent = data.companyContragent ? new Company(data.companyContragent) : null;
    this.products = data.products;
  }

  public toUpdateRequest(isEditMode: boolean = false): ContractUpdateRequest {
    return {
      id: this.id,
      contractNumber: this.contractNumber,
      contractDate: this.contractDate,
      expirationDate: this.expirationDate,
      note: this.note,
      contactContragentId: isEditMode ? extract(this.contactContragent, 'representativeId') : extract(this.contactContragent, 'id'),
      companyContragentId: extract(this.companyContragent, 'id'),
      contractTypeId: this.contractTypeId,
      dealId: this.dealId,
    };
  }
}
