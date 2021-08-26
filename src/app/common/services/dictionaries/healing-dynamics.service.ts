import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from './abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';

const HEALING_DYNAMICS_DICTIONARY = '/api/v1.0/dictionaries/healing-dynamics';

@Injectable()
export class HealingDynamicsService extends AbstractDictionaryService<EntityWithSysName> {

  constructor(http: HttpClient) {
    super(http, HEALING_DYNAMICS_DICTIONARY);
  }
}
