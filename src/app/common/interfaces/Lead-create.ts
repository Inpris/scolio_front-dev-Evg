import { Roistat } from '@common/interfaces/Roistat';
import { UtmTags } from '@common/interfaces/Utm-tags';

export interface LeadCreate {
  id?: string;
  contactId?: string;
  title: string;
  firstName: string;
  lastName: string;
  secondName: string;
  birthday: string;
  phone: string;
  email: string;
  address: string;
  comment: string;
  leadSourceId: string; // откуда узнали о клинике
  medicalServiceId: string; // какая нужна услуга
  leadStatusId: string; // статус lead
  assignedUserId: string; // ответственный
  roistatInfo: Roistat;
  utmTags: UtmTags;
}
