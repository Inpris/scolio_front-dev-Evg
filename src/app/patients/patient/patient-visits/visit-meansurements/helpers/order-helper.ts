import { ProductStatus } from '@modules/common/enums/product-status.enum';

export class OrderHelper {
  public static getCurrentStep(generalStatus): number {
    switch (generalStatus) {
      case ProductStatus.ORDERBLANK: return 0;
      case ProductStatus.MODEL3D: return 1;
      case ProductStatus.MAKING: return 2;
      case ProductStatus.CONTROL: return 3;
      case ProductStatus.READY: return 4;
      case ProductStatus.GIVEN: return 5;
      default: return -1;
    }
  }
  // public static
}
