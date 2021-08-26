import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'sl-device-measurement',
  templateUrl: './device-measurement.component.html',
  styleUrls: ['./device-measurement.component.less'],
})
export class DeviceMeasurementComponent implements OnInit, OnDestroy {
  @Input()
  form: FormGroup;
  @Input()
  visitsManager: VisitsManager;
  @Input()
  forceType;
  public selectedMeasurements = [];
  private unsubscribe$ = new Subject();

  get type() {
    return this.forceType || this.visitsManager.selected.medicalService.sysName;
  }

  ngOnInit() {
    this.visitsManager.selectionChanges
      .takeUntil(this.unsubscribe$)
      .subscribe(() => this.selectedMeasurements.splice(0));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  public hideSelection(index) {
    this.selectedMeasurements = [
      ...this.selectedMeasurements.slice(0, index),
      ...this.selectedMeasurements.slice(index + 1),
    ];
  }
}
