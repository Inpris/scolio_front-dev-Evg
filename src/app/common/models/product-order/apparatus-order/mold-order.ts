import { ApparatusOrder } from '@common/models/product-order/apparatus-order/apparatus-order';
import { MoldOrderResponse } from '@common/interfaces/product-order/apparatus-order/Mold-order-response';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { Entity } from '@common/interfaces/Entity';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { ProductionMethod } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/models/production-method';
import { ProductStatus } from '@common/enums/product-status.enum';
import { extract } from '@common/utils/object';

export class MoldOrder extends ApparatusOrder {
  public impressionTakingStatus: ProductOperationStatus;
  public impressionTakingExecutor1: Entity;
  public impressionTakingExecutor2: Entity;
  public impressionProcessStatus: ProductOperationStatus;
  public impressionProcessExecutor1: Entity;
  public impressionProcessExecutor2: Entity;
  public laminationStatus: ProductOperationStatus;
  public laminationExecutor1: Entity;
  public laminationExecutor2: Entity;
  public assemblyExecutor1: Entity;
  public assemblyExecutor2: Entity;
  public assemblyStatus: ProductOperationStatus;
  public fittingExecutor1: Entity;
  public fittingExecutor2: Entity;
  public fittingStatus: ProductOperationStatus;

  constructor(data: MoldOrderResponse) {
    super(data);
    this.productionMethod = ProductionMethod.MOLD;
    this.impressionTakingStatus = data.impressionTakingStatus;
    this.impressionTakingExecutor1 = data.impressionTakingExecutor1;
    this.impressionTakingExecutor2 = data.impressionTakingExecutor2;
    this.impressionProcessStatus = data.impressionProcessStatus;
    this.impressionProcessExecutor1 = data.impressionProcessExecutor1;
    this.impressionProcessExecutor2 = data.impressionProcessExecutor2;
    this.laminationStatus = data.laminationStatus;
    this.laminationExecutor1 = data.laminationExecutor1;
    this.laminationExecutor2 = data.laminationExecutor2;
    this.assemblyExecutor1 = data.assemblyExecutor1;
    this.assemblyExecutor2 = data.assemblyExecutor2;
    this.assemblyStatus = data.assemblyStatus;
    this.fittingExecutor1 = data.fittingExecutor1;
    this.fittingExecutor2 = data.fittingExecutor2;
    this.fittingStatus = data.fittingStatus;
    this.is3DModelReady = true;

    if (this.generalStatus === ProductStatus.MODEL3D) {
      this.generalStatus = ProductStatus.MAKING;
    }
  }

  public static getSchema() {
    return [
      { name: 'Снятие слепка', field: 'impressionTaking' },
      { name: 'Обработка слепка', field: 'impressionProcess' },
      { name: 'Ламинация', field: 'lamination' },
      { name: 'Сборка', field: 'assembly' },
      { name: 'Примерка', field: 'fitting' },
      { name: 'Спиливание', field: 'cutting' },
      { name: 'Обточка', field: 'turning' },
    ];
  }

  public static getManufactoringProgress(): { [key: string]: boolean } {
    return {
      impressionTaking: false,
      impressionProcess: false,
      lamination: false,
      assembly: false,
      fitting: false,
      cutting: false,
      turning: false,
    };
  }

  public static fromFormData(formData) {
    return new MoldOrder({
      ...super.fromFormData(formData),
      ...formData.manufacturingData,
      productType: ProductOrderTypes.MOLD,
      productionMethod: ProductionMethod.MOLD,
    });
  }

  public getManufacturingData() {
    return {
      ...super.getManufacturingData(),
      impressionTakingStatus: this.impressionTakingStatus,
      impressionTakingExecutor1: this.impressionTakingExecutor1,
      impressionTakingExecutor2: this.impressionTakingExecutor2,
      impressionProcessStatus: this.impressionProcessStatus,
      impressionProcessExecutor1: this.impressionProcessExecutor1,
      impressionProcessExecutor2: this.impressionProcessExecutor2,
      laminationStatus: this.laminationStatus,
      laminationExecutor1: this.laminationExecutor1,
      laminationExecutor2: this.laminationExecutor2,
      assemblyExecutor1: this.assemblyExecutor1,
      assemblyExecutor2: this.assemblyExecutor2,
      assemblyStatus: this.assemblyStatus,
      fittingExecutor1: this.fittingExecutor1,
      fittingExecutor2: this.fittingExecutor2,
      fittingStatus: this.fittingStatus,
    };
  }

  public toUpdateModel() {
    return {
      ...super.toUpdateModel(),
      productionMethod: this.productionMethod,
      impressionTakingStatus: this.impressionTakingStatus,
      impressionTakingExecutor1Id: extract(this, 'impressionTakingExecutor1.id'),
      impressionTakingExecutor2Id: extract(this, 'impressionTakingExecutor2.id'),
      impressionProcessStatus: this.impressionProcessStatus,
      impressionProcessExecutor1Id: extract(this, 'impressionProcessExecutor1.id'),
      impressionProcessExecutor2Id: extract(this, 'impressionProcessExecutor2.id'),
      laminationStatus: this.laminationStatus,
      laminationExecutor1Id: extract(this, 'laminationExecutor1.id'),
      laminationExecutor2Id: extract(this, 'laminationExecutor2.id'),
      assemblyStatus: this.assemblyStatus,
      assemblyExecutor1Id: extract(this, 'assemblyExecutor1.id'),
      assemblyExecutor2Id: extract(this, 'assemblyExecutor2.id'),
      fittingStatus: this.fittingStatus,
      fittingExecutor1Id: extract(this, 'fittingExecutor1.id'),
      fittingExecutor2Id: extract(this, 'fittingExecutor2.id'),
      is3DModelReady: false,
    };
  }
}
