import { ApparatusOrder } from '@common/models/product-order/apparatus-order/apparatus-order';
import { ApparatusOrderResponse } from '@common/interfaces/product-order/apparatus-order/Apparatus-order-response';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { ProductionMethod } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/models/production-method';

export class RobotBlockingOrder extends ApparatusOrder {
  constructor(data: ApparatusOrderResponse) {
    super(data);
  }

  public static getSchema() {
    return  [
      { name: 'Тушка', field: 'carcass' },
      { name: 'Блоковка', field: 'blocking' },
      { name: 'Спиливание', field: 'cutting' },
      { name: 'Обточка', field: 'turning' },
      { name: 'Установка крепления', field: 'fastenersInstall' },
    ];
  }

  public static getManufactoringProgress(): { [key: string]: boolean } {
    return {
      carcass: false,
      blocking: false,
      cutting: false,
      turning: false,
      fastenersInstall: false,
    };
  }

  public static fromFormData(formData) {
    return new RobotBlockingOrder({
      ...super.fromFormData(formData),
      productionMethod: ProductionMethod.ROBOT_WITH_BLOCKING,
      isImported: formData.isImported,
    });
  }
}
