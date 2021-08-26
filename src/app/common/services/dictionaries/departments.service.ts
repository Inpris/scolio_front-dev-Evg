import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from './abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { Entity } from '../../interfaces/Entity';

const DICTIONARY_URL = '/api/v1.0/dictionaries/departments';

@Injectable()
export class DepartmentsService extends AbstractDictionaryService<Entity> {

  constructor(http: HttpClient) {
    super(http, DICTIONARY_URL);
  }

}
