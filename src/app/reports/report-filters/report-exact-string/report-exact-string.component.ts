import { Component, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { REPORT_FILTER_OPERATOR, ReportFilterQuery, ReportFilterValue } from '@modules/reports/models/report-filter-query';

@Component({
  selector: 'sl-report-exact-string',
  templateUrl: './report-exact-string.component.html',
  styleUrls: ['./report-exact-string.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ReportExactStringComponent, multi: true },
  ],
})
export class ReportExactStringComponent {
  public filterQuery = new ReportFilterQuery(REPORT_FILTER_OPERATOR.ICONTAINS, '');
  public visible: boolean;

  @Input()
  placeholder = '';
  @Input()
  title = '';
  @ViewChild('input') inputEl;

  private onChange: (_) => void;
  public registerOnChange = onChange => this.onChange = onChange;
  public registerOnTouched = () => void 0;

  public visibleChange(value) {
    if (!value) {
      return;
    }
    setTimeout(() => this.inputEl.nativeElement.focus());
  }

  public writeValue(value: ReportFilterValue) {
    const operator = value && value.queries[0] ? value.queries[0].operator : REPORT_FILTER_OPERATOR.ICONTAINS;
    const filterValue = value && value.queries[0] ? value.queries[0].value : '';
    this.filterQuery = new ReportFilterQuery(operator, filterValue);
  }

  public applyFilter(value) {
    this.visible = false;
    this.filterQuery.value = value;
    this.onChange(new ReportFilterValue([this.filterQuery]));
  }

  public resetFilter() {
    this.visible = false;
    this.filterQuery = new ReportFilterQuery(REPORT_FILTER_OPERATOR.ICONTAINS, '');
    this.onChange(null);
  }
}
