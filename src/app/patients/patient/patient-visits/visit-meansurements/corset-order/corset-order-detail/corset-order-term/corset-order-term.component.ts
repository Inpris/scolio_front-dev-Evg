import { ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OrderTerm } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/order-term.enum';

@Component({
  selector: 'sl-corset-order-term',
  templateUrl: './corset-order-term.component.html',
  styleUrls: ['./corset-order-term.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CorsetOrderTermComponent),
      multi: true,
    },
  ],
})
export class CorsetOrderTermComponent implements ControlValueAccessor {
  private disabled = false;
  public orderTerm = OrderTerm;
  public productionTime: OrderTerm = this.orderTerm.STANDARD;
  onTouched = () => void 0;
  onChange = value => void 0;

  constructor(private cdr: ChangeDetectorRef) {
  }

  onSelect(v) {
    this.onChange(v);
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  writeValue(value) {
    this.productionTime = value;
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

}
