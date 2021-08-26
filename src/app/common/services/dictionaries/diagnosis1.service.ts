import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from './abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { Entity } from '../../interfaces/Entity';

const DIAGNOSIS1_DICTIONARY = '/api/v1.0/dictionaries/diagnosis1';

@Injectable()
export class Diagnosis1Service extends AbstractDictionaryService<Entity> {

  constructor(http: HttpClient) {
    super(http, DIAGNOSIS1_DICTIONARY);
  }

}
