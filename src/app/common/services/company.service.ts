import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { Company, CompanyCreate, CompanyUpdate } from '@common/models/company';

const API_URL = '/api/v1.0/companies';
@Injectable()
export class CompanyService extends PaginableService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  getList(params: { inn?: string } = {}, paginationParams: PaginationParams = {}) {
    return this.paginationRequest<Company>(`${API_URL}`, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(company => new Company(company)),
        } as PaginationChunk<Company>;
      });
  }

  create(data: CompanyCreate) {
    return this.http.post<Company>(`${API_URL}`, data)
      .map(response => new Company(response));
  }

  update(data: CompanyUpdate) {
    return this.http.put<Company>(`${API_URL}/${data.id}`, data)
      .map(response => new Company(response));
  }

  delete(id) {
    return this.http.delete<any>(`${API_URL}/${id}`);
  }

  get(id) {
    return this.http.get<Company>(`${API_URL}/${id}`)
      .map(response => new Company(response));
  }
}
