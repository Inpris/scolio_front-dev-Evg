import { Component, Input, ViewEncapsulation, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CorsetOrder } from '@common/services/corset-order';

@Component({
  selector: 'sl-corset-order-print',
  templateUrl: './corset-order-print.component.html',
  styleUrls: ['./corset-order-print.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class CorsetOrderPrintComponent implements OnChanges {
  @Input()
  public device: CorsetOrder;
  @Input()
  public visit;
  @Input()
  public contact;

  public manufacturingData;
  public issueData;
  public corsetData;
  public modelData;
  public measurements;

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
  }
}
