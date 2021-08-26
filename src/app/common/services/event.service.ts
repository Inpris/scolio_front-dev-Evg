import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { EventResponse } from '@common/interfaces/Event-response';
import { Event } from '@common/models/event';


@Injectable()
export class EventService extends PaginableService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  get(paramsObj, paginationParams: PaginationParams = {}) {
    const params = {};
    if (paramsObj && paramsObj.entityId) { params['EntityId'] = paramsObj.entityId; }
    if (paramsObj && paramsObj.entityType) { params['EntityType'] = paramsObj.entityType; }
    return this.paginationRequest<EventResponse>(`/api/v1/events`, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(event => new Event(event)),
        } as PaginationChunk<Event>;
      });
  }

}
