import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeadSource } from '@common/interfaces/Lead-source';

@Injectable()
export class LeadSourcesService {
  private leadSources: { [id: string]: LeadSource } = {};

  constructor(private http: HttpClient) {
  }

  get(id: string) {
    return this.leadSources[id];
  }

  getList() {
    return this.http.get<LeadSource[]>('/api/v1/lead-sources')
      .do((leadSources) => {
        leadSources.forEach((leadSource) => {
          this.leadSources[leadSource.id] = leadSource;
        });
      });
  }
}
