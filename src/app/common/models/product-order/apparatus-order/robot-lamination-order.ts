import { ApparatusOrder } from '@common/models/product-order/apparatus-order/apparatus-order';
import { RobotLaminationOrderResponse } from '@common/interfaces/product-order/apparatus-order/Robot-lamination-order-response';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { Entity } from '@common/interfaces/Entity';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { ProductionMethod } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/models/production-method';
import { extract } from '@common/utils/object';

export class RobotLaminationOrder extends ApparatusOrder {
  public laminationStatus: ProductOperationStatus;
  public laminationExecutor1: Entity;
  public laminationExecutor2: Entity;

  constructor(data: RobotLaminationOrderResponse) {
    super(data);
    this.laminationStatus = data.laminationStatus;
    this.laminationExecutor1 = data.laminationExecutor1;
    this.laminationExecutor2 = data.laminationExecutor2;
  }

  public static getSchema() {
    return [
      { name: 'Тушка', field: 'carcass' },
      { name: 'Ламинация', field: 'lamination' },
      { name: 'Спиливание', field: 'cutting' },
      { name: 'Обточка', field: 'turning' },
      { name: 'Установка крепления', field: 'fastenersInstall' },
    ];
  }

  public static getManufactoringProgress(): { [key: string]: boolean } {
    return {
      carcass: false,
      lamination: false,
      cutting: false,
      turning: false,
      fastenersInstall: false,
    };
  }

  public static fromFormData(formData) {
    return new RobotLaminationOrder({
      ...super.fromFormData(formData),
      ...formData.manufacturingData,
      productType: ProductOrderTypes.ROBOT_WITH_LAMINATION,
      productionMethod: ProductionMethod.ROBOT_WITH_LAMINATION,
    });
  }

  public getManufacturingData() {
    return {
      ...super.getManufacturingData(),
      laminationStatus: this.laminationStatus,
      laminationExecutor1: this.laminationExecutor1,
      laminationExecutor2: this.laminationExecutor2,
    };
  }

  public toUpdateModel() {
    return {
      ...super.toUpdateModel(),
      productionMethod: this.productionMethod,
      laminationStatus: this.laminationStatus,
      laminationExecutor1Id: extract(this, 'laminationExecutor1.id'),
      laminationExecutor2Id: extract(this, 'laminationExecutor2.id'),
    };
  }
}
