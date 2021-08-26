import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { Visit } from '@common/models/visit';

@Component({
  selector: 'sl-patient-healing-plan',
  templateUrl: './patient-healing-plan.component.html',
  styleUrls: ['./patient-healing-plan.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(PatientHealingPlanComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientHealingPlanComponent extends FormValueAccessor {

  filteredVisits: Visit[];
  @Input()
  set visits(visits: Visit[]) {
    if (!visits) { return; }
    this.filteredVisits  = visits.filter(visit => visit.healingPlan);
  }

  public showMore = false;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.form = fb.group({ healingPlan: [null] });
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

}
