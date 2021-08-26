import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductOrderFactory } from '@common/helpers/product-order-factory';
import { CorsetOrderResponse } from '@common/interfaces/product-order/Corset-order-response';
import { ProthesisVkOrderResponse } from '@common/interfaces/product-order/Prothesis-vk-order-response';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { Observable } from 'rxjs/Observable';
import { CorsetOrder } from '@common/models/product-order/corset-order';
import { ProthesisVkOrder } from '@common/models/product-order/prothesis-vk-order';
import { CorsetOrderUpdate } from '@common/interfaces/product-order/Corset-order-update';
import { ProthesisVkOrderUpdate } from '@common/interfaces/product-order/Prothesis-vk-order-update';
import { ProductOrderCreate } from '@common/interfaces/product-order/Product-order-create';
import { SwoshOrderUpdate } from '@common/interfaces/product-order/Swosh-order-update';
import { SwoshOrder } from '@common/models/product-order/swosh-order';
import { CorsetCorrectionOrder } from '@common/models/product-order/corset-correction-order';
import { CorsetCorrectionOrderUpdate } from '@common/interfaces/product-order/Corset-correction-order-update';
import { ProductOrder } from '@common/models/product-order/product-order';
import { SwoshCorrectionOrder } from '@common/models/product-order/swoshCorrectionOrder';
import { ApparatusOrderUpdate } from '@common/interfaces/product-order/apparatus-order/Apparatus-order-update';
import { ApparatusOrder } from '@common/models/product-order/apparatus-order/apparatus-order';
import { RobotBlockingOrder } from '@common/models/product-order/apparatus-order/robot-blocking-order';
import { MoldOrder } from '@common/models/product-order/apparatus-order/mold-order';
import { RobotLaminationOrder } from '@common/models/product-order/apparatus-order/robot-lamination-order';

@Injectable()
export class ProductOrderService {
  private productUrl = '/api/v1/product';

  constructor(private http: HttpClient) {
  }

  private getBaseUrl(productType) {
    switch (productType) {
      case ProductOrderTypes.CORSET_CORRECTION:
      case ProductOrderTypes.SWOSH_CORRECTION:
        return `${this.productUrl}/correction`;
      default:
        return this.productUrl;
    }
  }

  private getUpdateUrl(productType) {
    const endpoints = {
      [ProductOrderTypes.PROTHESISVK]: 'prothesis-vk',
      [ProductOrderTypes.CORSET]: 'corset',
      [ProductOrderTypes.CORSET_CORRECTION]: 'corset/correction',
      [ProductOrderTypes.SWOSH]: 'swosh',
      [ProductOrderTypes.SWOSH_CORRECTION]: 'swosh/correction',
      [ProductOrderTypes.APPARATUS]: 'apparat',
      [ProductOrderTypes.TUTOR]: 'tutor',
    };

    return `${this.productUrl}/${endpoints[productType]}`;
  }

  update(productType: ProductOrderTypes.CORSET, corsetOrderId: string, productOrder: CorsetOrderUpdate): Observable<CorsetOrder>;
  update(productType: ProductOrderTypes.CORSET_CORRECTION, corsetOrderId: string, productOrder: CorsetCorrectionOrderUpdate): Observable<CorsetCorrectionOrder>;
  update(productType: ProductOrderTypes.PROTHESISVK, corsetOrderId: string, productOrder: ProthesisVkOrderUpdate): Observable<ProthesisVkOrder>;
  update(productType: ProductOrderTypes.SWOSH, corsetOrderId: string, productOrder: SwoshOrderUpdate): Observable<SwoshOrder>;
  update(productType: ProductOrderTypes.SWOSH_CORRECTION, corsetOrderId: string, productOrder: CorsetCorrectionOrderUpdate): Observable<SwoshCorrectionOrder>;
  update(productType: ProductOrderTypes.APPARATUS | ProductOrderTypes.TUTOR, corsetOrderId: string, productOrder: ApparatusOrderUpdate): Observable<ApparatusOrder>;
  update(productType, corsetOrderId, productOrder):
    Observable<CorsetOrder | ProthesisVkOrder | CorsetCorrectionOrder | SwoshCorrectionOrder | ApparatusOrder | RobotBlockingOrder | MoldOrder | RobotLaminationOrder> {
    return this.http.put<CorsetOrderResponse & ProthesisVkOrderResponse>(`${this.getUpdateUrl(productType)}/${corsetOrderId}`, productOrder)
      .map(_corsetOrder => ProductOrderFactory.orderByType(productType, _corsetOrder));
  }

  create(productType: string, productOrder): Observable<CorsetOrder | ProthesisVkOrder | CorsetCorrectionOrder>;
  create(productType: ProductOrderTypes.CORSET, productOrder: ProductOrderCreate): Observable<CorsetOrder>;
  create(productType: ProductOrderTypes.CORSET_CORRECTION, productOrder: ProductOrderCreate): Observable<CorsetCorrectionOrder>;
  create(productType: ProductOrderTypes.SWOSH_CORRECTION, productOrder: ProductOrderCreate): Observable<SwoshCorrectionOrder>;
  create(productType: ProductOrderTypes.PROTHESISVK, productOrder: ProductOrderCreate): Observable<ProthesisVkOrder>;
  create(productType: ProductOrderTypes.APPARATUS | ProductOrderTypes.TUTOR, productOrder: ProductOrderCreate): Observable<ApparatusOrder>;
  create(productType, productOrder):
    Observable<CorsetOrder | ProthesisVkOrder | CorsetCorrectionOrder | SwoshCorrectionOrder | ApparatusOrder | RobotBlockingOrder | MoldOrder | RobotLaminationOrder> {
    return this.http.post<CorsetOrderResponse & ProthesisVkOrderResponse>(this.getBaseUrl(productType), productOrder)
      .map(_corsetOrder => ProductOrderFactory.orderByType(productType, _corsetOrder));
  }

  get(productType: ProductOrderTypes.CORSET, corsetOrderId: string): Observable<CorsetOrder>;
  get(productType: ProductOrderTypes.CORSET_CORRECTION, corsetOrderId: string): Observable<CorsetCorrectionOrder>;
  get(productType: ProductOrderTypes.PROTHESISVK, corsetOrderId: string): Observable<ProthesisVkOrder>;
  get(productType: ProductOrderTypes.SWOSH, corsetOrderId: string): Observable<SwoshOrder>;
  get(productType: ProductOrderTypes.SWOSH_CORRECTION, corsetOrderId: string): Observable<SwoshCorrectionOrder>;
  get(productType: ProductOrderTypes.APPARATUS | ProductOrderTypes.TUTOR, corsetOrderId: string): Observable<ApparatusOrder>;
  get(productType, corsetOrderId: string):
    Observable<CorsetOrder | ProthesisVkOrder | CorsetCorrectionOrder | ApparatusOrder | RobotBlockingOrder | MoldOrder | RobotLaminationOrder> {

    return this.http.get<CorsetOrderResponse & ProthesisVkOrderResponse>(`${this.getBaseUrl(productType)}/${corsetOrderId}`)
      .map(_corsetOrder => ProductOrderFactory.orderByType(productType, _corsetOrder));
  }

  delete(productType, deviceId) {
    return this.http.delete(`${this.getBaseUrl(productType)}/${deviceId}`);
  }

  getList(patientId) {
    return this.http.get<ProductOrder[]>(`${this.productUrl}/by-patient/${patientId}`);
  }

  getNk(corsetOrderId: string): Observable<any> {
    return this.http.get<any>(`${this.productUrl}/${corsetOrderId}`);
  }

  updateNk(corsetOrderId: string, productOrder: any): Observable<any> {
    return this.http.put<any>(`${this.productUrl}/prothesis-nk/${corsetOrderId}`, productOrder);
  }
}
