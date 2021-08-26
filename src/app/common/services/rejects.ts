import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rejects } from '@common/models/rejects';

@Injectable()
export class RejectsService {
  constructor(private http: HttpClient) {
  }

  create(data) {
    return this.http.post<Rejects>('/api/v1/rejects', data);
  }
}
