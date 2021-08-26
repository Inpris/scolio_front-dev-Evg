import { ViewEncapsulation, Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ApparatusOrder } from '@common/models/product-order/apparatus-order/apparatus-order';
import { Visit } from '@common/models/visit';
import { Contact } from '@common/models/contact';
import { Entity } from '@common/interfaces/Entity';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RobotBlockingOrder } from '@common/models/product-order/apparatus-order/robot-blocking-order';
import { MoldOrder } from '@common/models/product-order/apparatus-order/mold-order';
import { RobotLaminationOrder } from '@common/models/product-order/apparatus-order/robot-lamination-order';
import { ApparatLegMeasurement } from '@common/models/product-order/apparatus-order/apparat-leg-measurement';
import { HingeParameters } from '@common/models/product-order/apparatus-order/hinge-parameters';
import { ProductOrderTypes } from '@common/enums/product-order-types';

@Component({
  selector: 'sl-apparatus-order-print',
  templateUrl: './apparatus-order-print.component.html',
  styleUrls: ['./apparatus-order-print.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ApparatusOrderPrintComponent implements OnChanges {
  @Input()
  public device: ApparatusOrder | RobotBlockingOrder | MoldOrder | RobotLaminationOrder;
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
  public color;
  public apparatLegMeasurement: ApparatLegMeasurement;
  public hingeParameters: HingeParameters;
  public compensation: string;
  public hipJoint: string;
  public kneeJoint: string;
  public productType: ProductOrderTypes.APPARATUS | ProductOrderTypes.TUTOR;
  public messageItem: string;

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
      this.color = this.device.color;
      this.apparatLegMeasurement = this.device.apparatLegMeasurement;
      this.hingeParameters = this.device.hingeParemeters;
      if (this.hingeParameters) {
        if (this.hingeParameters.hipJoint) {
          this.hipJoint = (this.hingeParameters.hipJoint &&
            this.hingeParameters.hipJoint.id === '-1' &&
            this.hingeParameters.otherHipJoint) ?
            this.hingeParameters.otherHipJoint : this.hingeParameters.hipJoint.name;
        }
        if (this.hingeParameters.kneeJoint) {
          this.kneeJoint = (this.hingeParameters.kneeJoint &&
            this.hingeParameters.kneeJoint.id === '-1' &&
            this.hingeParameters.otherKneeJoint) ?
            this.hingeParameters.otherKneeJoint : this.hingeParameters.kneeJoint.name;
        }
      }
      this.compensation = this.hingeParameters.shorteningСompensation;
      switch (this.device.productType.sysName) {
        case ProductOrderTypes.APPARATUS:
          this.productType = ProductOrderTypes.APPARATUS;
          this.messageItem = 'аппарата'; break;
        case ProductOrderTypes.TUTOR:
          this.productType = ProductOrderTypes.TUTOR;
          this.messageItem = 'тутора'; break;
        default: break;
      }
    }
    if (changes.visit && this.visit) {
      this.diagnosis = this.visit.mkb10;
      this.growth = this.visit.growth;
      this.weight = this.visit.weight;
      this.comment = this.visit.comment;
    }
  }
}
