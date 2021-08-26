import { CorsetOrderResponse } from '@common/interfaces/product-order/Corset-order-response';
import { ApparatLegMeasurement } from '@common/models/product-order/apparatus-order/apparat-leg-measurement';
import { Entity } from '@common/interfaces/Entity';
import { HingeParameters } from '@common/models/product-order/apparatus-order/hinge-parameters';

export interface ApparatusOrderResponse extends CorsetOrderResponse {
  productionMethod: string;
  apparatLegMeasurement: ApparatLegMeasurement;
  hingeParemeters: HingeParameters;
  plasticType: Entity;
  adapterSleeve: string;

  hipJoint: Entity;
  otherHipJoint: string;
  unilateralHipJoint: boolean;

  kneeJoint: Entity;
  unilateralKneeJoint: boolean;
  otherKneeJoint: string;

  ankleJoint: string;
  unilateralAnkleJoint: boolean;

  mount: string;
  shorteningСompensation: string;
  guaranty: string;

  isImported: boolean;
}
