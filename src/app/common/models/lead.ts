import { LeadResponse } from '@common/interfaces/Lead-response';
import { Status } from '@common/interfaces/Status';
import { LeadSource } from '@common/interfaces/Lead-source';
import { ContactInfo } from '@common/interfaces/Contact-info';
import { Roistat } from '@common/interfaces/Roistat';
import { Service } from '@common/models/service';
import { UtmTags } from '@common/interfaces/Utm-tags';
import { AssignedUser } from '@common/interfaces/Assigned-user';
import { AbbreviatedName } from '@common/interfaces/Abbreviated-name';
import * as moment from 'moment';

export class Lead {
  public id: string;
  public title: string;
  public leadStatus: Status = {
    id: null,
    name: null,
    sysName: null,
  };
  public leadSource: LeadSource = {
    id: null,
    name: null,
    sysName: null,
  };
  public medicalService: Service = {
    id: null,
    name: null,
    sysName: null,
  };
  public assignedUser: AssignedUser = {
    id: null,
    name: null,
  };

  public comment: string;
  public createdDate: Date;
  public createdBy: AbbreviatedName = {
    id: null,
    name: null,
  };
  lastModifiedDate: Date;
  lastModifiedBy: AbbreviatedName = {
    id: null,
    name: null,
  };

  public taskCount: number;
  public contactInfo: ContactInfo;
  public leadInfo: ContactInfo;
  public utmTags: UtmTags;
  public roistatInfo: Roistat;

  constructor(data: LeadResponse) {
    this.id = data.id;
    this.title = data.title;
    this.leadStatus.id = data.leadStatus.id;
    this.leadStatus.name = data.leadStatus.name;
    this.leadStatus.sysName = data.leadStatus.sysName;
    this.leadSource.id = data.leadSource.id;
    this.leadSource.name = data.leadSource.name;
    if (data.medicalService && data.medicalService.id) {
      this.medicalService.id = data.medicalService.id;
      this.medicalService.name = data.medicalService.name;
    } else {
      this.medicalService = null;
    }
    this.assignedUser.id = data.assignedUser.id;
    this.assignedUser.name = data.assignedUser.name;
    this.comment = data.comment;
    this.createdDate = new Date(moment(data.createdDate).format());
    if (data.createdBy && data.createdBy.name) {
      this.createdBy.name = data.createdBy.name;
      this.createdBy.id = data.createdBy.id;
    } else {
      this.createdBy = null;
    }
    this.lastModifiedDate = new Date(moment(data.lastModifiedDate).format());
    if (data.lastModifiedBy && data.lastModifiedBy.name) {
      this.lastModifiedBy.name = data.lastModifiedBy.name;
      this.lastModifiedBy.id = data.lastModifiedBy.id;
    } else {
      this.lastModifiedBy = null;
    }
    this.taskCount = data.taskCount;
    this.contactInfo = data.contactInfo;
    this.leadInfo = data.leadInfo;
    this.utmTags = data.utmTags;
    this.roistatInfo = data.roistatInfo;

  }
}
