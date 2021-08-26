import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchaseTenderPlatform } from '@common/models/purchase-tender-platform';

@Injectable()
export class PurchaseTenderPlatformsService {
  constructor(private http: HttpClient) {
  }

  getList() {
    return this.http.get<PurchaseTenderPlatform[]>('/api/v1/dictionaries/tender-platform-types');
  }
}
