import { ProductOrderResponse } from './Product-order-response';
import { ProthesisVkMeasurement } from './Prothesis-vk-measurement';
import { Entity } from '../Entity';
import { ProductOperationStatus } from '@common/enums/product-operation-status';

export interface ProthesisVkOrderResponse extends ProductOrderResponse {
  prothesisVkMeasurement: ProthesisVkMeasurement;
  prothesisVkType: Entity;
  color: string;

  blockingExecutor1: Entity;
  blockingExecutor2: Entity;
  blockingStatus: ProductOperationStatus;

  impressionTakingExecutor1: Entity;
  impressionTakingExecutor2: Entity;
  impressionTakingStatus: ProductOperationStatus;

  impressionProcessExecutor1: Entity;
  impressionProcessExecutor2: Entity;
  impressionProcessStatus: ProductOperationStatus;

  laminationExecutor1: Entity;
  laminationExecutor2: Entity;
  laminationStatus: ProductOperationStatus;

  assemblyExecutor1: Entity;
  assemblyExecutor2: Entity;
  assemblyStatus: ProductOperationStatus;

  cuttingExecutor1: Entity;
  cuttingExecutor2: Entity;
  cuttingStatus: ProductOperationStatus;

  fastenersInstallExecutor1: Entity;
  fastenersInstallExecutor2: Entity;
  fastenersInstallStatus: ProductOperationStatus;

  fittingExecutor1: Entity;
  fittingExecutor2: Entity;
  fittingStatus: ProductOperationStatus;
}
