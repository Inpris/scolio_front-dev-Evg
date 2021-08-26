import { CorsetOrder } from '@common/models/product-order/corset-order';
import { ApparatusOrderResponse } from '@common/interfaces/product-order/apparatus-order/Apparatus-order-response';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { ApparatusOrderUpdate } from '@common/interfaces/product-order/apparatus-order/Apparatus-order-update';
import { ProductionMethod } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/models/production-method';
import { ApparatLegMeasurement } from '@common/models/product-order/apparatus-order/apparat-leg-measurement';
import { Entity } from '@common/interfaces/Entity';
import { extract } from '@common/utils/object';

export class ApparatusOrder extends CorsetOrder implements ApparatusOrderResponse {
  public productionMethod: string;
  public apparatLegMeasurement: ApparatLegMeasurement;
  public plasticType: Entity;
  public adapterSleeve: string;

  public hipJoint: Entity;
  public otherHipJoint: string;
  public unilateralHipJoint = false;

  public kneeJoint: Entity;
  public otherKneeJoint: string;
  public unilateralKneeJoint = false;

  public ankleJoint: string;
  public unilateralAnkleJoint = false;

  public mount: string;
  public shorteningСompensation: string;
  public guaranty: string;

  constructor(data: ApparatusOrderResponse) {
    super(data);
    this.productionMethod = data.productionMethod;
    this.apparatLegMeasurement = data.apparatLegMeasurement;
    this.plasticType = data.plasticType;
    this.adapterSleeve = data.adapterSleeve;

    this.hipJoint = data.hipJoint;
    this.otherHipJoint = data.otherHipJoint;
    this.unilateralHipJoint = data.unilateralHipJoint;

    this.kneeJoint = data.kneeJoint;
    this.otherKneeJoint = data.otherKneeJoint;
    this.unilateralKneeJoint = data.unilateralKneeJoint;

    this.ankleJoint = data.ankleJoint;
    this.unilateralAnkleJoint = data.unilateralAnkleJoint;

    this.mount = data.mount;
    this.shorteningСompensation = data.shorteningСompensation;
    this.guaranty = data.guaranty;

  }

  public static fromFormData(formData): ApparatusOrder {
    const data = {
      ...formData.corsetData,
      ...formData.issueData,
      ...formData.modelData,
      ...formData.manufacturingData,
      ...formData.hingeParameters,
      generalStatus: formData.generalStatus,
      corsetMeasurement: formData.measurementData,
      productType: ProductOrderTypes.CORSET,
      productionTime: formData.productionTime,
      productionMethod: formData.productionMethod,
      apparatLegMeasurement: formData.apparatLegMeasurement,
    };
    return new ApparatusOrder(data);
  }

  public toUpdateModel(): ApparatusOrderUpdate {
    return {
      ...super.toUpdateModel(),
      ...this.getUpdateHingeParameters(),
      productionMethod: this.productionMethod,
      apparatLegMeasurement: { ...this.apparatLegMeasurement, acceptedBy: extract(this.apparatLegMeasurement, 'acceptedBy.id') },
      guaranty: this.guaranty,
    };
  }

  public getFormData() {
    const formData = {
      ...super.toFormData(),
      productionMethod: this.productionMethod,
      apparatLegMeasurement: this.apparatLegMeasurement,
      hingeParameters: this.hingeParemeters,
    };
    return formData;
  }

  public get hingeParemeters() {
    return {
      plasticType: this.plasticType,
      adapterSleeve: this.adapterSleeve,
      hipJoint: (!this.hipJoint && this.otherHipJoint) ? { id: '-1', name: 'Иное' } : this.hipJoint,
      otherHipJoint: this.otherHipJoint,
      unilateralHipJoint: this.unilateralHipJoint,
      kneeJoint: (!this.kneeJoint && this.otherKneeJoint) ? { id: '-1', name: 'Иное' } : this.kneeJoint,
      otherKneeJoint: this.otherKneeJoint,
      unilateralKneeJoint: this.unilateralKneeJoint,
      ankleJoint: this.ankleJoint,
      unilateralAnkleJoint: this.unilateralAnkleJoint,
      mount: this.mount,
      shorteningСompensation: this.shorteningСompensation,
    };
  }

  public getUpdateHingeParameters() {
    const hipJointId = (this.hipJoint && this.hipJoint.id !== '-1') ? this.hipJoint.id : null;
    const otherHipJoint = (this.hipJoint && this.hipJoint.id === '-1') ? this.otherHipJoint : null;

    const kneeJointId = (this.kneeJoint && this.kneeJoint.id !== '-1') ? this.kneeJoint.id : null;
    const otherKneeJoint = (this.kneeJoint && this.kneeJoint.id === '-1') ? this.otherKneeJoint : null;
    return {
      hipJointId,
      otherHipJoint,
      kneeJointId,
      otherKneeJoint,
      plasticTypeId: (this.plasticType) ? this.plasticType.id : null,
      adapterSleeve: this.adapterSleeve,

      ankleJoint: this.ankleJoint,
      unilateralHipJoint: this.unilateralHipJoint ? this.unilateralHipJoint : false,
      unilateralKneeJoint: this.unilateralKneeJoint ? this.unilateralKneeJoint : false,
      unilateralAnkleJoint: this.unilateralAnkleJoint ? this.unilateralAnkleJoint : false,

      mount: this.mount,
      shorteningСompensation: this.shorteningСompensation,
    };

  }


}
