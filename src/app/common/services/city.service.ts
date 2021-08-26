import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { CityResponse } from '@common/interfaces/City-response';
import { City } from '@common/models/city';



@Injectable()
export class CityService extends PaginableService {

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

    const url = '/api/v1.0/dictionaries/cities';
    return this.paginationRequest<CityResponse>(url, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(item => new City(item)),
        } as PaginationChunk<City>;
      });
  }
}
