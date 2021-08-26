import { Component, Input, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { REPORT_FILTER_OPERATOR, ReportFilterQuery, ReportFilterValue } from '@modules/reports/models/report-filter-query';

@Component({
  selector: 'sl-report-select',
  templateUrl: './report-select.component.html',
  styleUrls: ['./report-select.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ReportSelectComponent, multi: true },
  ],
})
export class ReportSelectComponent {
  public visible: boolean;
  public value;

  @Input()
  service;
  @Input()
  placeholder = '';
  @Input()
  title = '';
  @Input()
  valueField;
  @Input()
  multi = false;

  private onChange: (_) => void;
  public registerOnChange = onChange => this.onChange = onChange;
  public registerOnTouched = () => void 0;

  @Input()
  dataFactory = value => value

  constructor(private renderer: Renderer2) {
  }

  public visibleChange(value) {
    if (!value) {
      return;
    }
    setTimeout(() => {
      const dropdown = document.querySelector('.sl-select-dropdown');
      if (dropdown) {
        this.renderer.setStyle(dropdown.parentElement, 'z-index', 100000);
      }
    });
  }

  public writeValue(value: ReportFilterValue) {
    this.value = value && value.extra;
  }

  public applyFilter(value) {
    if (value) {
      this.multi ? this.applyMulti(value) : this.applySingle(value);
    } else {
      this.onChange(null);
    }
    this.value = value;
    this.visible = false;
  }

  private applyMulti(value) {
    if (!Array.isArray(value)) {
      return null;
    }
    this.onChange(new ReportFilterValue(value.map(val =>
        new ReportFilterQuery(REPORT_FILTER_OPERATOR.EQ, val[this.valueField || 'id'],
        ),
      ),
      value,
      ),
    );
  }

  private applySingle(value) {
    this.onChange(new ReportFilterValue(
      [
        new ReportFilterQuery(REPORT_FILTER_OPERATOR.EQ, value[this.valueField || 'id'],
        ),
      ],
      value,
    ));
  }

  public resetFilter() {
    this.visible = false;
    this.onChange(null);
    this.value = null;
  }
}
