import { ProductOrderUpdate } from '@common/interfaces/product-order/Product-order-update';
import { CorsetMeasurement } from '@common/interfaces/product-order/Corset-measurement';

export interface CorsetCorrectionOrderUpdate extends ProductOrderUpdate {
  productId: string;
  given: boolean;
  corsetMeasurement: CorsetMeasurement;
  productionTime: string;
  liftingOfTheAxillary: string;
  shiftOfTheAxillary: string;
  pasteOfBreast: string;
  pasteOfBreastFrom: string;
  pasteOfBreastTo: string;
  pasteOfLoin: string;
  pasteOfLoinFrom: string;
  pasteOfLoinTo: string;
  enlargedFrontCavity: string;
  exctraCorrectionVariants: string;
  insertionThoraxInFront: string;
}
