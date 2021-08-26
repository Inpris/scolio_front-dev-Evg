import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from '@common/services/dictionaries/abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';

const PRODUCT_TYPES_BY_MEDICAL = '/api/v1/dictionaries/product-types-by-medical-service';
const PRODUCT_TYPES = '/api/v1.0/dictionaries/product-types';

@Injectable()
export class ProductTypesByMedicalService extends AbstractDictionaryService<EntityWithSysName> {

  constructor(http: HttpClient) {
    super(http, PRODUCT_TYPES_BY_MEDICAL);
  }

  getProductTypes() {
    return this.http.get<EntityWithSysName[]>(PRODUCT_TYPES);
  }

  getByPurchasePatient(purchaseId: string, patientId: string) {
    return this.http.get<EntityWithSysName[]>(PRODUCT_TYPES, { params: { purchaseId, contactId: patientId } });
  }
}
