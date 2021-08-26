import { Component, OnInit, forwardRef, ChangeDetectorRef, Input } from '@angular/core';
import { ProductionMethodService } from '@common/services/production-method.service';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'sl-apparatus-production-method',
  templateUrl: './apparatus-production-method.component.html',
  styleUrls: ['./apparatus-production-method.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApparatusProductionMethodComponent),
      multi: true,
    },
  ],
})
export class ApparatusProductionMethodComponent implements ControlValueAccessor, OnInit {
  @Input()
  public disabled = false;
  public methods: EntityWithSysName[];
  public currentMethod: string;
  onTouched = () => void 0;
  onChange = value => void 0;

  constructor(
    private productinMethodService: ProductionMethodService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.productinMethodService.getList(ProductOrderTypes.APPARATUS)
        .subscribe((methods) => {
          this.methods = methods;
        });
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
    this.currentMethod = value;
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }
}
