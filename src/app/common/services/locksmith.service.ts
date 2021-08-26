import { Injectable } from '@angular/core';
import { PaginableService, PaginationParams, PaginationChunk } from '@common/services/paginable';
import { HttpClient } from '@angular/common/http';
import { LocksmithResponse } from '@common/interfaces/Locksmith-response';
import { LocksmithEdit } from '@common/interfaces/Locksmith-edit';
import { Locksmith } from '@common/models/locksmith';
import { LocksmithOperation } from '@common/models/locksmith-operation';
import { Observable } from 'rxjs/Observable';
import { LocksmithOperationResponse } from '@common/interfaces/LocksmithOperationResponse';
import { SearchUtils } from '@common/utils/search';
import { DateUtils } from '@common/utils/date';

@Injectable()
export class LocksmithService extends PaginableService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getList(paginationParams: PaginationParams, params?: any) {
    let searchParams = {};
    if (paginationParams && paginationParams.searchTerm) {
      const { searchTerm = '' } = paginationParams;
      searchParams = SearchUtils.extractName(searchTerm);
    }

    searchParams['sortBy'] = params['sortBy'];
    searchParams['sortType'] = params['sortType'] === 'descend' ? 'DESC' : 'ASC';
    searchParams['DateVisitFrom'] = params['dateVisitFrom'];
    searchParams['DateVisitTo'] = params['dateVisitTo'];
    searchParams['ProductTypeIds'] = params['productTypes'];
    searchParams['VisitReasonIds'] = params['visitReasons'];
    searchParams['PatientFio'] = params['fullName'];
    searchParams['Notes'] = params['note'];

    return this.paginationRequest<LocksmithResponse>('/api/v1.0/locksmith', paginationParams, searchParams)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map((locksmith, index) => new Locksmith(locksmith, index)),
        } as PaginationChunk<Locksmith>;
      });
  }

  getOperations(productId: string, visitId: string): Observable<LocksmithOperation[]> {
    return this.http.get<LocksmithOperationResponse[]>(`/api/v1.0/locksmith/${productId}`, { params: { visitId } })
      .map(response => response.map(operation => new LocksmithOperation(operation)));
  }

  update(productId, visitId, data: any[]) {
    const request = data.map((locksmith: any) => {
      return {
        executorId: locksmith.executor.id,
        start: locksmith.start && DateUtils.toISODateTimeString(locksmith.start),
        end: locksmith.end && DateUtils.toISODateTimeString(locksmith.end),
        name: locksmith.note,
        id: locksmith.id,
      };
    });

    return this.http.put<LocksmithOperationResponse[]>(`/api/v1.0/locksmith/${productId}?visitId=${visitId}`, request)
      .map(response => response.map(operation => new LocksmithOperation(operation)));
  }
}
