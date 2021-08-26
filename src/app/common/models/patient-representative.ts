import { PatientRepresentativeResponse } from '@common/interfaces/Patient-representative-response';
import { ContactPassportModel } from '@common/interfaces/Contact-passport';
import { AssignedUser } from '@common/interfaces/Assigned-user';
import { Communication } from './communication';

export class PatientRepresentative {
  id: string;
  representativeId: string;
  firstName: string;
  secondName: string;
  lastName: string;
  birthDate: string;
  gender: number;
  phone: string;
  email: string;
  communications: Communication[];
  address: any;
  passport: ContactPassportModel;
  comment: string;
  patientAffiliation: string;
  defaultAgent: boolean;
  createdDate?: string;
  createdBy?: AssignedUser;
  lastModifiedDate?: string;
  lastModifiedBy?: AssignedUser;

  constructor(data: PatientRepresentativeResponse) {
    this.id = data.id;
    this.representativeId = data.representativeId;
    this.firstName = data.firstName;
    this.secondName = data.secondName;
    this.lastName = data.lastName;
    this.birthDate = data.birthDate != null && data.birthDate !== '0001-01-01T00:00:00' ? data.birthDate : null;
    this.gender = data.gender;
    this.phone = data.phone;
    this.email = data.email;
    this.communications = data.communications;
    this.address = data.address;
    this.passport = new ContactPassportModel(data.passport);
    this.comment = data.comment;
    this.patientAffiliation = data.patientAffiliation;
    this.defaultAgent = data.defaultAgent;
    this.createdDate = data.createdDate;
    this.createdBy = data.createdBy;
    this.lastModifiedDate = data.lastModifiedDate;
    this.lastModifiedBy = data.lastModifiedBy;
  }
}
