import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { Mkb10Service } from '@common/services/dictionaries/mkb10.service';
import { Diagnosis1Service } from '@common/services/dictionaries/diagnosis1.service';
import { Diagnosis2Service } from '@common/services/dictionaries/diagnosis2.service';

@Component({
  selector: 'sl-patient-diagnosis',
  templateUrl: './patient-diagnosis.component.html',
  styleUrls: ['./patient-diagnosis.component.less'],
  providers: [
    ...FormValueAccessor.getAccessorProviders(PatientDiagnosisComponent),
    Mkb10Service,
    Diagnosis1Service,
    Diagnosis2Service,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDiagnosisComponent extends FormValueAccessor {

  public dataFactory = response => response.data;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public mkb10: Mkb10Service,
    public diagnosis1: Diagnosis1Service,
    public diagnosis2: Diagnosis2Service,
  ) {
    super();
    this.form = fb.group({
      diagnosis1: [null],
      diagnosis2: [null],
      mkb10: [null],
      attendantDiagnosis: [null],
    });
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

}
