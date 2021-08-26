import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Visit } from '@common/models/visit';

@Component({
  selector: 'sl-visit-history-selection',
  templateUrl: './visit-history-selection.component.html',
  styleUrls: ['./visit-history-selection.component.less'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VisitHistorySelectionComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitHistorySelectionComponent implements ControlValueAccessor {
  public visible = false;
  public value = [];
  _visits: Visit[];

  @Input()
  set visits(visits: Visit[]) {
    this._visits = visits;
    this.value = [];
  }

  @Input()
  isHistoryEmpty = elem => false

  onChange = v => void 0;
  onTouched = () => void 0;

  constructor(private cdr: ChangeDetectorRef) {
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  onSelect(e) {
    this.value = e;
    this.onChange(e);
    this.cdr.markForCheck();
  }

  writeValue(obj) {
    this.value = obj;
    this.cdr.markForCheck();
  }

  isSelected(value) {
    const selected = this.value &&
      Array.isArray(this.value) &&
      this.value.find(item => item.id === value);

    return selected;
  }

}
