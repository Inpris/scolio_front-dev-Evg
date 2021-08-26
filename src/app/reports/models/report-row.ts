import { ReportCell } from '@modules/reports/models/report-cell';

export type ReportRow<T extends object> = ReportCell<T>[];
