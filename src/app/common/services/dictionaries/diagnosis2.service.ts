import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from './abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { Entity } from '../../interfaces/Entity';

const DIAGNOSIS2_DICTIONARY = '/api/v1.0/dictionaries/diagnosis2';

@Injectable()
export class Diagnosis2Service extends AbstractDictionaryService<Entity> {

  constructor(http: HttpClient) {
    super(http, DIAGNOSIS2_DICTIONARY);
  }

}
