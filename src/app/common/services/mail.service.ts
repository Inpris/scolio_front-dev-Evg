import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MailResponse } from '@common/interfaces/Mail-response';
import { Mail } from '@common/models/mail';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';


@Injectable()
export class MailService extends PaginableService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  get(paramsObj, paginationParams: PaginationParams = {}) {
    const params = {};
    if (paramsObj && paramsObj.id) { params['id'] = paramsObj.id; }
    if (paramsObj && paramsObj.inbox) { params['inbox'] = paramsObj.inbox; }
    if (paramsObj && paramsObj.outBox) { params['outBox'] = paramsObj.outBox; }
    if (paramsObj && paramsObj.isAnswered != null) { params['isAnswered'] = paramsObj.isAnswered; }
    if (paramsObj && paramsObj.isDeleted != null) { params['isDeleted'] = paramsObj.isDeleted; }

    return this.paginationRequest<MailResponse>(`/api/v1/mails`, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(mail => new Mail(mail)),
        } as PaginationChunk<Mail>;
      });
  }

  downloadFile(id) {
    const options: {
      responseType: 'blob',
    } = {
      responseType: 'blob',
    };
    return this.http.get(`/api/v1/mails/attachments/${id}`, options);
  }
}
