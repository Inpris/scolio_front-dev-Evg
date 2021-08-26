import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from './abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';

const IPR_PRP_DICTIONARY = '/api/v1.0/dictionaries/ipr-prp';

@Injectable()
export class IprPrpService extends AbstractDictionaryService<EntityWithSysName> {

  constructor(http: HttpClient) {
    super(http, IPR_PRP_DICTIONARY);
  }

}
