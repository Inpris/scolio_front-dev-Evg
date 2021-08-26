import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from './abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { PaginationParams } from '@common/services/paginable';

const DEAL_STATUS_LIBRARY = '/api/v1/dictionaries/deal-statuses';

@Injectable()
export class DealStatusesService extends AbstractDictionaryService<EntityWithSysName> {

  constructor(http: HttpClient) {
    super(http, DEAL_STATUS_LIBRARY);
  }

  getList(paramsObj, paginationParams: PaginationParams = {}) {
    return super.getList(paramsObj, paginationParams)
      .map(response => ({ ...response, data: response.data.sort((prev, next) => prev.sort - next.sort) }));
  }

}
