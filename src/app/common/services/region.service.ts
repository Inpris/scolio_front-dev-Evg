import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { RegionResponse } from '@common/interfaces/Region-response';
import { Region } from '@common/models/region';


@Injectable()
export class RegionService extends PaginableService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  getList(paramsObj, paginationParams: PaginationParams = {}) {
    const params = {};
    if (paramsObj && paramsObj['filter']) {
      params['filter'] = paramsObj.filter;
    }

    const url = '/api/v1.0/dictionaries/regions';
    return this.paginationRequest<RegionResponse>(url, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(item => new Region(item)),
        } as PaginationChunk<Region>;
      });
  }
}
