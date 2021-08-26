import { PaginationParams } from '@common/services/paginable';
import { Observable } from 'rxjs/Observable';

export interface SelectService {
  getList(filterObj?: { filter }, pagination?: PaginationParams): Observable<any>;
}
