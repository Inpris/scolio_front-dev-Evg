import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from '@common/services/dictionaries/abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { Entity } from '@common/interfaces/Entity';

const DICTIONARY_URL = '/api/v1/dictionaries/actmtk-comission-solution';

@Injectable()
export class ActmtkComissionSolutionService extends AbstractDictionaryService<Entity> {

  constructor(http: HttpClient) {
    super(http, DICTIONARY_URL);
  }

}
