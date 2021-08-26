import { EntityWithSysName } from '../EntityWithSysName';
import { Entity } from '../Entity';
import { ProductStatus } from '@modules/common/enums/product-status.enum';

export interface ProductOrderResponse {
  id: string;
  name: string;
  price: number;
  visitId: string;
  dealId: string;
  number: string;
  productType: EntityWithSysName;
  generalStatus: ProductStatus;
  model3DExecutor1: Entity;
  model3DExecutor2: Entity;
  participationPercent1: number;
  participationPercent2: number;
  execution3DModelEnd: string;
  execution3DModelStart: string;
  is3DModelReady: boolean;
  dateOfIssue: string;
  dateOfIssueTurner: string;
  dateSendingToBranch: string;
  issuer1: Entity;
  issuer2: Entity;
  branch: Entity;
  isControlled: boolean;
  controlledBy: Entity;
  comment: string;
  isCorrection: boolean;
  productionMethod?: string;
  oldSystemId?: string;
}
