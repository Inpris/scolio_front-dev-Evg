import { Component, Input } from '@angular/core';
import { REPORT_COLUMN_FILTERS } from '@modules/reports/models/column-filters';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sl-report-filters',
  template: `
    <ng-container [ngSwitch]="type">
      <sl-report-exact-string [placeholder]="placeholder"
                              [title]="title"
                              [(ngModel)]="value"
                              (ngModelChange)="onChange($event)"
                              *ngSwitchCase="types.EXACT_STRING">
      </sl-report-exact-string>
      <sl-report-date [placeholder]="placeholder"
                      [title]="title"
                      [(ngModel)]="value"
                      (ngModelChange)="onChange($event)"
                      *ngSwitchCase="types.DATE">
      </sl-report-date>
      <sl-report-select [service]="service"
                        [dataFactory]="dataFactory"
                        [placeholder]="placeholder"
                        [title]="title"
                        [multi]="multi"
                        [valueField]="valueField"
                        [(ngModel)]="value"
                        (ngModelChange)="onChange($event)"
                        *ngSwitchCase="types.DICTIONARY">
      </sl-report-select>
      <sl-report-number [placeholder]="placeholder"
                        [title]="title"
                        [(ngModel)]="value"
                        (ngModelChange)="onChange($event)"
                        *ngSwitchCase="types.NUMBER">
      </sl-report-number>
      <span *ngSwitchDefault>{{title}}</span>
    </ng-container>
  `,
  styles: [],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: ReportFiltersComponent, multi: true },
  ],
})
export class ReportFiltersComponent implements ControlValueAccessor {

  @Input()
  placeholder = '';
  @Input()
  title: string;
  @Input()
  type;
  @Input()
  service;
  @Input()
  multi = false;
  @Input()
  dataFactory;
  @Input()
  valueField;

  public types = REPORT_COLUMN_FILTERS;
  public value;
  private onChange: (_) => void;
  public registerOnChange = onChange => this.onChange = onChange;
  public registerOnTouched = () => void 0;
  public writeValue = value => this.value = value;
}
