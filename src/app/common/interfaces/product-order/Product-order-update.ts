import { ProductStatus } from '@common/enums/product-status.enum';

export interface ProductOrderUpdate {
  name: string;
  price?: number;
  generalStatus?: ProductStatus;
  model3DExecutor1Id?: string;
  model3DExecutor2Id?: string;
  participationPercent1?: number;
  participationPercent2?: number;
  execution3DModelEnd?: string;
  execution3DModelStart?: string;
  dateOfIssue?: string;
  issuer1Id?: string;
  issuer2Id?: string;
  dateOfIssueTurner?: string;
  dateSendingToBranch?: string;
  branchId: string;
  isControlled?: boolean;
  controlledById?: string;
  comment?: string;
  is3DModelReady?: boolean;
}
