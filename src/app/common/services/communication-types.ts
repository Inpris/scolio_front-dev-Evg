import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunicationType } from '@common/models/communication-type';

@Injectable()
export class CommunicationTypesService {

  constructor(private http: HttpClient) {
  }

  getList() {
    return this.http.get<CommunicationType[]>('/api/v1/dictionaries/communication-types');
  }

}
