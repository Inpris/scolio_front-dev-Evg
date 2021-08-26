import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { CorsetOrderUpdate } from '@common/interfaces/product-order/Corset-order-update';

export interface SwoshOrderUpdate extends CorsetOrderUpdate {
  assemblyExecutor1Id: string;
  assemblyExecutor2Id: string;
  assemblyStatus: ProductOperationStatus;
}
