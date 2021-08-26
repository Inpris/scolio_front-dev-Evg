import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from '@common/services/dictionaries/abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { Entity } from '@common/interfaces/Entity';

const PROTHESIS_TYPES_DICTIONARY = '/api/v1/dictionaries/prothesis-types-vk';

@Injectable()
export class ProthesisTypesVkService extends AbstractDictionaryService<Entity> {

  constructor(http: HttpClient) {
    super(http, PROTHESIS_TYPES_DICTIONARY);
  }

}
