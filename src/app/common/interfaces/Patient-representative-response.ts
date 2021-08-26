import { ContactPassport } from './Contact-passport';
import { AssignedUser } from './Assigned-user';
import { Communication } from '@common/models/communication';

export interface PatientRepresentativeResponse {
  id?: string;
  representativeId?: string;
  firstName: string;
  secondName: string;
  lastName: string;
  birthDate: string;
  gender: number;
  phone: string;
  email: string;
  communications?: Communication[];
  address: any;
  passport: ContactPassport;
  comment: string;
  patientAffiliation: string;
  defaultAgent: boolean;
  createdDate: string;
  createdBy: AssignedUser;
  lastModifiedDate: string;
  lastModifiedBy: AssignedUser;
}
