import { HttpClient, HttpParams } from '@angular/common/http';

export interface PaginationParams {
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginationChunk<T> {
  data: T[];
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
}

const DEFAULT_PAGE = '1';
const DEFAULT_PAGE_SIZE = '10';

export abstract class PaginableService {
  constructor(protected http: HttpClient) {
  }

  protected paginationRequest<T>(url: string, filter: PaginationParams = { page: null, pageSize: null }, outsideParams: any = {}) {
    const page = filter && filter.page != null ? filter.page.toString() : DEFAULT_PAGE;
    const pageSize = filter && filter.pageSize != null ? filter.pageSize.toString() : DEFAULT_PAGE_SIZE;
    let params = new HttpParams();
    Object.keys(outsideParams).forEach((key) => {
      const param = outsideParams[key];
      if (param != null) {
        if (Array.isArray(param)) {
          for (const paramItem of param) {
            params = params.append(`${key}`, paramItem);
          }
        } else {
          params = params.set(key, outsideParams[key]);
        }
      }
    });
    params = params.set('page', page).set('pageSize', pageSize);
    return this.http.get<T[]>(url, { params, observe: 'response' })
      .map(response => ({
        data: response.body,
        page: +response.headers.get('X-Page'),
        pageSize: +response.headers.get('X-Page-Size'),
        pageCount: +response.headers.get('X-Page-Count'),
        totalCount: +response.headers.get('X-Total-Count'),
      } as PaginationChunk<T>));
  }
}
