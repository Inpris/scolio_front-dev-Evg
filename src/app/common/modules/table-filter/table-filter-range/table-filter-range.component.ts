import { Component, ViewChild, HostListener } from '@angular/core';
import { Filter } from '@common/modules/table-filter/model/Filter';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzInputNumberComponent } from 'ng-zorro-antd';

@Component({
  selector: 'sl-table-filter-range',
  templateUrl: './table-filter-range.component.html',
  styleUrls: ['./table-filter-range.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TableFilterRangeComponent, multi: true },
  ],
})
export class TableFilterRangeComponent extends Filter {
  @ViewChild('from') from: NzInputNumberComponent;
  @ViewChild('to') to: NzInputNumberComponent;

  @HostListener('document:keydown.enter', ['$event.target'])
  onEnterHandler(target) {
    if (this.visible) {
      if (target === this.from.inputElement.nativeElement) {
        this.from.value = +target.value;
      }
      if (target === this.to.inputElement.nativeElement) {
        this.to.value = +target.value;
      }
      super.applyFilter({ from: this.from.value, to: this.to.value });
    }
  }

  visibleChange(value) {
    if (!value) { return; }
    setTimeout(() => this.from.focus());
  }
}
