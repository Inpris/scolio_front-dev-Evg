import { ProductOrderUpdate } from './Product-order-update';
import { ProthesisVkMeasurement } from './Prothesis-vk-measurement';
import { ProductOperationStatus } from '@common/enums/product-operation-status';

export interface ProthesisVkOrderUpdate extends ProductOrderUpdate {
  prothesisVkMeasurement: ProthesisVkMeasurement;
  prothesisVkTypeId: string;
  color: string;

  blockingExecutor1Id?: string;
  blockingExecutor2Id?: string;
  blockingStatus?: ProductOperationStatus;

  impressionTakingExecutor1Id?: string;
  impressionTakingExecutor2Id?: string;
  impressionTakingStatus?: ProductOperationStatus;

  impressionProcessExecutor1Id?: string;
  impressionProcessExecutor2Id?: string;
  impressionProcessStatus?: ProductOperationStatus;

  laminationExecutor1Id?: string;
  laminationExecutor2Id?: string;
  laminationStatus?: ProductOperationStatus;

  assemblyExecutor1Id?: string;
  assemblyExecutor2Id?: string;
  assemblyStatus?: ProductOperationStatus;

  cuttingExecutor1Id?: string;
  cuttingExecutor2Id?: string;
  cuttingStatus?: ProductOperationStatus;

  fastenersInstallExecutor1Id?: string;
  fastenersInstallExecutor2Id?: string;
  fastenersInstallStatus?: ProductOperationStatus;

  fittingExecutor1Id?: string;
  fittingExecutor2Id?: string;
  fittingStatus?: ProductOperationStatus;
}
