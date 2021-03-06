import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { Entity } from '@common/interfaces/Entity';
import { CorsetStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/corset-status.enum';
import { CorsetOperationStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/corser-operation-status.enum';
import { OrderTerm } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/order-term.enum';
import { ProductStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/product-status.enum';
import { CorsetMeasurement } from '@common/interfaces/product-order/Corset-measurement';

export interface CorsetOrderResponse {
  id: string;
  name: string;
  price: number;
  visitId: string;
  dealId: string;
  number: string;
  productType: EntityWithSysName;
  generalStatus: ProductStatus;
  statusComplete: boolean;
  afterBlockCorsetPlasticThickness: boolean;
  blockingExecutor1: Entity;
  blockingExecutor2: Entity;
  blockingStatus: CorsetOperationStatus;
  branch: Entity;
  color: string;
  comment: string;
  competentCutting: boolean;
  controlledBy: Entity;
  corsetFastenersInstallation: boolean;
  corsetMeasurement: CorsetMeasurement;
  corsetProblocking: boolean;
  corsetStatus: CorsetStatus;
  corsetType: Entity;
  cuttingExecutor1: Entity;
  cuttingExecutor2: Entity;
  cuttingStatus: CorsetOperationStatus;
  dateOfIssue: string;
  dateOfIssueTurner: string;
  dateSendingToBranch: string;
  deformationInsideCorsetLiner: boolean;
  execution3DModelEnd: string;
  execution3DModelStart: string;
  fastenersInstallExecutor1: Entity;
  fastenersInstallExecutor2: Entity;
  fastenersInstallStatus: CorsetOperationStatus;
  isControlled: boolean;
  issuer1: Entity;
  issuer2: Entity;
  is3DModelReady: boolean;
  levelOfAxillaryPelot: boolean;
  model3DExecutor1: Entity;
  model3DExecutor2: Entity;
  otherDefects: string;
  paintQualityAfterBlocking: boolean;
  participationPercent1: number;
  participationPercent2: number;
  plasticBend: boolean;
  plasticType: Entity;
  productReadinessAtTime: boolean;
  productionTime: OrderTerm;
  purityBeforeLoadingInThermostol: boolean;
  sameColorFrames: boolean;
  seamPolishing: boolean;
  stonesAfterTights: boolean;
  surfaceScratches: boolean;
  turningExecutor1: Entity;
  turningExecutor2: Entity;
  turningQuality: boolean;
  turningStatus: CorsetOperationStatus;
  whriteWhoInstalledFasteners: boolean;
  whriteWhoTurned: boolean;

}
