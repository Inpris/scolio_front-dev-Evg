import { ProductOrderTypes } from '@common/enums/product-order-types';
import {
  CorsetCorrectionOrderDetailComponent,
} from '@modules/patients/patient/patient-visits/visit-meansurements/corset-correction-order/corset-correction-order-detail/corset-correction-order-detail.component';
import { CorsetOrderShortComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/corset-order-short/corset-order-short.component';
import { CorsetOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/corset-order-detail/corset-order-detail.component';
import { ProtezVkOrderShortComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-vk-order/protez-vk-order-short/protez-vk-order-short.component';
import { ProtezVkOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-vk-order/protez-vk-order-detail/protez-vk-order-detail.component';
import { SwoshOrderShortComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/swosh-order/swosh-order-short/swosh-order-short.component';
import { SwoshOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/swosh-order/swosh-order-detail/swosh-order-detail.component';
import { ApparatusOrderShortComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/apparatus-order-short/apparatus-order-short.component';
import { ApparatusOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/apparatus-order-detail/apparatus-order-detail.component';
import { VerticalizatorOrderShortComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/verticalizator-order/verticalizator-order-short/verticalizator-order-short.component';
// tslint:disable-next-line:max-line-length
import { VerticalizatorOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/verticalizator-order/verticalizator-order-detail/verticalizator-order-detail.component';
import {ProtezNkOrderShortComponent} from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/protez-nk-order-short/protez-nk-order-short.component';
import {ProtezNkOrderDetailComponent} from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/protez-nk-order-detail/protez-nk-order-detail.component';

export class ProductOrderTemplateHelper {
  static getTemplate(productType, short = false) {
    switch (productType) {
      case ProductOrderTypes.CORSET_CORRECTION:
        return { component: CorsetCorrectionOrderDetailComponent, formField: 'corsetMeasurement', width: '1024px' };
      case ProductOrderTypes.CORSET:
        return { component: short ? CorsetOrderShortComponent : CorsetOrderDetailComponent, formField: 'corsetMeasurement', width: '1024px' };
      case ProductOrderTypes.PROTHESISVK:
        return { component: short ? ProtezVkOrderShortComponent : ProtezVkOrderDetailComponent, formField: 'prothesisVkMeasurement', width: '1280px' };
      case ProductOrderTypes.PROTHESISNK:
        return { component: short ? ProtezNkOrderShortComponent : ProtezNkOrderDetailComponent, formField: 'prothesisNkMeasurement', width: '1200px' };
      case ProductOrderTypes.SWOSH:
        return { component: short ? SwoshOrderShortComponent : SwoshOrderDetailComponent, formField: 'corsetMeasurement', width: '1024px' };
      case ProductOrderTypes.SWOSH_CORRECTION:
        return { component: CorsetCorrectionOrderDetailComponent, formField: 'corsetMeasurement', width: '1024px' };
      case ProductOrderTypes.APPARATUS:
        return { component: short ? ApparatusOrderShortComponent : ApparatusOrderDetailComponent, formField: 'corsetMeasurement', width: '1024px' };
      case ProductOrderTypes.VERTICALIZATOR:
        return { component: short ? VerticalizatorOrderShortComponent : VerticalizatorOrderDetailComponent, formField: 'corsetMeasurement', width: '1024px' };
      case ProductOrderTypes.TUTOR:
        return { component: short ? ApparatusOrderShortComponent : ApparatusOrderDetailComponent, formField: 'corsetMeasurement', width: '1024px' };
      default:
        throw new Error(`Бланк заказа для типа '${productType}' не описан`);
    }
  }
}
