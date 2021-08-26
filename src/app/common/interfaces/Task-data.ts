import { TaskItem } from '@common/interfaces/Task-item';
import { Status } from '@common/interfaces/Status';
import { PageParams } from '@common/interfaces/Page-params';

export interface TaskData {
  // items: TaskItem[];
  New: {
    items: TaskItem[];
    pageParams: PageParams;
  };
  Worked: {
    items: TaskItem[];
    pageParams: PageParams;
  };
  Done: {
    items: TaskItem[];
    pageParams: PageParams;
  };
  statusesList: Status[];
  eventStatusesList: Status[];
}
