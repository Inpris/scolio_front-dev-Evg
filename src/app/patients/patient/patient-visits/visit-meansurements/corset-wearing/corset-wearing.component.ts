import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';

@Component({
  selector: 'sl-corset-wearing',
  templateUrl: './corset-wearing.component.html',
  styleUrls: ['./corset-wearing.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(CorsetWearingComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorsetWearingComponent extends FormValueAccessor {

  @Input()
  medicalServiceSysName: string = '';

  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef) {
    super();
    this.form = fb.group({
      actualCorsetWearing: [null],
      recommendedCorsetWearing: [null],
    });
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

}
