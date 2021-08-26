import { REPORT_COLUMN_FILTERS } from '@modules/reports/models/column-filters';

export interface ReportHeader {
  width: number;
  title: string;
  filterField?: string;
  filterValueField?: string;
  filterType?: REPORT_COLUMN_FILTERS;
  filterService?;
  filterDataFactory?;
  filterMulti?: boolean;
  stickyLeft?: number;
}
