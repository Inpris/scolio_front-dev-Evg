import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from '@common/services/dictionaries/abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { Entity } from '@common/interfaces/Entity';

const LEGAL_ENTITIES = '/api/v1/dictionaries/legal-entities';

@Injectable()
export class LegalEntitiesService extends AbstractDictionaryService<Entity> {

  constructor(http: HttpClient) {
    super(http, LEGAL_ENTITIES);
  }

}
