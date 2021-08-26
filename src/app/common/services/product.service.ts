import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ProductResponse } from '@common/interfaces/Product-response';
import { Product } from '@common/models/product';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';

@Injectable()
export class ProductService extends PaginableService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  getList(purchaseId, paramsObj, paginationParams: PaginationParams = {}) {
    const params = {};
    if (paramsObj && paramsObj.sortType && paramsObj.sortBy) {
      params['sortType'] = paramsObj.sortType;
      params['sortBy'] = paramsObj.sortBy;
    }
    return this.paginationRequest<ProductResponse>(`/api/v1/purchase/${purchaseId}/devices`, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(product => new Product(product)),
        } as PaginationChunk<Product>;
      });
  }

  create(purchaseId, data) {
    return this.http.post<ProductResponse>(`/api/v1/purchase/${purchaseId}/devices`, data)
      .map(response => new Product(response));
  }

  update(purchaseId, data) {
    return this.http.put<ProductResponse>(`/api/v1/purchase/${purchaseId}/devices/${data.id}`, data)
      .map(response => new Product(response));
  }

  delete(purchaseId, productId) {
    return this.http.delete<any>(`/api/v1/purchase/${purchaseId}/devices/${productId}`);
  }

  get(productId) {
    return this.http.get<ProductResponse>(`/api/v1/product/${productId}`)
      .map(response => new Product(response));
  }
}
