import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EmailCreate } from '@common/interfaces/Email-create';
import { SmsCreate } from '@common/interfaces/Sms-create';
import { Observable } from 'rxjs/Observable';
import { SmsResponse } from '@common/interfaces/Sms-response';
import { Sms } from '@common/models/sms';

@Injectable()
export class MsgService {

  constructor(
    private http: HttpClient,
  ) {

  }

  sendEmail(data: EmailCreate) {
    return this.http.post<any>('/api/v1/mails', data)
      .map((response) => {
        return response;
      });
  }

  remove(id: string) {
    return this.http.delete(`/api/v1/mails/${id}`);
  }

  restore(id: string) {
    const params = new HttpParams().set('id', id.toString());
    return this.http.post(`/api/v1.0/mails/undelete`, { id }, { params });
  }

  sendSms(data: SmsCreate) {
    return this.http.post<any>('/api/v1/sms', data)
      .map((response) => {
        return response;
      });
  }

  getSms(id: string): Observable<Sms> {
    return this.http.get<SmsResponse>(`/api/v1/sms/${id}`)
      .map(
        response => new Sms(response),
      );
  }

  removeSms(id: string) {
    return this.http.delete(`/api/v1/sms/${id}`);
  }
}
