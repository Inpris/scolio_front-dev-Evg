import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { ProductStatus } from '@modules/common/enums/product-status.enum';
import { Entity } from '@common/interfaces/Entity';
import { ProductOrderResponse } from '@common/interfaces/product-order/Product-order-response';
import { DateUtils } from '@common/utils/date';

export abstract class ProductOrder implements ProductOrderResponse {
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
  isImported: boolean;

  protected constructor(data: ProductOrderResponse) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.visitId = data.visitId;
    this.dealId = data.dealId;
    this.number = data.number;
    this.productType = data.productType;
    this.generalStatus = data.generalStatus;
    this.model3DExecutor1 = data.model3DExecutor1;
    this.model3DExecutor2 = data.model3DExecutor2;
    this.participationPercent1 = data.participationPercent1;
    this.participationPercent2 = data.participationPercent2;
    this.execution3DModelEnd = data.execution3DModelEnd;
    this.execution3DModelStart = data.execution3DModelStart;
    this.is3DModelReady = data.is3DModelReady;
    this.dateOfIssue = data.dateOfIssue && DateUtils.toISODateTimeString(data.dateOfIssue);
    this.dateOfIssueTurner = data.dateOfIssueTurner;
    this.dateSendingToBranch = data.dateSendingToBranch;
    this.issuer1 = data.issuer1;
    this.issuer2 = data.issuer2;
    this.branch = data.branch;
    this.isControlled = data.isControlled;
    this.controlledBy = data.controlledBy;
    this.comment = data.comment;
    this.isCorrection = data.isCorrection;
    this.isImported = !!data.oldSystemId;
  }

  abstract toFormData();
  abstract toUpdateModel();

  public getIssueData() {
    return {
      issuer1: this.issuer1,
      issuer2: this.issuer2,
      generalStatus: this.generalStatus,
    };
  }

  public getModelData() {
    return {
      execution3DModelEnd: this.execution3DModelEnd,
      execution3DModelStart: this.execution3DModelStart,
      is3DModelReady: this.is3DModelReady,
      model3DExecutor1: this.model3DExecutor1,
      participationPercent1: this.participationPercent1,
      model3DExecutor2: this.model3DExecutor2,
      participationPercent2: this.participationPercent2,
    };
  }
}
