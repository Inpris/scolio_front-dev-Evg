import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationParams, PaginationChunk } from '@common/services/paginable';
import { Service } from '@common/models/service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MedicalServicesService extends PaginableService {
  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  get(params, paginationParams: PaginationParams = {}): Observable<PaginationChunk<Service>> {
    return this.paginationRequest<Service>(`/api/v1.0/medical-services`, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data,
        } as PaginationChunk<Service>;
      });
  }

  getByPurchasePatient(purchaseId: string, patientId: string): Observable<Service[]> {
    return this.http.get<Service[]>('/api/v1.0/dictionaries/medical-services', { params: { purchaseId, contactId: patientId } })
               .map(data => data.filter((value, index) => data.findIndex(element => element.id === value.id) >= index));
  }
}
