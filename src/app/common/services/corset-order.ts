import { Injectable } from '@angular/core';
import { PaginableService } from '@common/services/paginable';
import { HttpClient } from '@angular/common/http';
import { CorsetOrder } from '@common/models/product-order/corset-order';
import { CorsetOrderResponse } from '@common/interfaces/product-order/Corset-order-response';
import { ProductOrderCreate } from '@common/interfaces/product-order/Product-order-create';
import { CorsetOrderUpdate } from '@common/interfaces/product-order/Corset-order-update';

export { CorsetOrder };

@Injectable()
export class CorsetOrderService extends PaginableService {
  constructor(protected http: HttpClient) {
    super(http);
  }
  corsetUrl = '/api/v1/product';
  corsetPutUrl = '/api/v1/product/corset';

  update(corsetOrderId: string, corsetOrder: CorsetOrderUpdate) {
    return this.http.put<CorsetOrderResponse>(`${this.corsetPutUrl}/${corsetOrderId}`, corsetOrder)
      .map(_corsetOrder => new CorsetOrder(_corsetOrder));
  }

  create(corsetOrder: ProductOrderCreate) {
    return this.http.post<CorsetOrderResponse>(this.corsetUrl, corsetOrder)
      .map(_corsetOrder => new CorsetOrder(_corsetOrder));
  }

  get(corsetOrderId: string) {
    return this.http.get<CorsetOrderResponse>(`${this.corsetUrl}/${corsetOrderId}`)
      .map(_corsetOrder => new CorsetOrder(_corsetOrder));
  }

  delete(deviceId) {
    return this.http.delete(`${this.corsetUrl}/${deviceId}`);
  }
}
