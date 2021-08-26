import { ProductOrderResponse } from '@common/interfaces/product-order/Product-order-response';
import { Entity } from '@common/interfaces/Entity';
import { CorsetMeasurement } from '@common/interfaces/product-order/Corset-measurement';

export interface CorsetCorrectionOrderResponse extends ProductOrderResponse {
  product: Entity;
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
