import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { PurchaseResponse } from '../interfaces/Purchase-response';
import { Purchase } from '../models/purchase';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { PurchaseUpdate } from '@common/interfaces/Purchase-update';
import { PurchaseCreate } from '@common/interfaces/Purchase-create';
import { Observable } from 'rxjs/Observable';
import { Status } from '@common/interfaces/Status';

@Injectable()
export class PurchaseService extends PaginableService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  getList(paramsObj, paginationParams: PaginationParams = {}) {
    const params = {};
    if (paramsObj && paramsObj.year) { params['year'] = paramsObj.year; }
    if (paramsObj && paramsObj.patientFio) { params['patientFio'] = paramsObj.patientFio; }

    if (paramsObj && paramsObj.purchaseTypeId) { params['purchaseTypeId'] = paramsObj.purchaseTypeId; }
    if (paramsObj && paramsObj['auctionDateFilter.startDay']) { params['AuctionDateFilter.StartDate'] = paramsObj['auctionDateFilter.startDay']; }
    if (paramsObj && paramsObj['auctionDateFilter.endDay']) { params['AuctionDateFilter.EndDate'] = paramsObj['auctionDateFilter.endDay']; }

    if (paramsObj && paramsObj.startDay) { params['deadlineDateFilter.StartDate'] = paramsObj.startDay; }
    if (paramsObj && paramsObj.endDay) { params['deadlineDateFilter.EndDate'] = paramsObj.endDay; }

    if (paramsObj && paramsObj.noticeNumber) { params['noticeNumber'] = paramsObj.noticeNumber; }
    if (paramsObj && paramsObj.contractNumber) { params['contractNumber'] = paramsObj.contractNumber; }
    if (paramsObj && paramsObj.purchaseStatusIds) { params['purchaseStatusIds'] = paramsObj.purchaseStatusIds; }
    if (paramsObj && paramsObj.purchaseChapterIds) { params['purchaseChapterIds'] = paramsObj.purchaseChapterIds; }
    if (paramsObj && paramsObj.region) { params['regionId'] = paramsObj.region; }
    if (paramsObj && paramsObj.city) { params['cityId'] = paramsObj.city; }
    if (paramsObj && paramsObj.tenderPlatform) { params['tenderPlatformId'] = paramsObj.tenderPlatform; }
    if (paramsObj && paramsObj.contractDate) {
      params['ContractDateFilter.StartDate'] = paramsObj.contractDate.start;
      params['ContractDateFilter.EndDate'] = paramsObj.contractDate.end;
    }
    if (paramsObj && paramsObj.finalContractPrice) {
      params['PriceFilter.StartPrice'] = paramsObj.finalContractPrice.from;
      params['PriceFilter.EndPrice'] = paramsObj.finalContractPrice.to;
    }

    if (paramsObj && paramsObj.sortType && paramsObj.sortBy) {
      params['sortType'] = paramsObj['sortType'] === 'descend' ? 'DESC' : 'ASC';
      params['sortBy'] = paramsObj.sortBy;
    }

    if (paramsObj['productName']) {
      params['productName'] = paramsObj['productName'];
    }

    return this.paginationRequest<PurchaseResponse>(`/api/v1/purchases`, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(purchase => new Purchase(purchase)),
        } as PaginationChunk<Purchase>;
      });
  }

  getPurchaseById(id: string) {
    const url = `/api/v1/purchases/${id}`;
    return this.http.get<PurchaseResponse>(url)
      .map((response: PurchaseResponse) => new Purchase(response));
  }

  update(id: string, data: PurchaseUpdate) {
    return this.http.put<PurchaseResponse>(`/api/v1/purchases/${id}`, data)
      .map(response => new Purchase(response));
  }

  create(data: PurchaseCreate) {
    return this.http.post<PurchaseResponse>(`/api/v1/purchases`, data)
      .map(response => new Purchase(response));
  }

  delete(id: string) {
    const url = `/api/v1/purchases/${id}`;
    return this.http.delete<any>(url);
  }

  getPurchasesByPatientId(patientId: string, statuses: Status[], hasQuotas?: boolean): Observable<Purchase[]> {
    const statusParam = statuses.map(status => 'purchaseStatusIds=' + status.id).join('&');
    return this.http.get<Purchase[]>(`/api/v1.0/purchases?PatientId=${patientId}&${statusParam}${hasQuotas ? '&hasQuotas=true' : ''}`);
  }
}
