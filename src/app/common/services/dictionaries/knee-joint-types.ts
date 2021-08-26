import { HttpClient } from '@angular/common/http';
import { AbstractDictionaryService } from '@common/services/dictionaries/abstract-dictionary-service';
import { Entity } from '@common/interfaces/Entity';
import { Injectable } from '@angular/core';

const KNEE_JOINTS_TYPES_DICTIONARY = '/api/v1/dictionaries/knee-joints';

@Injectable()
export class KneeJointTypesService extends AbstractDictionaryService<Entity> {
  constructor(http: HttpClient) {
    super(http, KNEE_JOINTS_TYPES_DICTIONARY);
  }
}
