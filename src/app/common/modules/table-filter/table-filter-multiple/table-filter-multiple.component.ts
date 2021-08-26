import { Component, Input, HostListener, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Filter } from '@common/modules/table-filter/model/Filter';
import { NzCheckboxWrapperComponent } from 'ng-zorro-antd';

@Component({
  selector: 'sl-table-filter-multiple',
  templateUrl: './table-filter-multiple.component.html',
  styleUrls: ['./table-filter-multiple.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TableFilterMultipleComponent, multi: true },
  ],
})
export class TableFilterMultipleComponent extends Filter {
  @Input()
  set filters(filters) {
    this._filters = [...filters];
  }

  get filters() {
    return this._filters;
  }

  private _filters;

  @ViewChild('group') group: NzCheckboxWrapperComponent;

  @HostListener('document:keydown.enter', ['$event.target'])
  onEntereHandler() {
    if (this.visible) {
      super.applyFilter(this.group.outputValue());
    }
  }

  getSelection(checkboxGroup: NzCheckboxWrapperComponent) {
    return checkboxGroup.outputValue();
  }

  isSelected(value) {
    return this.value &&
      Array.isArray(this.value) &&
      this.value.indexOf(value) !== -1;
  }
}
