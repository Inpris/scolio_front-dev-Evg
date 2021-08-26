import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from './abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { Entity } from '../../interfaces/Entity';

const MKB10_DICTIONARY = '/api/v1.0/dictionaries/mkb10';

@Injectable()
export class Mkb10Service extends AbstractDictionaryService<Entity> {

  constructor(http: HttpClient) {
    super(http, MKB10_DICTIONARY);
  }

}
