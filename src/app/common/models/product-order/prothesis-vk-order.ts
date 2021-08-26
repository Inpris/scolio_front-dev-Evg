import { ProductOrder } from '@common/models/product-order/product-order';
import { ProthesisVkOrderResponse } from '@common/interfaces/product-order/Prothesis-vk-order-response';
import { ProthesisVkMeasurement } from '@common/interfaces/product-order/Prothesis-vk-measurement';
import { Entity } from '@common/interfaces/Entity';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { extract } from '@common/utils/object';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { ProthesisVkOrderUpdate } from '@common/interfaces/product-order/Prothesis-vk-order-update';
import { DateUtils } from '@common/utils/date';

export class ProthesisVkOrder extends ProductOrder implements ProthesisVkOrderResponse {
  prothesisVkMeasurement: ProthesisVkMeasurement;
  prothesisVkType: Entity;
  color: string;

  assemblyExecutor1: Entity;
  assemblyExecutor2: Entity;
  assemblyStatus: ProductOperationStatus;

  blockingExecutor1: Entity;
  blockingExecutor2: Entity;
  blockingStatus: ProductOperationStatus;

  cuttingExecutor1: Entity;
  cuttingExecutor2: Entity;
  cuttingStatus: ProductOperationStatus;

  fastenersInstallExecutor1: Entity;
  fastenersInstallExecutor2: Entity;
  fastenersInstallStatus: ProductOperationStatus;

  fittingExecutor1: Entity;
  fittingExecutor2: Entity;
  fittingStatus: ProductOperationStatus;

  impressionProcessExecutor1: Entity;
  impressionProcessExecutor2: Entity;
  impressionProcessStatus: ProductOperationStatus;

  impressionTakingExecutor1: Entity;
  impressionTakingExecutor2: Entity;
  impressionTakingStatus: ProductOperationStatus;

  laminationExecutor1: Entity;
  laminationExecutor2: Entity;
  laminationStatus: ProductOperationStatus;

  constructor(data: ProthesisVkOrderResponse) {
    super(data);
    this.assemblyExecutor1 = data.assemblyExecutor1;
    this.assemblyExecutor2 = data.assemblyExecutor2;
    this.assemblyStatus = data.assemblyStatus;
    this.blockingExecutor1 = data.blockingExecutor1;
    this.blockingExecutor2 = data.blockingExecutor2;
    this.blockingStatus = data.blockingStatus;
    this.color = data.color;
    this.cuttingExecutor1 = data.cuttingExecutor1;
    this.cuttingExecutor2 = data.cuttingExecutor2;
    this.cuttingStatus = data.cuttingStatus;
    this.fastenersInstallExecutor1 = data.fastenersInstallExecutor1;
    this.fastenersInstallExecutor2 = data.fastenersInstallExecutor2;
    this.fastenersInstallStatus = data.fastenersInstallStatus;
    this.fittingExecutor1 = data.fittingExecutor1;
    this.fittingExecutor2 = data.fittingExecutor2;
    this.fittingStatus = data.fittingStatus;
    this.impressionProcessExecutor1 = data.impressionProcessExecutor1;
    this.impressionProcessExecutor2 = data.impressionProcessExecutor2;
    this.impressionProcessStatus = data.impressionProcessStatus;
    this.impressionTakingExecutor1 = data.impressionTakingExecutor1;
    this.impressionTakingExecutor2 = data.impressionTakingExecutor2;
    this.impressionTakingStatus = data.impressionTakingStatus;
    this.laminationExecutor1 = data.laminationExecutor1;
    this.laminationExecutor2 = data.laminationExecutor2;
    this.laminationStatus = data.laminationStatus;
    this.prothesisVkMeasurement = data.prothesisVkMeasurement;
    this.prothesisVkType = data.prothesisVkType;
  }

  public static fromFormData(formData) {
    return new ProthesisVkOrder({
      ...formData.orderData,
      ...formData.issueData,
      ...formData.modelData,
      ...formData.manufacturingData,
      generalStatus: formData.generalStatus,
      prothesisVkMeasurement: formData.measurementData,
      productType: ProductOrderTypes.PROTHESISVK,
    } as ProthesisVkOrderResponse);
  }

  public static getSchema() {
    return [
      { name: 'Блоковка', field: 'blocking' },
      { name: 'Снятие слепка', field: 'impressionTaking' },
      { name: 'Обработка слепка', field: 'impressionProcess' },
      { name: 'Ламинация', field: 'lamination' },
      { name: 'Сборка', field: 'assembly' },
      { name: 'Спиливание', field: 'cutting' },
      { name: 'Установка крепления', field: 'fastenersInstall' },
      { name: 'Примерка', field: 'fitting' },
    ];
  }

  public toFormData() {
    return {
      generalStatus: this.generalStatus,
      orderData: this.getOrderData(),
      measurementData: this.getMeasurementData(),
      issueData: this.getIssueData(),
      modelData: this.getModelData(),
      manufacturingData: this.getManufacturingData(),
    };
  }

  public getOrderData() {
    return {
      id: this.id,
      name: this.name,
      dateOfIssue: this.dateOfIssue,
      prothesisVkType: this.prothesisVkType,
      color: this.color,
      dateOfIssueTurner: this.dateOfIssueTurner,
      dateSendingToBranch: this.dateSendingToBranch,
      branch: this.branch,
    };
  }

  public getMeasurementData() {
    return {
      bzpvkPL1: this.prothesisVkMeasurement.bzpvkPL1,
      bzpvkPL2: this.prothesisVkMeasurement.bzpvkPL2,
      bzpvkPL3: this.prothesisVkMeasurement.bzpvkPL3,
      bzpvkPL4: this.prothesisVkMeasurement.bzpvkPL4,
      bzpvkPL5: this.prothesisVkMeasurement.bzpvkPL5,
      bzpvkPL6: this.prothesisVkMeasurement.bzpvkPL6,
      bzpvkPL7: this.prothesisVkMeasurement.bzpvkPL7,
      bzpvkPC1: this.prothesisVkMeasurement.bzpvkPC1,
      bzpvkPC2: this.prothesisVkMeasurement.bzpvkPC2,
      bzpvkPC3: this.prothesisVkMeasurement.bzpvkPC3,
      bzpvkPC4: this.prothesisVkMeasurement.bzpvkPC4,
      bzpvkPR1: this.prothesisVkMeasurement.bzpvkPR1,
      bzpvkPR2: this.prothesisVkMeasurement.bzpvkPR2,
      bzpvkPR3: this.prothesisVkMeasurement.bzpvkPR3,
      bzpvkPR4: this.prothesisVkMeasurement.bzpvkPR4,
      bzpvkPR5: this.prothesisVkMeasurement.bzpvkPR5,
      bzpvkPR6: this.prothesisVkMeasurement.bzpvkPR6,
      bzpvkPR7: this.prothesisVkMeasurement.bzpvkPR7,
      bzpvkPR8: this.prothesisVkMeasurement.bzpvkPR8,
      bzpvkPB1: this.prothesisVkMeasurement.bzpvkPB1,
      bzpvkPB2: this.prothesisVkMeasurement.bzpvkPB2,
      bzpvkPB3: this.prothesisVkMeasurement.bzpvkPB3,
      bzpvkPB4: this.prothesisVkMeasurement.bzpvkPB4,
      bzpvkPB5: this.prothesisVkMeasurement.bzpvkPB5,
    };
  }

  public getManufacturingData() {
    return {
      isControlled: this.isControlled,
      controlledBy: this.controlledBy,
      comment: this.comment,
      blockingExecutor1: this.blockingExecutor1,
      blockingExecutor2: this.blockingExecutor2,
      blockingStatus: this.blockingStatus,
      cuttingExecutor1: this.cuttingExecutor1,
      cuttingExecutor2: this.cuttingExecutor2,
      cuttingStatus: this.cuttingStatus,
      fastenersInstallExecutor1: this.fastenersInstallExecutor1,
      fastenersInstallExecutor2: this.fastenersInstallExecutor2,
      fastenersInstallStatus: this.fastenersInstallStatus,
      impressionTakingExecutor1: this.impressionTakingExecutor1,
      impressionTakingExecutor2: this.impressionTakingExecutor2,
      impressionTakingStatus: this.impressionTakingStatus,
      impressionProcessExecutor1: this.impressionProcessExecutor1,
      impressionProcessExecutor2: this.impressionProcessExecutor2,
      impressionProcessStatus: this.impressionProcessStatus,
      laminationExecutor1: this.laminationExecutor1,
      laminationExecutor2: this.laminationExecutor2,
      laminationStatus: this.laminationStatus,
      assemblyExecutor1: this.assemblyExecutor1,
      assemblyExecutor2: this.assemblyExecutor2,
      assemblyStatus: this.assemblyStatus,
      fittingExecutor1: this.fittingExecutor1,
      fittingExecutor2: this.fittingExecutor2,
      fittingStatus: this.fittingStatus,
    };
  }

  public toUpdateModel(): ProthesisVkOrderUpdate {
    return {
      generalStatus: this.generalStatus,
      color: this.color,
      prothesisVkMeasurement: this.prothesisVkMeasurement,
      prothesisVkTypeId: extract(this, 'prothesisVkType.id'),

      blockingExecutor1Id: extract(this, 'blockingExecutor1.id'),
      blockingExecutor2Id: extract(this, 'blockingExecutor2.id'),
      blockingStatus: this.blockingStatus,

      cuttingExecutor1Id: extract(this, 'cuttingExecutor1.id'),
      cuttingExecutor2Id: extract(this, 'cuttingExecutor2.id'),
      cuttingStatus: this.cuttingStatus,

      fastenersInstallExecutor1Id: extract(this, 'fastenersInstallExecutor1.id'),
      fastenersInstallExecutor2Id: extract(this, 'fastenersInstallExecutor2.id'),
      fastenersInstallStatus: this.fastenersInstallStatus,

      impressionTakingExecutor1Id: extract(this, 'impressionTakingExecutor1.id'),
      impressionTakingExecutor2Id: extract(this, 'impressionTakingExecutor2.id'),
      impressionTakingStatus: this.impressionTakingStatus,

      impressionProcessExecutor1Id: extract(this, 'impressionProcessExecutor1.id'),
      impressionProcessExecutor2Id: extract(this, 'impressionProcessExecutor2.id'),
      impressionProcessStatus: this.impressionProcessStatus,

      laminationExecutor1Id: extract(this, 'laminationExecutor1.id'),
      laminationExecutor2Id: extract(this, 'laminationExecutor2.id'),
      laminationStatus: this.laminationStatus,

      assemblyExecutor1Id: extract(this, 'assemblyExecutor1.id'),
      assemblyExecutor2Id: extract(this, 'assemblyExecutor2.id'),
      assemblyStatus: this.assemblyStatus,

      fittingExecutor1Id: extract(this, 'fittingExecutor1.id'),
      fittingExecutor2Id: extract(this, 'fittingExecutor2.id'),
      fittingStatus: this.fittingStatus,
      name: this.name,
      model3DExecutor1Id: extract(this, 'model3DExecutor1.id'),
      model3DExecutor2Id: extract(this, 'model3DExecutor2.id'),
      participationPercent1: this.participationPercent1,
      participationPercent2: this.participationPercent2,
      execution3DModelEnd: this.execution3DModelEnd && DateUtils.toISODateTimeString(this.execution3DModelEnd),
      execution3DModelStart: this.execution3DModelStart && DateUtils.toISODateTimeString(this.execution3DModelStart),
      dateOfIssue: this.dateOfIssue && DateUtils.toISODateTimeString(this.dateOfIssue),
      issuer1Id: extract(this, 'issuer1.id'),
      issuer2Id: extract(this, 'issuer2.id'),
      dateOfIssueTurner: this.dateOfIssueTurner && DateUtils.toISODateTimeString(this.dateOfIssueTurner),
      dateSendingToBranch: this.dateSendingToBranch && DateUtils.toISODateTimeString(this.dateSendingToBranch),
      branchId: extract(this, 'branch.id'),
      isControlled: this.isControlled,
      controlledById: extract(this, 'controlledBy.id'),
      comment: this.comment,
      is3DModelReady: this.is3DModelReady,
    };
  }
}
