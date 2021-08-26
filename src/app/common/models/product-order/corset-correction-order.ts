import { ProductOrder } from '@common/models/product-order/product-order';
import { CorsetCorrectionOrderResponse } from '@common/interfaces/product-order/Corset-correction-order-response';
import { Entity } from '@common/interfaces/Entity';
import { extract } from '@common/utils/object';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { ProductStatus } from '@common/enums/product-status.enum';
import { CorsetMeasurement } from '@common/interfaces/product-order/Corset-measurement';

export class CorsetCorrectionOrder extends ProductOrder implements CorsetCorrectionOrderResponse {
  corsetMeasurement: CorsetMeasurement;
  enlargedFrontCavity: string;
  exctraCorrectionVariants: string;
  given: boolean;
  insertionThoraxInFront: string;
  liftingOfTheAxillary: string;
  pasteOfBreast: string;
  pasteOfBreastFrom: string;
  pasteOfBreastTo: string;
  pasteOfLoin: string;
  pasteOfLoinFrom: string;
  pasteOfLoinTo: string;
  product: Entity;
  productionTime: string;
  shiftOfTheAxillary: string;

  constructor(data: CorsetCorrectionOrderResponse) {
    super(data);
    this.corsetMeasurement = data.corsetMeasurement || {} as CorsetMeasurement;
    this.enlargedFrontCavity = data.enlargedFrontCavity;
    this.exctraCorrectionVariants = data.exctraCorrectionVariants;
    this.given = data.given;
    this.insertionThoraxInFront = data.insertionThoraxInFront;
    this.liftingOfTheAxillary = data.liftingOfTheAxillary;
    this.pasteOfBreast = data.pasteOfBreast;
    this.pasteOfBreastFrom = data.pasteOfBreastFrom;
    this.pasteOfBreastTo = data.pasteOfBreastTo;
    this.pasteOfLoin = data.pasteOfLoin;
    this.pasteOfLoinFrom = data.pasteOfLoinFrom;
    this.pasteOfLoinTo = data.pasteOfLoinTo;
    this.product = data.product;
    this.productionTime = data.productionTime;
    this.shiftOfTheAxillary = data.shiftOfTheAxillary;
  }

  static fromFormData(formData) {
    return new CorsetCorrectionOrder({
      ...formData.orderData,
      ...formData.correction,
      ...formData.issueData,
      corsetMeasurement: formData.measurementData,
      productType: ProductOrderTypes.CORSET,
      given: formData.issueData.generalStatus === ProductStatus.GIVEN,
      comment: formData.comment,
    });
  }

  toFormData() {
    return {
      orderData: this.getDeviceData(),
      correction: this.getCorrectionData(),
      issueData: this.getIssueData(),
      measurementData: this.getMeasurementData(),
      comment: this.comment,
    };
  }

  toUpdateModel() {
    return Object.assign({}, this, {
      productId: extract(this, 'product.id'),
      issuer1Id: extract(this, 'issuer1.id'),
      issuer2Id: extract(this, 'issuer2.id'),
      branchId: extract(this, 'branch.id'),
      corsetMeasurement: this.getMeasurementData(),
    });
  }

  public getIssueData() {
    return {
      ...super.getIssueData(),
      generalStatus: this.given ? ProductStatus.GIVEN : ProductStatus.ORDERBLANK,
    };
  }

  public getCorrectionData() {
    return {
      enlargedFrontCavity: this.enlargedFrontCavity,
      exctraCorrectionVariants: this.exctraCorrectionVariants,
      insertionThoraxInFront: this.insertionThoraxInFront,
      liftingOfTheAxillary: this.liftingOfTheAxillary,
      pasteOfBreast: this.pasteOfBreast,
      pasteOfBreastFrom: this.pasteOfBreastFrom,
      pasteOfBreastTo: this.pasteOfBreastTo,
      pasteOfLoin: this.pasteOfLoin,
      pasteOfLoinFrom: this.pasteOfLoinFrom,
      pasteOfLoinTo: this.pasteOfLoinTo,
      shiftOfTheAxillary: this.shiftOfTheAxillary,
    };
  }

  public getDeviceData() {
    return {
      id: this.id,
      name: this.name,
      dateOfIssue: this.dateOfIssue,
      dateOfIssueTurner: this.dateOfIssueTurner,
      dateSendingToBranch: this.dateSendingToBranch,
      branch: this.branch,
      product: this.product,
    };
  }

  public getMeasurementData() {
    return {
      circle1: this.corsetMeasurement.circle1,
      fas1: this.corsetMeasurement.fas1,
      circle2: this.corsetMeasurement.circle2,
      fas2: this.corsetMeasurement.fas2,
      circle3: this.corsetMeasurement.circle3,
      fas3: this.corsetMeasurement.fas3,
      circle4: this.corsetMeasurement.circle4,
      fas4: this.corsetMeasurement.fas4,
      circle5: this.corsetMeasurement.circle5,
      fas5: this.corsetMeasurement.fas5,
    };
  }

}
