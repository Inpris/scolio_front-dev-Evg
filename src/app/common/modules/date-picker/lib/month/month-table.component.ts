import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { CandyDate } from '../candy-date';
import { NzI18nService } from 'ng-zorro-antd';

const MAX_ROW = 4;
const MAX_COL = 3;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'month-table',
  templateUrl: 'month-table.component.html',
})

export class MonthTableComponent implements OnInit, OnChanges {
  @Input() value: CandyDate;
  @Output() valueChange = new EventEmitter<CandyDate>();

  @Input() disabledDate: (date: Date) => boolean;

  prefixCls: string = 'ant-calendar-month-panel';
  panelMonths: PanelMonthData[][];

  constructor(private i18n: NzI18nService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value || changes.disabledDate) {
      this.render();
    }
  }

  trackPanelMonth(index: number, monthData: PanelMonthData): number {
    return monthData.month;
  }

  private render(): void {
    if (this.value) {
      this.panelMonths = this.makePanelMonths();
    }
  }

  private makePanelMonths(): PanelMonthData[][] {
    const months: PanelMonthData[][] = [];
    const currentMonth = this.value.getMonth();
    const today = new CandyDate();

    let monthValue = 0;
    // tslint:disable-next-line
    for (let rowIndex = 0; rowIndex < MAX_ROW; rowIndex++) {
      months[rowIndex] = [];
      // tslint:disable-next-line
      for (let colIndex = 0; colIndex < MAX_COL; colIndex++) {
        const month = this.value.setMonth(monthValue);
        const disabled = this.disabledDate ? this.disabledDate(this.value.setMonth(monthValue).nativeDate) : false;
        const content = this.i18n.formatDateCompatible(month.nativeDate, 'MMM');

        const cell = months[rowIndex][colIndex] = {
          disabled,
          content,
          month: monthValue,
          title: content,
          classMap: null,
          onClick: () => this.chooseMonth(cell.month),
        };

        cell.classMap = {
          [`${this.prefixCls}-cell`]: true,
          [`${this.prefixCls}-cell-disabled`]: disabled,
          [`${this.prefixCls}-selected-cell`]: cell.month === currentMonth,
          [`${this.prefixCls}-current-cell`]: today.getYear() === this.value.getYear() && cell.month === today.getMonth(),
        };
        // tslint:disable-next-line
        monthValue++;
      }
    }
    return months;
  }

  private chooseMonth(month: number): void {
    this.value = this.value.setMonth(month);
    this.valueChange.emit(this.value);
    this.render();
  }
}

export interface PanelMonthData {
  disabled: boolean;
  content: string;
  month: number;
  title: string;
  classMap: object;

  onClick(): void;
}
