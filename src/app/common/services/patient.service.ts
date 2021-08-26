import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { Patient } from '@common/models/patient';
import { PatientResponse } from '@common/interfaces/Patient-response';
import { PatientDeviceCreate } from '@common/interfaces/Patient-device-create';
import { PatientDeviceResponse } from '@common/interfaces/Patient-device-response';
import { PatientDevice } from '@common/models/patient-device';
import { PatientPurchases } from '@common/interfaces/Patient-purchases';
import { Observable } from 'rxjs/Observable';
import { PatientRepresentative } from '@common/models/patient-representative';
import { PatientRepresentativeResponse } from '@common/interfaces/Patient-representative-response';
import { DateUtils } from '@common/utils/date';
// TODO: rename to purhase-patinets service, since patients itself relates to contacts
@Injectable()
export class PatientService extends PaginableService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  getList(paramsObj: any = {}, paginationParams: PaginationParams = {}) {
    const params = {};
    if (paramsObj.sortType && paramsObj.sortBy || paramsObj.patientFio) {
      params['sortType'] = paramsObj.sortType;
      params['sortBy'] = paramsObj.sortBy;
      params['patientFio'] = paramsObj.patientFio;
    }
    return this.paginationRequest<PatientResponse>(`/api/v1/purchases/${paramsObj.purchaseId}/patients`, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(patient => new Patient(patient)),
        } as PaginationChunk<Patient>;
      });
  }

  getByIds(purchaseId: string, id: string) {
    const url = `/api/v1/purchases/${purchaseId}/patients/${id}`;
    return this.http.get<PatientResponse>(url)
      .map((response) => {
        return new Patient(response);
        // return response.map(item => new Patient(item));
      });
  }

  create(purchaseId, data) {
    const url = `/api/v1/purchases/${purchaseId}/patients`;
    return this.http.post<PatientResponse>(url, data)
      .map(response => new Patient(response));
  }

  update(purchaseId, patientId, data) {
    const url = `/api/v1/purchases/${purchaseId}/patients/${patientId}`;
    return this.http.put<PatientResponse>(url, data)
      .map(response => new Patient(response));
  }

  delete(purchaseId, patientId) {
    const url = `/api/v1/purchases/${purchaseId}/patients/${patientId}`;
    return this.http.delete<any>(url);
  }

  getPurchases(patientId: string): Observable<PatientPurchases[]> {
    return this.http.get<PatientPurchases[]>(`/api/v1.0/patients/${patientId}/purchases`);
  }

  getRepresentativesByPatient(patientId: string): Observable<PatientRepresentative[]> {
    return this.http.get<PatientRepresentativeResponse[]>(`/api/v1.0/representatives/${patientId}`)
     .map(representatives => representatives.map(item => new PatientRepresentative(item)));
  }

  createRepresentative(data: PatientRepresentative) {
    return this.http.post<PatientRepresentativeResponse>('/api/v1.0/representatives', data)
      .map(response => new PatientRepresentative(response));
  }

  updateRepresentative(id, data: PatientRepresentative) {
    return this.http.put<PatientRepresentativeResponse>(`/api/v1.0/representatives/${id}`, data)
      .map(response => new PatientRepresentative(response));
  }

  deleteRepresentative(id: string) {
    const url = `/api/v1.0/representatives/${id}`;
    return this.http.delete(url);
  }

  toUpdateRequestRepresentative(contact) {
    return {
      address: contact.address,
      passport: contact.passport ? { ...contact.passport } : {
        serialNumber: null,
        issueDate: null,
        issueBy: null,
      },
      firstName: contact.firstName,
      secondName: contact.secondName,
      lastName: contact.lastName,
      birthDate: contact.birthDate ? DateUtils.toISODateTimeString(contact.birthDate) : null,
      gender: contact.gender,
      phone: contact.phone,
      email: contact.email,
      communications: contact.communications,
      comment: contact.reprisetativeComment,
      patientAffiliation: contact.patientAffiliation,
      defaultAgent: contact.defaultAgent,
      id: contact.representativeId,
      representativeId: contact.id,
    };
  }

  getProduct(purchaseId: string, patientId: string, paginationParams: PaginationParams = {}) {
    const url = `/api/v1/purchases/${purchaseId}/patients/${patientId}/devices`;
    return this.paginationRequest<PatientDeviceResponse>(url, paginationParams)
    .map(({ data, page, pageSize, pageCount, totalCount }) => {
      return {
        page,
        pageSize,
        pageCount,
        totalCount,
        data: data.map(device => new PatientDevice(device)),
      } as PaginationChunk<PatientDevice>;
    });
  }

  createProduct(purchaseId: string, patientId: string, data: PatientDeviceCreate) {
    const url = `/api/v1/purchases/${purchaseId}/patients/${patientId}/devices`;
    return this.http.post<PatientDeviceResponse>(url, data)
      .map(response => new PatientDevice(response));
  }

  updateProduct(purchaseId: string, patientId: string, data: PatientDeviceCreate) {
    const url = `/api/v1/purchases/${purchaseId}/patients/${patientId}/devices/${data.purchaseDeviceId}`;
    return this.http.put<PatientDeviceResponse>(url, data)
      .map(response => new PatientDevice(response));
  }

  deleteProduct(purchaseId: string, patientId: string, productId: string) {
    const url = `/api/v1/purchases/${purchaseId}/patients/${patientId}/devices/${productId}`;
    return this.http.delete<any>(url);
  }

  cancelPatient(patientId: string, purchaseId: string, data) {
    if (patientId && purchaseId) {
      return this.update(purchaseId, patientId, { ...data, isCanceled: true });
    }
    return Observable.of(null);
  }
}
