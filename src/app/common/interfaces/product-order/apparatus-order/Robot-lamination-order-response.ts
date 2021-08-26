import { ApparatusOrderResponse } from '@common/interfaces/product-order/apparatus-order/Apparatus-order-response';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { Entity } from '@common/interfaces/Entity';

export interface RobotLaminationOrderResponse extends ApparatusOrderResponse {
  laminationStatus: ProductOperationStatus;
  laminationExecutor1: Entity;
  laminationExecutor2: Entity;
}
