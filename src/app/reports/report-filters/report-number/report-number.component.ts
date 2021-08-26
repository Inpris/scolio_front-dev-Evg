import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { REPORT_FILTER_OPERATOR, REPORT_QUERY_TYPES, ReportFilterQuery, ReportFilterValue } from '@modules/reports/models/report-filter-query';

@Component({
  selector: 'sl-report-number',
  templateUrl: './report-number.component.html',
  styleUrls: ['./report-number.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ReportNumberComponent, multi: true },
  ],
})
export class ReportNumberComponent {
  public filterQueryFrom = new ReportFilterQuery(REPORT_FILTER_OPERATOR.GTE, null);
  public filterQueryTo = new ReportFilterQuery(REPORT_FILTER_OPERATOR.LTE, null);
  public visible: boolean;
  public queryTypes = REPORT_QUERY_TYPES;
  public queryType = REPORT_QUERY_TYPES.RANGE;

  @Input()
  placeholder = '';
  @Input()
  title = '';
  @ViewChild('from') inputEl;

  private onChange: (_) => void;
  public registerOnChange = onChange => this.onChange = onChange;
  public registerOnTouched = () => void 0;

  constructor() {
    this.setInitialValue();
  }

  public visibleChange(value) {
    if (!value) {
      return;
    }
    setTimeout(() => this.inputEl.focus());
  }

  public writeValue(value: ReportFilterValue) {
    if (!value) { return this.setInitialValue(); }
    const { queries: [from, to], extra: queryType } = value;
    this.queryType = queryType;
    switch (queryType) {
      case REPORT_QUERY_TYPES.RANGE:
      case REPORT_QUERY_TYPES.FROM:
      case REPORT_QUERY_TYPES.TO:
        this.filterQueryFrom = new ReportFilterQuery(REPORT_FILTER_OPERATOR.GTE, from ? from.value : null);
        this.filterQueryTo = new ReportFilterQuery(REPORT_FILTER_OPERATOR.LTE, to ? to.value : null);
        break;
      case REPORT_QUERY_TYPES.EXACT:
        this.filterQueryFrom = new ReportFilterQuery(REPORT_FILTER_OPERATOR.EQ, from.value);
        break;
    }
  }

  public applyFilter(from, to) {
    this.visible = false;
    this.filterQueryFrom.value = from;
    this.filterQueryTo.value = to;
    const filterValue = new ReportFilterValue([], this.queryType);
    switch (this.queryType) {
      case REPORT_QUERY_TYPES.RANGE:
        filterValue.queries = [this.filterQueryFrom, this.filterQueryTo];
        break;
      case REPORT_QUERY_TYPES.EXACT:
        filterValue.queries = [new ReportFilterQuery(REPORT_FILTER_OPERATOR.EQ, this.filterQueryFrom.value), null];
        break;
      case REPORT_QUERY_TYPES.FROM:
        filterValue.queries = [this.filterQueryFrom, null];
        break;
      case REPORT_QUERY_TYPES.TO:
        filterValue.queries = [null, this.filterQueryTo];
        break;
    }
    this.onChange(filterValue);
  }

  public resetFilter() {
    this.visible = false;
    this.filterQueryFrom = new ReportFilterQuery(REPORT_FILTER_OPERATOR.GTE, null);
    this.filterQueryTo = new ReportFilterQuery(REPORT_FILTER_OPERATOR.LTE, null);
    this.onChange(null);
  }

  public changeType(type) {
    switch (type) {
      case REPORT_QUERY_TYPES.RANGE:
        break;
      case REPORT_QUERY_TYPES.FROM:
      case REPORT_QUERY_TYPES.EXACT:
        this.filterQueryTo.value = null;
        break;
      case REPORT_QUERY_TYPES.TO:
        this.filterQueryFrom.value = null;
        break;
    }
  }

  private setInitialValue() {
    this.filterQueryFrom = new ReportFilterQuery(REPORT_FILTER_OPERATOR.GTE, null);
    this.filterQueryTo = new ReportFilterQuery(REPORT_FILTER_OPERATOR.LTE, null);
    this.queryType = REPORT_QUERY_TYPES.RANGE;
  }
}
