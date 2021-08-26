import { Roistat } from '@common/interfaces/Roistat';
import { UtmTags } from '@common/interfaces/Utm-tags';
import { LeadSource } from '@common/interfaces/Lead-source';
import { Status } from '@common/interfaces/Status';
import { AssignedUser } from '@common/interfaces/Assigned-user';
import { Service } from '@common/models/service';
import { ContactInfo } from '@common/interfaces/Contact-info';
import { AbbreviatedName } from '@common/interfaces/Abbreviated-name';

export interface LeadItem {
  id: string;
  title: string;
  leadStatus: Status;
  leadSource: LeadSource;
  medicalService: Service;
  assignedUser: AssignedUser;
  comment: string;
  createdDate: Date;
  createdBy: AbbreviatedName;
  lastModifiedDate: Date;
  lastModifiedBy: AbbreviatedName;
  taskCount: number;
  contactInfo: ContactInfo;
  leadInfo: ContactInfo;
  utmTags: UtmTags;
  roistatInfo: Roistat;
}
