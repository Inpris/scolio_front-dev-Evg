import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'sl-swosh-order-print',
  templateUrl: './swosh-order-print.component.html',
  styleUrls: ['./swosh-order-print.component.less'],
})
export class SwoshOrderPrintComponent implements OnChanges {
  public measurements;
  public manufacturingData;
  public issueData;
  public corsetData;
  public modelData;

  @Input()
  public contact;
  @Input()
  public diagnosis;
  @Input()
  public device;
  @Input()
  public visit;

  public form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      measurementData: [{}],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.device && this.device) {
      this.measurements = this.device.getMeasurementData();
      this.form.get('measurementData').patchValue(this.measurements);
      this.corsetData = this.device.getDeviceData();
      this.manufacturingData = this.device.getManufacturingData();
      this.issueData = this.device.getIssueData();
      this.modelData = this.device.getModelData();
    }
    if (changes.visit && this.visit) {
      this.diagnosis = this.visit.mkb10;
    }
  }
}
