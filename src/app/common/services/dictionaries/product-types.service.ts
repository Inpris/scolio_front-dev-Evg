import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from '@common/services/dictionaries/abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { Entity } from '@common/interfaces/Entity';

const PRODUCT_TYPES = '/api/v1/dictionaries/product-types';

@Injectable()
export class ProductTypesByMedicalService extends AbstractDictionaryService<Entity> {

  constructor(http: HttpClient) {
    super(http, PRODUCT_TYPES);
  }

}
