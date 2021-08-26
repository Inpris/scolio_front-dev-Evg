import { Entity } from '@common/interfaces/Entity';

export interface HingeParameters {
  plasticType: Entity;
  adapterSleeve: string;

  hipJoint: Entity;
  otherHipJoint: string;
  unilateralHipJoint: boolean;

  kneeJoint: Entity;
  otherKneeJoint: string;
  unilateralKneeJoint: boolean;

  ankleJoint: string;
  unilateralAnkleJoint: boolean;

  mount: string;
  shorteningСompensation: string;
}
