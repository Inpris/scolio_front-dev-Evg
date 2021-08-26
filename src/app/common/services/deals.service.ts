import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { DealResponse } from '@common/interfaces/Deal-response';
import { Deal } from '@common/models/deal';
import { DealCreate } from '@common/interfaces/Deal-create';

@Injectable()
export class DealsService extends PaginableService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getList(params: { contactId, isOpen }, paginationParams: PaginationParams = {}) {
    return this.paginationRequest<DealResponse>(`/api/v1/deals`, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(deal => new Deal(deal)),
        } as PaginationChunk<Deal>;
      });
  }

  update(dealId: string, data: DealCreate) {
    return this.http.put<DealResponse>(`/api/v1.0/deals/${dealId}`, data)
      .map(response => new Deal(response));
  }
}
