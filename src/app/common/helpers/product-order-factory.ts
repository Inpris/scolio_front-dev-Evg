import { CorsetOrder } from '@common/models/product-order/corset-order';
import { ProthesisVkOrder } from '@common/models/product-order/prothesis-vk-order';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { SwoshOrder } from '@common/models/product-order/swosh-order';
import { CorsetCorrectionOrder } from '@common/models/product-order/corset-correction-order';
import { SwoshCorrectionOrder } from '@common/models/product-order/swoshCorrectionOrder';
import { RobotBlockingOrder } from '@common/models/product-order/apparatus-order/robot-blocking-order';
import { MoldOrder } from '@common/models/product-order/apparatus-order/mold-order';
import { ApparatusOrder } from '@common/models/product-order/apparatus-order/apparatus-order';
import { RobotLaminationOrder } from '@common/models/product-order/apparatus-order/robot-lamination-order';

export class ProductOrderFactory {
  static orderByType(type: string, data) {
    switch (type) {
      case ProductOrderTypes.CORSET_CORRECTION:
        return new CorsetCorrectionOrder(data);
      case ProductOrderTypes.SWOSH_CORRECTION:
        return new SwoshCorrectionOrder(data);
      case ProductOrderTypes.CORSET:
        return new CorsetOrder(data);
      case ProductOrderTypes.PROTHESISVK:
        return new ProthesisVkOrder(data);
      case ProductOrderTypes.PROTHESISNK:
        return data;
      case ProductOrderTypes.SWOSH:
        return new SwoshOrder(data);
      case ProductOrderTypes.APPARATUS:
      case ProductOrderTypes.TUTOR:
        switch (data.productionMethod) {
          case ProductOrderTypes.ROBOT_WITH_BLOCKING:
            return new RobotBlockingOrder(data);
          case ProductOrderTypes.MOLD:
            return new MoldOrder(data);
          case ProductOrderTypes.ROBOT_WITH_LAMINATION:
            return new RobotLaminationOrder(data);
          default: return new ApparatusOrder(data);
        }
      default:
        throw new Error('Неподдерживаемый тип бланка заказа');
    }
  }
}
