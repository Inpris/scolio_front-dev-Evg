import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

const API_URL = '/api/v1.0/processing-agreement';

export interface TemplateContactData {
  firstName: string;
  secondName: string;
  lastName: string;
  birthDate: string;
  acceptSms: boolean;
}

@Injectable()
export class ConsentToTreatmentService {
  constructor(private http: HttpClient) {}

  getList() {
    return this.http.get<{[key: string]: string}>(`${API_URL}/templates`)
               .map(response => Object.keys(response).map(template => ({ template, name: response[template] })));
  }

  getTemplate(contactId: string, template: string) {
    return this.http.get(`${API_URL}/${contactId}/file`, { responseType: 'blob', params: { template } });
  }
}

