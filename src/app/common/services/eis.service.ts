import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EisResponse } from '@common/interfaces/Eis-response';
import { Eis } from '@common/models/eis';

@Injectable()
export class EisService {

  constructor(
    protected http: HttpClient,
  ) {
  }

  get(params: { url?: string, noticeNumber?: string; } = {}) {
    let url = `/api/v1/eis`;
    if (params && params.noticeNumber) {
      url = `${url}?regNumber=${params.noticeNumber}`;
    } else if (params && params.url) {
      url = `${url}?regNumber=${params.url}`;
    }
    return this.http.get<EisResponse>(url)
      .map((response: EisResponse) => new Eis(response));
  }
}
