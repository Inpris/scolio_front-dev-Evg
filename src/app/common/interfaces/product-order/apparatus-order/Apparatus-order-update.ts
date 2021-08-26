import { CorsetOrderUpdate } from '@common/interfaces/product-order/Corset-order-update';
import { ApparatLegMeasurement } from '@common/models/product-order/apparatus-order/apparat-leg-measurement';

export interface ApparatusOrderUpdate extends CorsetOrderUpdate {
  productionMethod: string;
  apparatLegMeasurement: ApparatLegMeasurement;
  plasticTypeId: string;
  adapterSleeve: string;

  hipJointId?: string;
  otherHipJoint?: string;
  unilateralHipJoint?: boolean;

  kneeJointId?: string;
  otherKneeJoint?: string;
  unilateralKneeJoint?: boolean;

  ankleJoint?: string;
  unilateralAnkleJoint?: boolean;

  mount?: string;
  shorteningСompensation?: string;
  guaranty?: string;

}
