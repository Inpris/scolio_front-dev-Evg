import { ViewEncapsulation, Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ApparatusOrder } from '@common/models/product-order/apparatus-order/apparatus-order';
import { Visit } from '@common/models/visit';
import { Contact } from '@common/models/contact';
import { Entity } from '@common/interfaces/Entity';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sl-verticalizator-order-print',
  templateUrl: './verticalizator-order-print.component.html',
  styleUrls: ['./verticalizator-order-print.component.less'],
})
export class VerticalizatorOrderPrintComponent implements OnChanges {
  @Input()
  public device: ApparatusOrder;
  @Input()
  public visit: Visit;
  @Input()
  public contact: Contact;

  public diagnosis: Entity;
  public form: FormGroup;

  public manufacturingData;
  public issueData;
  public corsetData;
  public modelData;
  public measurements;
  public growth;
  public weight;
  public comment;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      measurementData: [{}],
    });
  }

  ngOnChanges(changes: SimpleChanges): void  {
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
      this.growth = this.visit.growth;
      this.weight = this.visit.weight;
      this.comment = this.visit.comment;
    }
  }
}
