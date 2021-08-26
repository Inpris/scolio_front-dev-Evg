import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToClass } from 'class-transformer';
import { Report } from '@common/models/report';

@Injectable()
export class ReportConstructorService extends PaginableService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getList(paginationParams: PaginationParams, params = {} as any, reportType: string) {
    const requestParams = {
      ...params,
      ...paginationParams,
      sortType: params.sortType ? params.sortType : undefined,
    };
    return this.http.post<Report[]>(`/api/v1/${reportType}s/report`, requestParams, { observe: 'response' })
      .map(response => ({
        data: response.body,
        page: +response.headers.get('X-Page'),
        pageSize: +response.headers.get('X-Page-Size'),
        pageCount: +response.headers.get('X-Page-Count'),
        totalCount: +response.headers.get('X-Total-Count'),
      } as PaginationChunk<Report>))
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(response => plainToClass(Report, response, { groups: [reportType] })),
        } as PaginationChunk<Report>;
      });
  }

  getContactExcel(paginationParams: PaginationParams, params = {} as any) {
    const requestParams = {
      ...params,
      ...paginationParams,
      sortType: params.sortType ? params.sortType : undefined,
    };
    return this.http.post(`/api/v1/contacts/report-excel`, requestParams, { responseType: 'blob' });
  }

  getVisitExcel(paginationParams: PaginationParams, params = {} as any) {
    const requestParams = {
      ...params,
      ...paginationParams,
      sortType: params.sortType ? params.sortType : undefined,
    };
    return this.http.post(`/api/v1/visits/report-excel`, requestParams, { responseType: 'blob' });
  }
}
