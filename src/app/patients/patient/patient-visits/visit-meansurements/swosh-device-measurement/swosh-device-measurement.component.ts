import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormBuilder, Validators } from '@angular/forms';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';

@Component({
  selector: 'sl-swosh-device-measurement',
  templateUrl: './swosh-device-measurement.component.html',
  styleUrls: ['./swosh-device-measurement.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [...FormValueAccessor.getAccessorProviders(SwoshDeviceMeasurementComponent)],
})
export class SwoshDeviceMeasurementComponent extends FormValueAccessor {

  @Input()
  visitsManager: VisitsManager;

  @Input()
  readonly = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    super();
    this.form = fb.group({
      circle1: [null],
      fas1: [null],
      circle2: [null],
      fas2: [null],
      circle3: [null],
      fas3: [null],
      circle4: [null],
      fas4: [null],
      circle5: [null],
      fas5: [null],
      hipsCirculRight: [null],
      hipsCirculLeft: [null],
    });
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  measurementParser(value) {
    if (value.length > 3) { return value.slice(0, 3); }
    return value.replace('.', '');
  }
}
