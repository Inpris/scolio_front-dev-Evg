import { ReportHeader } from '@modules/reports/models/report-header';
import { ReportColumn } from '@modules/reports/models/report-column';
import { ReportCell } from '@modules/reports/models/report-cell';
import { ReportRow } from '@modules/reports/models/report-row';

interface ReportTableSchema extends ReportHeader, ReportColumn {}
export class ReportTable<T extends object> {
  public rows: ReportRow<T>[];
  public headers: ReportHeader[];
  public width: number;
  constructor(
    public schema: ReportTableSchema[],
  ) {
    this.headers = schema.map(el => ({
      width: el.width,
      title: el.title,
      filterType: el.filterType,
      filterField: el.filterField,
      stickyLeft: el.stickyLeft,
      filterService: el.filterService,
      filterDataFactory: el.filterDataFactory,
      filterMulti: el.filterMulti,
      filterValueField: el.filterValueField,
    }));

    this.width = this.headers.reduce((acc, el) => acc + el.width, 0);
  }

  public buildRows(data: T[]) {
    return data.map(
      item =>
        this.schema.map(
          column =>
            new ReportCell(item, column.path, column.formatterType, column.customFormatter),
        ),
    );
  }

}
