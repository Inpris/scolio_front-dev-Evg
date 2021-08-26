import { Component, ViewChild, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Filter } from '@common/modules/table-filter/model/Filter';
import { SlRangePickerComponent } from '@common/modules/date-picker/range-picker.component';

@Component({
  selector: 'sl-table-filter-date-range',
  templateUrl: './table-filter-date-range.component.html',
  styleUrls: ['./table-filter-date-range.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TableFilterDateRangeComponent, multi: true },
  ],
})
export class TableFilterDateRangeComponent extends Filter {
  @ViewChild('range') range: SlRangePickerComponent;

  @HostListener('document:keydown.enter', ['$event.target'])
  onEntereHandler() {
    if (this.visible) {
      super.applyFilter(this.range.nzValue);
    }
  }

  visibleChange(value) {
    if (!value) { return; }
    setTimeout(() => this.range['picker'].showOverlay());
  }
}
