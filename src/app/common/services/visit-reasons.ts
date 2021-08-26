import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VisitReason } from '@common/models/visit-reason';

export { VisitReason };

@Injectable()
export class VisitReasonsService {
  constructor(private http: HttpClient) {
  }

  getList(serviceId: string) {
    return this.http.get<VisitReason[]>('/api/v1/visit-reasons', { params: { serviceId } });
  }

  getListForLocksmith() {
    return this.http.get<VisitReason[]>('/api/v1.0/dictionaries/visit-reasons-for-locksmith');
  }
}
