export interface ContactPassport {
  serialNumber: string;
  number?: string;
  issueDate: Date | string;
  issueBy: string;
}

export class ContactPassportModel {
  serialNumber: string;
  issueDate: Date | string;
  issueBy: string;

  constructor(data: ContactPassport) {
    this.serialNumber = data.serialNumber;
    this.issueDate = data.issueDate != null && data.issueDate !== '0001-01-01T00:00:00' ? data.issueDate : null;
    this.issueBy = data.issueBy;
  }
}
