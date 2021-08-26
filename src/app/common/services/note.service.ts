import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NoteCreate } from '@common/interfaces/Note-create';
import { NoteResponse } from '@common/interfaces/Note-response';
import { Note } from '@common/models/note';

@Injectable()
export class NoteService {
  constructor(
    protected http: HttpClient,
  ) {
  }

  getEvents(parameters) {
    return this.http.get<any[]>(`/api/v1/events?EntityId=${parameters.entityId}&EntityType=${parameters.entityType}`);
  }

  create(data: NoteCreate) {
    return this.http.post<NoteResponse>('/api/v1/notes', data)
      // .do((response) => { this.signalR.call(TASK_CREATED, response); })
      .map(response => new Note(response));
  }
}
