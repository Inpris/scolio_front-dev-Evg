import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Service } from '@common/models/service';

export { Service };

@Injectable()
export class ServicesService {
  constructor(private http: HttpClient) {
  }

  getList(branchId?: string[]) {
    if (Array.isArray(branchId)) {
      return this.http.get<Service[]>('/api/v1/services', { params: { branchId } });
    }

    return this.http.get<Service[]>('/api/v1/services');
  }
}
