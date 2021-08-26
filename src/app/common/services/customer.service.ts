import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { CustomerUpdate } from '@common/interfaces/Customer-update';
import { CustomerResponse } from '@common/interfaces/Customer-response';
import { Customer } from '@common/models/customer';
import { CustomerCreate } from '@common/interfaces/Customer-create';

@Injectable()
export class CustomerService extends PaginableService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  get(params = { inn: null }, paginationParams: PaginationParams = {}) {
    let url = `/api/v1/purchase-customers`;
    if (params.inn) {
      url = `${url}?inn=${params.inn}`;
    }

    return this.paginationRequest<CustomerResponse>(url, paginationParams)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(item => new Customer(item)),
        } as PaginationChunk<Customer>;
      });
  }

  getById(id: string) {
    const url = `/api/v1/purchase-customers/${id}`;
    return this.http.get<CustomerResponse>(url)
      .map((response: CustomerResponse) => new Customer(response));
  }

  update(id: string, data: CustomerUpdate) {
    const url = `/api/v1/purchase-customers/${id}`;
    return this.http.put<CustomerResponse>(url, data)
      .map(response => new Customer(response));
  }

  create(data: CustomerCreate) {
    const url = `/api/v1/purchase-customers`;
    return this.http.post<CustomerResponse>(url, data)
      .map(response => new Customer(response));
  }

}
