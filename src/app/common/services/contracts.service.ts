import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContractCreateRequest, Contract, ContractUpdateRequest } from '@common/models/contract';

const API_URL = '/api/v1.0/contracts';
@Injectable()
export class ContractsService {

  constructor(private http: HttpClient) { }

  create(data: ContractCreateRequest) {
    return this.http.post(API_URL, data)
      .map((response: Contract) => new Contract(response));
  }

  update(data: ContractUpdateRequest) {
    return this.http.put(`${API_URL}/${data.id}`, data)
      .map((response: Contract) => new Contract(response));
  }

  get(id: string) {
    return this.http.get(`${API_URL}/${id}`)
      .map((response: Contract) => new Contract(response));
  }

  getProducts() {
    return this.http.get(`${API_URL}/products`);
  }

  getFile(id: string) {
    return this.http.get(`${API_URL}/${id}`, { responseType: 'blob' });
  }

  getCertificate(id: string) {
    return this.http.get(`${API_URL}/${id}/visit-certificate`, { responseType: 'blob' });
  }

  detele(id) {
    return this.http.delete(`${API_URL}/${id}`);
  }

  getTemplates() {
    return this.http.get<{[key: string]: string}>(`${API_URL}/templates`)
      .map(response => Object.keys(response).map(template => ({ template, name: response[template] })));
  }
}
