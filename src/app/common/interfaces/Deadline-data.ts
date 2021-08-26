import { PageParams } from '@common/interfaces/Page-params';
import { Purchase } from '@common/models/purchase';

export interface DeadlineData {
  items: Purchase[];
  pageParams: PageParams;
  deadlineDays: number;
  isLoading: boolean;
}
