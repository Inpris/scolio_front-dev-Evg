import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from './abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';

const DICTIONARY_URL = '/api/v1.0/dictionaries/visit-reasons';

@Injectable()
export class VisitReasonsListService extends AbstractDictionaryService<EntityWithSysName> {

  constructor(http: HttpClient) {
    super(http, DICTIONARY_URL);
  }

}
