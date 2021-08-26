import { MailItem } from '../interfaces/Mail-item';
import { PageParams } from '@common/interfaces/Page-params';
import { FilterEmailParams } from '@common/interfaces/Filter-email-params';

export interface MailData {
  items: MailItem[];
  lastUpdate: Date;
  pageParams: PageParams;
  filter: FilterEmailParams;
}
