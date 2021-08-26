import { Component, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { REPORT_FILTER_OPERATOR, REPORT_QUERY_TYPES, ReportFilterQuery, ReportFilterValue } from '@modules/reports/models/report-filter-query';
import * as moment from 'moment';
import { DateUtils } from '@common/utils/date';

@Component({
  selector: 'sl-report-date',
  templateUrl: './report-date.component.html',
  styleUrls: ['./report-date.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ReportDateComponent, multi: true },
  ],
})
export class ReportDateComponent {
  public filterQueryFrom;
  public filterQueryTo;
  public queryType;
  public visible: boolean;
  public queryTypes = REPORT_QUERY_TYPES;

  @Input()
  placeholder = '';
  @Input()
  title = '';
  @ViewChild('input') inputEl;

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
      case REPORT_QUERY_TYPES.CURRENT_MONTH:
        [this.filterQueryFrom, this.filterQueryTo] = this.getRange('month');
        break;
    }
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
      case REPORT_QUERY_TYPES.CURRENT_MONTH:
        [this.filterQueryFrom, this.filterQueryTo] = this.getRange('month');
    }
  }
  private getRange(type: moment.unitOfTime.StartOf = 'day', from?, to?) {
    return [
      new ReportFilterQuery(REPORT_FILTER_OPERATOR.GTE, DateUtils.toISODateTimeStringStartOf(from, type)),
      new ReportFilterQuery(REPORT_FILTER_OPERATOR.LTE, DateUtils.toISODateTimeStringEndOf(to, type)),
    ];
  }
  public applyFilter(fromValue, toValue) {
    this.visible = false;
    if (!fromValue && !toValue) {
      this.setInitialValue();
      return this.onChange(null);
    }
    [this.filterQueryFrom, this.filterQueryTo] = this.getRange('day', fromValue || toValue, this.queryType === 2 ? fromValue : toValue || fromValue);
    const filterValue = new ReportFilterValue([], this.queryType);
    switch (this.queryType) {
      case REPORT_QUERY_TYPES.RANGE:
      case REPORT_QUERY_TYPES.CURRENT_MONTH:
      case REPORT_QUERY_TYPES.EXACT:
        filterValue.queries = [this.filterQueryFrom, this.filterQueryTo];
        break;
      case REPORT_QUERY_TYPES.FROM:
        filterValue.queries = [this.filterQueryFrom, null];
        this.filterQueryTo.value = null;
        break;
      case REPORT_QUERY_TYPES.TO:
        this.filterQueryFrom.value = null;
        filterValue.queries = [null, this.filterQueryTo];
        break;
    }
    this.onChange(filterValue);
  }

  public resetFilter() {
    this.visible = false;
    this.setInitialValue();
    this.onChange(null);
  }

  private setInitialValue() {
    this.filterQueryFrom = new ReportFilterQuery(REPORT_FILTER_OPERATOR.GTE, null);
    this.filterQueryTo = new ReportFilterQuery(REPORT_FILTER_OPERATOR.LTE, null);
    this.queryType = REPORT_QUERY_TYPES.RANGE;
  }

}
