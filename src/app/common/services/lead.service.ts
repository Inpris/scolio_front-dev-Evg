import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Status } from '@common/interfaces/Status';
import { LeadCreate } from '@common/interfaces/Lead-create';
import { LeadResponse } from '@common/interfaces/Lead-response';
import { Lead } from '../models/lead';
import { SignalR } from '@common/services/signalR';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';

const LEAD_CREATED = 'lead.created';
const LEAD_CHANGED = 'lead.changed';

@Injectable()
export class LeadService extends PaginableService {
  readonly leadCreated = this.signalR.on(LEAD_CREATED)
    .map((data: LeadResponse) => new Lead(data));

  readonly leadChanged = this.signalR.on(LEAD_CHANGED)
    .map((data: LeadResponse) => new Lead(data));

  constructor(
    protected http: HttpClient,
    private signalR: SignalR,
  ) {
    super(http);
  }

  public getList(paramsObj, paginationParams: PaginationParams = {}) {
    const params = {};
    if (paramsObj && paramsObj.statusId) { params['statusId'] = paramsObj.statusId; }
    if (paramsObj && paramsObj.assignedUserId) { params['assignedUserId'] = paramsObj.assignedUserId; }

    return this.paginationRequest<LeadResponse>(`/api/v1/leads`, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(lead => new Lead(lead)),
        } as PaginationChunk<Lead>;
      });
  }

  public getLeadById(id: string) {
    const url = `/api/v1/leads/${id}`;
    return this.http.get<LeadResponse>(`/api/v1/leads/${id}`)
      .map((response: LeadResponse) => new Lead(response));
  }

  public getStatuses() {
    return this.http.get<Status[]>(`/api/v1/lead-statuses`);
  }

  public update(data: LeadCreate) {
    return this.http.put<LeadResponse>(`/api/v1/leads/${data.id}`, data)
      .do((response) => { this.signalR.call(LEAD_CHANGED, response); })
      .map((response: LeadResponse) => new Lead(response));
  }

  public create(data: LeadCreate) {
    return this.http.post<LeadResponse>('/api/v1/leads', data)
      // .do((response) => { this.signalR.call(LEAD_CREATED, response); }) //  срабатывает 2 раза
      .map(response => new Lead(response));
  }
}
