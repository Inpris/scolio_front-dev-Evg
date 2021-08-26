import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { Contact, ContactCreate, ContactResponse } from '@common/models/contact';
import { SearchUtils } from '@common/utils/search';

export { Contact };

@Injectable()
export class ContactsService extends PaginableService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  create(data: ContactCreate) {
    return this.http.post<ContactResponse>('/api/v1/contacts', data)
      .map(response => new Contact(response));
  }

  update(id, data: ContactCreate) {
    return this.http.put<ContactResponse>(`/api/v1/contacts/${id}`, data)
      .map(response => new Contact(response));
  }

  delete(id: string) {
    const url = `/api/v1/contacts/${id}`;
    return this.http.delete(url);
  }

  getList(paginationParams: PaginationParams, params?: any) {
    let searchParams;
    if (paginationParams && paginationParams.searchTerm) {
      const { searchTerm = '' } = paginationParams;
      searchParams = SearchUtils.extractName(searchTerm);
    }
    if (!searchParams) {
      searchParams = params;
    } else if (params) {
      Object.keys(params).forEach((item) => {
        searchParams[item] = params[item];
      });
    }

    return this.paginationRequest<ContactResponse>('/api/v1/contacts', paginationParams, searchParams)
      .map(contacts => ({ ...contacts, data: contacts.data.map(contact => new Contact(contact)) }) as PaginationChunk<Contact>);
  }

  getTableList(paginationParams: PaginationParams, params?: any) {
    let searchParams;
    if (paginationParams && paginationParams.searchTerm) {
      const { searchTerm = '' } = paginationParams;
      searchParams = SearchUtils.extractName(searchTerm);
    }
    if (!searchParams) {
      searchParams = params;
    } else if (params) {
      Object.keys(params).forEach((item) => {
        searchParams[item] = params[item];
      });
    }

    return this.paginationRequest<any>('/api/v1/contacts/table', paginationParams, searchParams);
  }

  getById(id: string) {
    return this.getList(null, { id })
      .map(response => response.data[0]);
  }

  getDuplicates(paginationParams: PaginationParams, params?: any) {
    let searchParams;
    if (paginationParams && paginationParams.searchTerm) {
      const { searchTerm = '' } = paginationParams;
      searchParams = SearchUtils.extractName(searchTerm);
    }
    if (!searchParams) {
      searchParams = params;
    } else if (params) {
      Object.keys(params).forEach((item) => {
        searchParams[item] = params[item];
      });
    }

    return this.paginationRequest<ContactResponse>('/api/v1/contacts/duplicates', paginationParams, searchParams)
      .map(contacts => contacts.data.map(contact => new Contact(contact)));
  }
}
