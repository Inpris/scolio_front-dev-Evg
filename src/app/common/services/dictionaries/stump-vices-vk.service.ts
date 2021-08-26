import { Injectable } from '@angular/core';
import { AbstractDictionaryService } from './abstract-dictionary-service';
import { HttpClient } from '@angular/common/http';
import { Entity } from '@common/interfaces/Entity';

const STUMP_VICES_VK_DICTIONARY = '/api/v1.0/dictionaries/stump-vices-vk';

@Injectable()
export class StumpVicesVkService extends AbstractDictionaryService<Entity> {

  constructor(http: HttpClient) {
    super(http, STUMP_VICES_VK_DICTIONARY);
  }

}
