import { LeadSource } from '@common/interfaces/Lead-source';
import { SearchUtils } from '@common/utils/search';
import { LeadItem } from '@common/interfaces/Lead-item';
import { ContactPassport, ContactPassportModel } from '../interfaces/Contact-passport';
import { Address } from '@common/models/address';
import { Communication } from '@common/models/communication';
import { AssignedUser } from '@common/interfaces/Assigned-user';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import * as moment from 'moment';
import { extract } from '@common/utils/object';
import { DateUtils } from '@common/utils/date';

export interface ContactCreate {
  lastName: string;
  firstName: string;
  secondName: string;
  birthDate: string;
  phone: string;
  email: string;
  passport: ContactPassport;
  address: any; // AddressCreate TODO;
  leadSourceId: string;
  acceptDataProcessing: boolean;
  acceptOrthoses: boolean;
  acceptSms: boolean;
  leadId?: string;
  contactTypeSysNames?: string[];
  problemPatient?: boolean;
  hasInvalidGroup?: boolean;
  comment?: string;
  communications?: Communication[];
  contactTypeSysName?: string;
  assignedUserId?: string;
}

export interface ContactResponse {
  id?: string;
  leadId?: string;
  contactId?: string;
  lastName: string;
  firstName: string;
  secondName?: string;
  birthDate: string;
  phone: string;
  email: string;
  leadSource: LeadSource;
  acceptDataProcessing: boolean;
  acceptSms: boolean;
  acceptOrthoses: boolean;
  visitCount: number;
  isVirtual?: boolean;
  gender: number;
  passport: ContactPassportModel;
  problemPatient?: boolean;
  hasInvalidGroup?: boolean;
  address: any; // TODO Address;
  comment?: string;
  communications?: Communication[];
  assignedUser?: AssignedUser;
  createdDate: string;
  createdBy: AssignedUser;
  lastModifiedDate: string;
  lastModifiedBy: AssignedUser;
  contactTypes?: EntityWithSysName[];
  representativeId?: string;
  defaultAgent?: boolean;
  reprisetativeComment?: string;
  patientAffiliation?: string;
  nextAppointments?: string;
  offerAppointments?: string;
}

export class Contact {
  id: string;
  lastName: string;
  firstName: string;
  secondName: string;
  birthDate: Date | string;
  phone: string;
  email: string;
  leadSource: LeadSource;
  acceptDataProcessing: boolean;
  acceptSms: boolean;
  acceptOrthoses: boolean;
  visitCount: number;
  isVirtual: boolean;
  leadId: string;
  contactId: string;
  gender: number;
  address: Address;
  problemPatient: boolean;
  hasInvalidGroup: boolean;
  comment: string;
  communications: Communication[];
  assignedUser: AssignedUser;
  createdDate: string;
  createdBy: AssignedUser;
  lastModifiedDate: string;
  lastModifiedBy: AssignedUser;
  contactTypes: EntityWithSysName[];
  passport: ContactPassportModel;
  representativeId: string;
  defaultAgent: boolean;
  reprisetativeComment: string;
  patientAffiliation: string;
  nextAppointments: string;
  offerAppointments: string;

  get name() {
    return `${(this.lastName) ? this.lastName : ''} ${(this.firstName[0]) ? this.firstName[0] + '. ' : ''} ${this.secondName.length > 0 ? this.secondName[0] + '.' : ''}`.trim();
  }

  get fullName() {
    return `${(this.lastName) ? this.lastName : ''} ${(this.firstName) ? this.firstName : ''} ${(this.secondName) ? this.secondName : ''}`.trim();
  }

  constructor(data: ContactResponse) {
    this.id = data.id;
    this.firstName = data.firstName != null ? data.firstName : '';
    this.secondName = data.secondName != null ? data.secondName : '';
    this.lastName = data.lastName != null ? data.lastName : '';
    this.birthDate = data.birthDate != null && data.birthDate !== '0001-01-01T00:00:00' ?
      new Date(moment(data.birthDate).format())
      : null;
    this.phone = data.phone;
    this.email = data.email;
    this.leadSource = data.leadSource;
    this.acceptDataProcessing = Boolean(data.acceptDataProcessing);
    this.acceptSms = Boolean(data.acceptSms);
    this.acceptOrthoses = Boolean(data.acceptOrthoses);
    this.isVirtual = data.isVirtual != null ? data.isVirtual : false;
    this.visitCount = data.visitCount != null ? data.visitCount : 0;
    this.leadId = data.leadId;
    this.contactId = data.contactId;
    this.gender = data.gender;
    this.address = data.address;
    this.communications = data.communications;
    this.problemPatient = data.problemPatient;
    this.comment = data.comment;
    this.assignedUser = data.assignedUser;
    this.createdDate = data.createdDate;
    this.createdBy = data.createdBy;
    this.lastModifiedDate = data.lastModifiedDate;
    this.lastModifiedBy = data.lastModifiedBy;
    this.hasInvalidGroup = data.hasInvalidGroup;
    this.contactTypes = data.contactTypes;
    this.passport = data.passport ? new ContactPassportModel(data.passport) : null;
    this.representativeId = data.representativeId;
    this.defaultAgent = data.defaultAgent;
    this.reprisetativeComment = data.reprisetativeComment;
    this.patientAffiliation = data.patientAffiliation;
    this.nextAppointments = data.nextAppointments;
    this.offerAppointments = data.offerAppointments;
  }

  static fromSearch(searchTerm: string) {
    const { lastName, firstName, secondName } = SearchUtils.extractName(searchTerm);
    return new Contact({
      lastName,
      firstName,
      secondName,
      birthDate: null,
      phone: null,
      email: null,
      leadSource: null,
      acceptDataProcessing: false,
      acceptSms: false,
      acceptOrthoses: false,
      visitCount: 0,
      isVirtual: true,
      gender: null,
      address: null,
      communications: [],
      problemPatient: false,
      comment: null,
      createdDate: null,
      createdBy: null,
      lastModifiedDate: null,
      lastModifiedBy: null,
      passport: null,
    });
  }

  static fromLead(data: LeadItem) {
    return new Contact({
      lastName: data.leadInfo.lastName,
      firstName: data.leadInfo.firstName,
      secondName: data.leadInfo.secondName,
      birthDate: data.leadInfo.birthday,
      phone: data.leadInfo.phone,
      email: data.leadInfo.email,
      leadSource: data.leadSource,
      acceptDataProcessing: false,
      acceptSms: false,
      acceptOrthoses: false,
      visitCount: 0,
      isVirtual: data.leadInfo.contactId == null,
      leadId: data.id,
      contactId: data.leadInfo.contactId,
      gender: null,
      address: null,
      communications: [],
      problemPatient: false,
      comment: null,
      createdDate: null,
      createdBy: null,
      lastModifiedDate: null,
      lastModifiedBy: null,
      passport: null,
    });
  }

  public toUpdateRequest(): ContactCreate {
    return {
      lastName: this.lastName,
      firstName: this.firstName,
      secondName: this.secondName,
      birthDate: this.birthDate ? DateUtils.toISODateString(this.birthDate) : null,
      phone: this.phone,
      email: this.email,
      address: this.address && {
        ...this.address,
        regionId: extract(this, 'address.region.id'),
        cityId: extract(this, 'address.city.id'),
      },
      leadSourceId: extract(this.leadSource, 'id'),
      acceptDataProcessing: this.acceptDataProcessing,
      acceptOrthoses: this.acceptOrthoses,
      acceptSms: this.acceptSms,
      leadId: this.leadId,
      contactTypeSysNames: Array.isArray(this.contactTypes) ?
        this.contactTypes.map(type => type.sysName)
        : [],
      problemPatient: this.problemPatient,
      hasInvalidGroup: this.hasInvalidGroup,
      comment: this.comment,
      communications: this.communications,
      assignedUserId: extract(this.assignedUser, 'id'),
      passport: this.passport ? { ...this.passport, number: this.passport.serialNumber } : null,
    };
  }
}

