import { ApparatusOrderUpdate } from '@common/interfaces/product-order/apparatus-order/Apparatus-order-update';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { Entity } from '@common/interfaces/Entity';

export interface MoldOrderUpdate extends ApparatusOrderUpdate {
  castOffStatus: ProductOperationStatus;
  castOffExecutor1Id: string;
  castOffExecutor2Id: string;
  moldProcessingStatus: ProductOperationStatus;
  moldProcessingExecutor1Id: Entity;
  moldProcessingExecutor2Id: Entity;
  laminationStatus: ProductOperationStatus;
  laminationExecutor1Id: Entity;
  laminationExecutor2Id: Entity;
  assemblyExecutor1Id: string;
  assemblyExecutor2Id: string;
  assemblyStatus: ProductOperationStatus;
  fittingExecutor1Id?: string;
  fittingExecutor2Id?: string;
  fittingStatus?: ProductOperationStatus;
}
