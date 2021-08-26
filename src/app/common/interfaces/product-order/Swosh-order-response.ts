import { CorsetOrderResponse } from '@common/interfaces/product-order/Corset-order-response';
import { Entity } from '@common/interfaces/Entity';
import { ProductOperationStatus } from '@common/enums/product-operation-status';

export interface SwoshOrderResponse extends CorsetOrderResponse {
  assemblyExecutor1: Entity;
  assemblyExecutor2: Entity;
  assemblyStatus: ProductOperationStatus;
}
