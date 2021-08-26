import { CorsetOrder } from '@common/models/product-order/corset-order';
import { SwoshOrderResponse } from '@common/interfaces/product-order/Swosh-order-response';
import { Entity } from '@common/interfaces/Entity';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { extract } from '@common/utils/object';
import { SwoshOrderUpdate } from '@common/interfaces/product-order/Swosh-order-update';

export class SwoshOrder extends CorsetOrder implements SwoshOrderResponse {
  assemblyExecutor1: Entity;
  assemblyExecutor2: Entity;
  assemblyStatus: ProductOperationStatus;

  constructor(data: SwoshOrderResponse) {
    super(data);
    this.assemblyExecutor1 = data.assemblyExecutor1;
    this.assemblyExecutor2 = data.assemblyExecutor2;
    this.assemblyStatus = data.assemblyStatus;
  }

  public static fromFormData(formData): SwoshOrder {
    return new SwoshOrder({
      ...formData.corsetData,
      ...formData.issueData,
      ...formData.modelData,
      ...formData.manufacturingData,
      generalStatus: formData.generalStatus,
      corsetMeasurement: formData.measurementData,
      productType: ProductOrderTypes.SWOSH,
      productionTime: formData.productionTime,
    } as SwoshOrderResponse);
  }

  public static getSchema() {
    return [
      { name: 'Тушка', field: 'carcass' },
      { name: 'Блоковка', field: 'blocking' },
      { name: 'Спиливание', field: 'cutting' },
      { name: 'Обточка', field: 'turning' },
      { name: 'Установка крепления', field: 'fastenersInstall' },
      { name: 'Сборка', field: 'assembly' },
    ];
  }

  public toUpdateModel(): SwoshOrderUpdate {
    return {
      ...super.toUpdateModel(),
      assemblyExecutor1Id: extract(this, 'assemblyExecutor1.id'),
      assemblyExecutor2Id: extract(this, 'assemblyExecutor2.id'),
      assemblyStatus: this.assemblyStatus,
    };
  }

  public getManufacturingData() {
    return {
      ...super.getManufacturingData(),
      assemblyExecutor1: this.assemblyExecutor1,
      assemblyExecutor2: this.assemblyExecutor2,
      assemblyStatus: this.assemblyStatus,
    };
  }

}
