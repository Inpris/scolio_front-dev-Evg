
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { ProductOrderTypes } from '@common/enums/product-order-types';

@Injectable()
export class ProductionMethodService {
  constructor(private http: HttpClient) {
  }

  getList(productType: ProductOrderTypes) {
    if (productType === ProductOrderTypes.APPARATUS) {
      return this.http.get<EntityWithSysName[]>('/assets/mock/product-methods.json');
    }
    return null;
  }
}
