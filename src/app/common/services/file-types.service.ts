import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Entity } from '@common/interfaces/Entity';

@Injectable()
export class FileTypesService {
  constructor(private http: HttpClient) {
  }

  getList() {
    return this.http.get<Entity[]>('/api/v1/dictionaries/document-types');
  }
}
