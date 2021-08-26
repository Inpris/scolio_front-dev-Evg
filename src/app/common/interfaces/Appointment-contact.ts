import { ContactPassport } from './Contact-passport';
import { LeadSource } from '@common/interfaces/Lead-source';
import { Entity } from '@common/interfaces/Entity';
import { Region } from '@common/models/region';
import { AssignedUser } from '@common/interfaces/Assigned-user';

export interface AppointmentContact {
  id: string;
  lastName: string;
  firstName: string;
  secondName: string;
  birthDate: string;
  phone: string;
  email: string;
  passport: ContactPassport;
  address: string;
  leadSource: LeadSource;
  company: Entity;
  acceptDataProcessing: true;
  acceptSms: boolean;
  acceptOrthoses: boolean;
  visitCount: number;
  gender: number;
  region: Region;
  createdDate: string;
  createdBy: AssignedUser;
  lastModifiedDate: string;
  lastModifiedBy: AssignedUser;
}
