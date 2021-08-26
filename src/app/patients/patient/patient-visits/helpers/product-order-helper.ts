import { ProductOrderTypes } from '@common/enums/product-order-types';

export class ProductOrderHelper {


  static getType({ isCorrection, productType: { sysName } }) {
    switch (true) {
      case isCorrection && sysName === ProductOrderTypes.SWOSH:
        return ProductOrderTypes.SWOSH_CORRECTION;
      case isCorrection && sysName === ProductOrderTypes.CORSET:
        return ProductOrderTypes.CORSET_CORRECTION;
      default:
        return sysName;
    }
  }
}
