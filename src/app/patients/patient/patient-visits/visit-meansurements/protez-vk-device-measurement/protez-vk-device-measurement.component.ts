import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormBuilder } from '@angular/forms';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';

@Component({
  selector: 'sl-protez-vk-device-measurement',
  templateUrl: './protez-vk-device-measurement.component.html',
  styleUrls: ['./protez-vk-device-measurement.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [...FormValueAccessor.getAccessorProviders(ProtezVKDeviceMeasurementComponent)],
})
export class ProtezVKDeviceMeasurementComponent extends FormValueAccessor {

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
      bzpvkPL1: [null],
      bzpvkPL2: [null],
      bzpvkPL3: [null],
      bzpvkPL4: [null],
      bzpvkPL5: [null],
      bzpvkPL6: [null],
      bzpvkPL7: [null],
      bzpvkPC1: [null],
      bzpvkPC2: [null],
      bzpvkPC3: [null],
      bzpvkPC4: [null],
      bzpvkPR1: [null],
      bzpvkPR2: [null],
      bzpvkPR3: [null],
      bzpvkPR4: [null],
      bzpvkPR5: [null],
      bzpvkPR6: [null],
      bzpvkPR7: [null],
      bzpvkPR8: [null],
      bzpvkPB1: [null],
      bzpvkPB2: [null],
      bzpvkPB3: [null],
      bzpvkPB4: [null],
      bzpvkPB5: [null],
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
