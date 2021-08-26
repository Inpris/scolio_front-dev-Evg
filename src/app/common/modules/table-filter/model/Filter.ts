import { EventEmitter, Output, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

export class Filter implements ControlValueAccessor {
  @Input()
  label: string;

  @Output()
  filterChange = new EventEmitter();
  public value = null;
  public visible: boolean;

  private onChange: (_) => void;
  public registerOnChange = onChange => this.onChange = onChange;
  public registerOnTouched = () => void 0;
  public writeValue = value => this.value = value;

  applyFilter(value) {
    this.visible = false;
    this.value = value;
    this.onChange(value);
    this.filterChange.emit(value);
  }

  resetFilter() {
    this.visible = false;
    this.value = null;
    this.onChange(null);
    this.filterChange.emit(null);
  }
}
