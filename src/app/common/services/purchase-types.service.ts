import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchaseType } from '@common/models/purchase-type';

@Injectable()
export class PurchaseTypesService {
  constructor(private http: HttpClient) {
  }

  getList() {
    return this.http.get<PurchaseType[]>('/api/v1/dictionaries/purchase-types');
  }
}
