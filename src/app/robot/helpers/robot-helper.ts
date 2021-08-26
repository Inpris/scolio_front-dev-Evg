import { ProductOrderTypes } from '@common/enums/product-order-types';
import { CorsetOrder } from '@common/models/product-order/corset-order';
import { SwoshOrder } from '@common/models/product-order/swosh-order';
import { ProthesisVkOrder } from '@common/models/product-order/prothesis-vk-order';
import { CorsetOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/corset-order-detail/corset-order-detail.component';
import { SwoshOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/swosh-order/swosh-order-detail/swosh-order-detail.component';
import { ProtezVkOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-vk-order/protez-vk-order-detail/protez-vk-order-detail.component';
import { Robot } from '@common/interfaces/Robot';
import { ProductOrderFactory } from '@common/helpers/product-order-factory';
import { OrderManufacturingComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/order-manufacturing/order-manufacturing.component';
import { ProductStatus } from '@common/enums/product-status.enum';
import { OrderModelComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/order-model/order-model.component';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { ProductionMethod } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/models/production-method';
import { RobotBlockingOrder } from '@common/models/product-order/apparatus-order/robot-blocking-order';
import { MoldOrder } from '@common/models/product-order/apparatus-order/mold-order';
import { RobotLaminationOrder } from '@common/models/product-order/apparatus-order/robot-lamination-order';
import { ApparatusOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/apparatus-order-detail/apparatus-order-detail.component';
import {FULL_SCHEMA} from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/protez-nk-order-detail/protez-nk-order-short.const';

export class RobotHelper {
  static getSchema(type, productionMethod?) {
    const carcass = { name: 'Тушка', field: 'carcass' };
    switch (type) {
      case ProductOrderTypes.CORSET:
        return CorsetOrder.getSchema();
      case ProductOrderTypes.SWOSH:
        return SwoshOrder.getSchema();
      case ProductOrderTypes.PROTHESISVK:
        return [carcass, ...ProthesisVkOrder.getSchema()];
      case ProductOrderTypes.PROTHESISNK:
        return [...FULL_SCHEMA];
      case ProductOrderTypes.APPARATUS:
      case ProductOrderTypes.TUTOR:
        switch (productionMethod) {
          case ProductionMethod.ROBOT_WITH_BLOCKING: return RobotBlockingOrder.getSchema();
          case ProductionMethod.MOLD: return MoldOrder.getSchema();
          case ProductionMethod.ROBOT_WITH_LAMINATION: return RobotLaminationOrder.getSchema();
          default: return [];
        }
      default:
        throw new Error('Не поддерживаемый тип изделия');
    }
  }

  static getTemplate(device: Robot) {
    const visitsManager = { selected: { dateTime: device.visitDate, doctor: { name: device.acceptedBy } }, patientId: device.patientId };
    const blankTemplate = {
      Corset: { component: CorsetOrderDetailComponent, width: '1024px' },
      Swosh: { component: SwoshOrderDetailComponent, width: '1024px' },
      ProsthesisVk: { component: ProtezVkOrderDetailComponent, width: '1280px' },
      Apparatus: { component: ApparatusOrderDetailComponent, width: '1024px' },
      Tutor: { component: ApparatusOrderDetailComponent, width: '1024px' },
    };
    if (!blankTemplate[device.productType.sysName]) {
      throw new Error(`Бланк заказа для типа '${device.productType.sysName}' не описан`);
    }
    return {
      width: blankTemplate[device.productType.sysName].width,
      component: blankTemplate[device.productType.sysName].component,
      componentParams: { device, visitsManager },
    };
  }

  static updateDeviceData(data, component, schema) {
    const isAllProductStatesDone = operation => schema.reduce(
      (result, stage) =>
        result && operation[`${stage.field}Status`] === ProductOperationStatus.DONE,
      true,
    );
    data.updating = true;
    const formData = component.form.value;
    const device = ProductOrderFactory.orderByType(data.productType.sysName, { ...data, ...formData });
    const updateData = {
      id: data.id,
      ...device.toUpdateModel(),
    };
    if (RobotHelper.getIsWithout3DModel(data)) {
      updateData.is3DModelReady = false;
    }
    if (component instanceof OrderManufacturingComponent) {
      const status = device.isControlled ?
        ProductStatus.READY :
        ((isAllProductStatesDone(updateData)) ?
          ProductStatus.CONTROL : ProductStatus.MAKING);
      Object.assign(updateData, {
        generalStatus: status,
        ...{
          carcassExecutor1Id: formData.carcassExecutor1 && formData.carcassExecutor1.id,
          carcassExecutor2Id: formData.carcassExecutor2 && formData.carcassExecutor2.id,
          carcassStatus: formData.carcassStatus,
        },
      });
    }
    if (component instanceof OrderModelComponent) {
      Object.assign(updateData, {
        generalStatus: device.is3DModelReady ? ProductStatus.MAKING : ProductStatus.MODEL3D,
        carcassStatus: device.is3DModelReady ? ProductOperationStatus.WAITING : formData.carcassStatus,
      });
    }
    return updateData;
  }

  public static getIsWithout3DModel(data) {
    return (data.productionMethod && data.productionMethod === 'Mold');
  }
}
