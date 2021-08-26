import { ApparatusOrderResponse } from '@common/interfaces/product-order/apparatus-order/Apparatus-order-response';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { Entity } from '@common/interfaces/Entity';

export interface MoldOrderResponse extends ApparatusOrderResponse {
  impressionTakingStatus: ProductOperationStatus;
  impressionTakingExecutor1: Entity;
  impressionTakingExecutor2: Entity;
  impressionProcessStatus: ProductOperationStatus;
  impressionProcessExecutor1: Entity;
  impressionProcessExecutor2: Entity;
  laminationStatus: ProductOperationStatus;
  laminationExecutor1: Entity;
  laminationExecutor2: Entity;
  assemblyExecutor1: Entity;
  assemblyExecutor2: Entity;
  assemblyStatus: ProductOperationStatus;
  fittingExecutor1: Entity;
  fittingExecutor2: Entity;
  fittingStatus: ProductOperationStatus;
}
