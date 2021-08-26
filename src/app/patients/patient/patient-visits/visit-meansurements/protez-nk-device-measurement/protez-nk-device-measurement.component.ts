import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'sl-protez-nk-device-measurement',
  templateUrl: './protez-nk-device-measurement.component.html',
  styleUrls: ['./protez-nk-device-measurement.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(ProtezNkDeviceMeasurementComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtezNkDeviceMeasurementComponent extends FormValueAccessor {
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    super();

    this.form = this.fb.group({
      amputationDate: [null],
      amputationCause: [''],
      accompanyingIllnesses: [''],
      prothesisUseDuring: [''],
      oldProthesis: [''],
      currentProthesis: [''],
      oldCompany: [''],
      prothesisBracing: [''],
      sleeveMaterial: [''],
      prothesisParts: [''],
      additionalInfo: [''],
      tcpUsing: [''],
    });
  }

  public markForCheck(): void {
    this.cdr.markForCheck();
  }
}
