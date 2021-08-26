import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PaginableService, PaginationChunk, PaginationParams } from '../paginable';

export class AbstractDictionaryService<T> extends PaginableService {
  constructor(protected http: HttpClient, protected restUrl: string) {
    super(http);
  }

  getList(paramsObj, paginationParams: PaginationParams = {}): Observable<PaginationChunk<T>> {
    const params = {
      ...paramsObj,
    };

    return this.paginationRequest<T>(this.restUrl, paginationParams, params);
  }
}
