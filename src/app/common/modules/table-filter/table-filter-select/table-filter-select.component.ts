import { Component, Input, HostListener, Output, EventEmitter, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Filter } from '@common/modules/table-filter/model/Filter';
import { NzSelectComponent } from 'ng-zorro-antd';


@Component({
  selector: 'sl-table-filter-select',
  templateUrl: './table-filter-select.component.html',
  styleUrls: ['./table-filter-select.component.less'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TableFilterSelectComponent, multi: true },
  ],
})
export class TableFilterSelectComponent extends Filter {
  @Output()
  searchValueChange = new EventEmitter<any>();

  @Input()
  placeholder: string;

  public openState = false;

  @Input()
  set filters(filters) {
    this._filters = [...filters || []];
  }

  get filters() {
    return this._filters;
  }


  private _filters;

  private wasInside = false;
  @ViewChild('select') select: NzSelectComponent;

  @HostListener('click')
  clickInside() {
    this.wasInside = true;
  }

  @HostListener('document:click', ['$event.target'])
  clickout(target) {
    const targetClass = target.classList.contains('ant-select-dropdown-menu-item');
    if (!this.wasInside && target.tagName !== 'LI' && !targetClass) {
      this.visible = false;
    }
    this.wasInside = false;
  }

  @HostListener('document:keydown.enter', ['$event.target'])
  onEntereHandler() {
    if (this.visible) {
      super.applyFilter(this.select.value);
    }
  }

  togleFilter() {
    this.visible = !this.visible;
    setTimeout(() => this.openState = this.visible);
  }

  onSearch(value) {
    this.searchValueChange.emit(value);
  }
}
