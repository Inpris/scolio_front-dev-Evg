import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from '@common/services/dictionaries/abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { Entity } from '@common/interfaces/Entity';

const CORSET_TYPES_DICTIONARY = '/api/v1/dictionaries/corset-types';

@Injectable()
export class CorsetTypesService extends AbstractDictionaryService<Entity> {

  constructor(http: HttpClient) {
    super(http, CORSET_TYPES_DICTIONARY);
  }

}
