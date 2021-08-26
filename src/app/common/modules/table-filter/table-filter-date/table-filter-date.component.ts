import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Filter } from '@common/modules/table-filter/model/Filter';
import { CandyDate, NzDatePickerComponent } from 'ng-zorro-antd';

@Component({
  selector: 'sl-table-filter-date',
  templateUrl: './table-filter-date.component.html',
  styleUrls: ['./table-filter-date.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TableFilterDateComponent, multi: true },
  ],
})
export class TableFilterDateComponent extends Filter {
  @Input()
  isPickerUp = false;

  @ViewChild('datepicker') datepicker: NzDatePickerComponent;

  @HostListener('document:keydown.enter', ['$event.target'])
  onEntereHandler() {
    if (this.visible) {
      super.applyFilter((<CandyDate>this.datepicker.nzValue).nativeDate);
    }
  }

  visibleChange(value) {
    if (!value) { return; }
    setTimeout(() => this.datepicker['picker'].showOverlay());
  }
}
