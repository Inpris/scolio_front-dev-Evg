import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { Patient } from '@common/models/patient';
import { SpecificationResponse } from '@common/interfaces/Specification-response';
import { Specification } from '@common/models/specification';
import { SpecificationCreate } from '@common/interfaces/Specification-create';

@Injectable()
export class SpecificationService extends PaginableService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  getList(purchaseId, productId, paginationParams: PaginationParams = {}) {
    return this.paginationRequest<SpecificationResponse>(
      `/api/v1/purchase/${purchaseId}/devices/${productId}/specifications`, paginationParams)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(item => new Specification(item)),
        } as PaginationChunk<Specification>;
      });
  }

  getById(id: string) {
    return this.http.get('/assets/mock/specifications.json')
      .map((response: any) => {
        const result = response.find(spec => spec.id === id);
        return result;
      });
  }

  create(purchaseId: string, productId: string, data: SpecificationCreate) {
    const url = `/api/v1/purchase/${purchaseId}/devices/${productId}/specifications`;
    return this.http.post<SpecificationResponse>(url, data)
      .map(item => new Specification(item));
  }

  update(purchaseId: string, productId: string, data: SpecificationCreate) {
    const url = `/api/v1/purchase/${purchaseId}/devices/${productId}/specifications/${data.id}`;
    return this.http.put<SpecificationResponse>(url, data)
      .map(item => new Specification(item));
  }

  delete(purchaseId: string, productId: string, specificationId: string) {
    const url = `/api/v1/purchase/${purchaseId}/devices/${productId}/specifications/${specificationId}`;
    return this.http.delete<SpecificationResponse>(url);
  }

  getDictionary(params = { code: null }, paginationParams: PaginationParams = {}) {
    let url = `/api/v1/specifications`;
    if (params.code) {
      url = `${url}?code=${params.code}`;
    }
    return this.paginationRequest<SpecificationResponse>(url, paginationParams)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(item => new Specification(item)),
        } as PaginationChunk<Specification>;
      });
  }
}
