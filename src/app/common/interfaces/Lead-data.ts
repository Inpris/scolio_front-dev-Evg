import { LeadItem } from '@common/interfaces/Lead-item';
import { Status } from '@common/interfaces/Status';
import { PageParams } from '@common/interfaces/Page-params';

export interface LeadData {
  NotProcessed: {
    items: LeadItem[];
    pageParams: PageParams;
  };
  Processing: {
    items: LeadItem[];
    pageParams: PageParams;
  };
  BecamePatient: {
    items: LeadItem[];
    pageParams: PageParams;
  };
  statusesList: Status[];
}
