import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Filter } from '@common/modules/table-filter/model/Filter';

@Component({
  selector: 'sl-table-filter-text',
  templateUrl: './table-filter-text.component.html',
  styleUrls: ['./table-filter-text.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TableFilterTextComponent, multi: true },
  ],
})
export class TableFilterTextComponent extends Filter {
  @Input()
  placeholder: string;

  @Input()
  substring: number;

  @ViewChild('input')
  inputEl: ElementRef;

  changeValue(value) {
    if (this.substring !== undefined) {
      this.substringValue(value);
    }
  }

  visibleChange(value) {
    if (!value) { return; }
    setTimeout(() => this.inputEl.nativeElement.focus());
  }

  substringValue(value) {
    const num = this.substring;
    if (value && value.length > num) {
      this.inputEl.nativeElement.value = this.inputEl.nativeElement.value.substr(value.length - num, value.length);
    }
  }
}
