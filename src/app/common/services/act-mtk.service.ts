import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActMtkTemplate } from '@common/models/act-mtk-template';
import { Observable } from 'rxjs/Observable';
import { ActMtk } from '@common/models/act-mtk';

@Injectable()
export class ActMtkService {

  constructor(private http: HttpClient) {
  }

  getTemplates(): Observable<ActMtkTemplate[]> {
    return this.http.get<ActMtkTemplate[]>('/api/v1/actmtk/templates')
      .map(response => response.map(template => new ActMtkTemplate(template as ActMtkTemplate)));
  }

  createTemplate(data: ActMtkTemplate): Observable<ActMtkTemplate> {
    return this.http.post<ActMtkTemplate>('/api/v1/actmtk/template', data)
      .map(template => new ActMtkTemplate(template));
  }

  createActmtk(data: ActMtk): Observable<ActMtk> {
    return this.http.post<ActMtk>('/api/v1/actmtk', data)
      .map(template => new ActMtk(template));
  }

  deleteTemplate(id): Observable<Object> {
    return this.http.delete('/api/v1/actmtk/template', { params: { id } });
  }

  deleteActmtk(id: string): Observable<Object> {
    return this.http.delete(`/api/v1/actmtk/${id}`);
  }

  updateActmtk(id: string, data: ActMtk): Observable<ActMtk>  {
    return this.http.put<ActMtk>(`/api/v1/actmtk/${id}`, data)
      .map(template => new ActMtk(template));
  }

  getActmtk(id): Observable<ActMtk> {
    return this.http.get<ActMtk>(`/api/v1/actmtk/${id}`)
      .map(template => new ActMtk(template));
  }

}
