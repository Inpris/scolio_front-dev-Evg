import { ProductOrderUpdate } from '@common/interfaces/product-order/Product-order-update';
import {ProductStatus} from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/product-status.enum';
import {EntityWithSysName} from '@common/interfaces/EntityWithSysName';
import {ProthesisNkMeasurement} from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-device-measurement/prothesis-nk-measurement';

export interface ProthesisNkOrderUpdate extends ProductOrderUpdate {
  id?: string;
  name: string;
  dateOfIssue: string;
  guarantee: string;
  prothesisFastening: string;
  sleeveMaterial: string;
  prothesisParts: string;
  dateSendingToBranch: string;
  branchId: string;

  issuer1?: any;
  issuer2?: any;

  prothesisNkMeasurement: ProthesisNkMeasurement;

  footSize: number;
  growth: number;
  weight: number;
  amputationSide: string;
  model3d: boolean | number;
  htv: boolean | number;
  lamination: boolean | number;
  cosmeticCladding: boolean | number;

  assemblyExecutor1: string;
  assemblyExecutor2: string;
  assemblyFinished: string;
  assemblyStatus: number;

  blockingExecutor1: string;
  blockingExecutor2: string;
  blockingFinished: string;
  blockingStatus: number;

  deliveryExecutor1: string;
  deliveryExecutor2: string;
  deliveryFinished: string;
  deliveryStatus: number;

  firstFittingExecutor1: string;
  firstFittingExecutor2: string;
  firstFittingFinished: string;
  firstFittingStatus: number;

  htvExecutor1: string;
  htvExecutor2: string;
  htvFinished: string;
  htvStatus: number;

  impressionTakingExecutor1: string;
  impressionTakingExecutor2: string;
  impressionTakingFinished: string;
  impressionTakingStatus: number;

  laminationExecutor1: string;
  laminationExecutor2: string;
  laminationFinished: string;
  laminationStatus: number;

  model3dExecutor1: string;
  model3dExecutor2: string;
  model3dFinished: string;
  model3dStatus: number;

  productionCosmeticCladdingExecutor1: string;
  productionCosmeticCladdingExecutor2: string;
  productionCosmeticCladdingFinished: string;
  productionCosmeticCladdingStatus: number;

  secondFittingExecutor1: string;
  secondFittingExecutor2: string;
  secondFittingFinished: string;
  secondFittingStatus: number;

  thirdFittingExecutor1: string;
  thirdFittingExecutor2: string;
  thirdFittingFinished: string;
  thirdFittingStatus: number;

  createModel3dExecutor1: string;
  createModel3dExecutor2: string;
  createModel3dExecutorFinished: string;
  createModel3dStatus: number;

  impressionProcessingExecutor1: string;
  impressionProcessingExecutor2: string;
  impressionProcessingFinished: string;
  impressionProcessingStatus: number;

  comment: string;
  controlledBy: string;
  isControlled: boolean;
}

export interface ProthesisNksResponse {
  id: string;
  visitId: string;
  dealId: string;
  number: string;
  productType: EntityWithSysName;
  generalStatus: ProductStatus;
  controlledBy: string;
  isControlled: number;
  isImported: number;

  footSize: number;
  growth: number;
  weight: number;
  amputationSide: string;
  model3d: number;
  htv: number;
  lamination: number;
  cosmeticCladding: number;

  prothesisNkMeasurement: ProthesisNkMeasurement;

  name: string;
  dateOfIssue: string;
  guarantee: string;
  prothesisFastening: string;
  sleeveMaterial: string;
  prothesisParts: string;
  dateSendingToBranch: string;
  branch: string;
  comment: string;

  assemblyExecutor1: string;
  assemblyExecutor2: string;
  assemblyFinished: string;
  assemblyStatus: number;

  blockingExecutor1: string;
  blockingExecutor2: string;
  blockingFinished: string;
  blockingStatus: number;

  deliveryExecutor1: string;
  deliveryExecutor2: string;
  deliveryFinished: string;
  deliveryStatus: number;

  firstFittingExecutor1: string;
  firstFittingExecutor2: string;
  firstFittingFinished: string;
  firstFittingStatus: number;

  htvExecutor1: string;
  htvExecutor2: string;
  htvFinished: string;
  htvStatus: number;

  impressionTakingExecutor1: string;
  impressionTakingExecutor2: string;
  impressionTakingFinished: string;
  impressionTakingStatus: number;

  impressionProcessingExecutor1: string;
  impressionProcessingExecutor2: string;
  impressionProcessingFinished: string;
  impressionProcessingStatus: number;

  laminationExecutor1: string;
  laminationExecutor2: string;
  laminationFinished: string;
  laminationStatus: number;

  model3dExecutor1: string;
  model3dExecutor2: string;
  model3dFinished: string;
  model3dStatus: number;

  productionCosmeticCladdingExecutor1: string;
  productionCosmeticCladdingExecutor2: string;
  productionCosmeticCladdingFinished: string;
  productionCosmeticCladdingStatus: number;

  secondFittingExecutor1: string;
  secondFittingExecutor2: string;
  secondFittingFinished: string;
  secondFittingStatus: number;

  thirdFittingExecutor1: string;
  thirdFittingExecutor2: string;
  thirdFittingFinished: string;
  thirdFittingStatus: number;

  createModel3dExecutor1: string;
  createModel3dExecutor2: string;
  createModel3dExecutorFinished: string;
  createModel3dStatus: number;
}
