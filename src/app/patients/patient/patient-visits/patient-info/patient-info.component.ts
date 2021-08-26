import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { DisabilityGroupsService } from '@common/services/dictionaries/disability-groups.service';

@Component({
  selector: 'sl-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.less'],
  providers: [
    ...FormValueAccessor.getAccessorProviders(PatientInfoComponent),
    DisabilityGroupsService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientInfoComponent extends FormValueAccessor {
  @Input() public sysName: string;

  public disabilityGroups;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private disabilityGroupService: DisabilityGroupsService,
  ) {
    super();
    this.form = fb.group({
      weight: [null, Validators.required],
      growth: [null, Validators.required],
      disabilityGroup: [null],
      anamnesis: [null],
      footSize: [null],
      amputationSide: [null],
      complaints: [null],
    });
    this.disabilityGroupService.getList({})
      .map(response => response.data)
      .subscribe(data => this.disabilityGroups = data);
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

}
