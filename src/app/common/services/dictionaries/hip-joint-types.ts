import { HttpClient } from '@angular/common/http';
import { AbstractDictionaryService } from '@common/services/dictionaries/abstract-dictionary-service';
import { Entity } from '@common/interfaces/Entity';
import { Injectable } from '@angular/core';

const HIP_JOINTS_TYPES_DICTIONARY = '/api/v1/dictionaries/hip-joints';

@Injectable()
export class HipJointTypesService extends AbstractDictionaryService<Entity> {
  constructor(http: HttpClient) {
    super(http, HIP_JOINTS_TYPES_DICTIONARY);
  }
}
