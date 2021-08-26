import { CorsetCorrectionOrder } from '@common/models/product-order/corset-correction-order';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { ProductStatus } from '@common/enums/product-status.enum';

export class SwoshCorrectionOrder extends CorsetCorrectionOrder {
  constructor(data) {
    super(data);
  }

  static fromFormData(formData) {
    return new SwoshCorrectionOrder({
      ...formData.orderData,
      ...formData.correction,
      ...formData.issueData,
      corsetMeasurement: formData.measurementData,
      productType: ProductOrderTypes.SWOSH,
      given: formData.issueData.generalStatus === ProductStatus.GIVEN,
    });
  }

  public getMeasurementData() {
    return {
      ...super.getMeasurementData(),
      hipsCirculRight: this.corsetMeasurement.hipsCirculRight,
      hipsCirculLeft: this.corsetMeasurement.hipsCirculLeft,
    };
  }
}
