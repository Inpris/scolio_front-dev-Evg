import { ApparatusOrderUpdate } from '@common/interfaces/product-order/apparatus-order/Apparatus-order-update';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { Entity } from '@common/interfaces/Entity';

export interface RobotLaminationOrderUpdate extends ApparatusOrderUpdate {
  laminationStatus: ProductOperationStatus;
  laminationExecutor1Id: Entity;
  laminationExecutor2Id: Entity;
}
