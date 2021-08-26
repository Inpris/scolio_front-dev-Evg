import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from '@common/services/dictionaries/abstract-dictionary-service';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const BRANCHES_DICTIONARY = '/api/v1/branches';

export interface IBranch {
  branchId?: string;
  id?: string;
  isMain: boolean;
  name: string;
  sort?: number;
}

@Injectable()
export class BranchesService extends AbstractDictionaryService<IBranch> {

  constructor(http: HttpClient) {
    super(http, BRANCHES_DICTIONARY);
  }

  public save(data: IBranch): Observable<IBranch> {
    return this.http.post<any>(`/api/v1/branches`, data);
  }
}
