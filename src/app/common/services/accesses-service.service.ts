import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AccessesService {

  constructor(private http: HttpClient) { }

  public getList(data: string) {
    return this.http.get(`/api/v1/contacts/accesses${data}`);
  }

  public isAccess(branchId: string, contactId: string) {
    return this.http.get(`/api/v1/contacts/check-access?branchId=${branchId}&contactId=${contactId}`);
  }

  public changeAccess(data: any) {
    return this.http.post(`/api/v1/contacts/change-access`, data);
  }

  public getAccessNumCode(branchId: string, contactId: string) {
    return this.http.get(`/api/v1/contacts/access-num?branchId=${branchId}&contactId=${contactId}`);
  }

  public updateAccess(data: any) {
    return this.http.post(`/api/v1/contacts/update-access`, data);
  }
}
