import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RejectResults } from '@common/models/rejectResults';

@Injectable()
export class RejectResultsService {
  constructor(private http: HttpClient) {
  }

  getList() {
    return this.http.get<RejectResults[]>(`/api/v1/dictionaries/reject-results`);
  }
}
