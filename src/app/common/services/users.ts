import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { User, UserCreate, UserResponse, UserRole } from '@common/models/user';
import { SearchUtils } from '@common/utils/search';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class UsersService extends PaginableService {
  public users$: BehaviorSubject<PaginationChunk<User>> = new BehaviorSubject(null);

  constructor(protected http: HttpClient) {
    super(http);
  }

  getList(paginationParams: PaginationParams = {}, params: any = {}) {
    let searchParams = {};
    if (params && params.searchTerm) {
      const { searchTerm = '' } = params;
      searchParams = SearchUtils.extractName(searchTerm);
    }
    searchParams['sortBy'] = params['sortBy'];
    searchParams['sortType'] = params['sortType'] === 'descend' ? 'DESC' : 'ASC';
    searchParams['PhoneNumber'] = params['phoneNumber'];
    searchParams['Email'] = params['email'];
    searchParams['UserName'] = params['userName'];
    searchParams['RoleIds'] = params['roleIds'];
    searchParams['BranchId'] = params['branchId'];
    searchParams['BranchIds'] = params['branchIds'];
    searchParams['DepartmentId'] = params['departmentId'];
    searchParams['PositionId'] = params['positionId'];
    searchParams['IsDeleted'] = typeof params['isDeleted'] === 'undefined' ? false : params['isDeleted'] ;

    return this.paginationRequest<UserResponse>(`/api/v1/users`, paginationParams, searchParams)
      .pipe(
        map(({ data, page, pageSize, pageCount, totalCount }) => {
          return {
            page,
            pageSize,
            pageCount,
            totalCount,
            data: data.map(user => new User(user)),
          } as PaginationChunk<User>;
        }),
        tap((users: PaginationChunk<User>) => this.users$.next(users)),
      );
  }

  getRoles() {
    return this.http.get<UserRole[]>('/api/v1/roles');
  }

  createUser(data: UserCreate) {
    return this.http.post<UserResponse>('/api/v1/users', data)
      .map(user => new User(user));
  }

  changeSchedule(data: any): Observable<any> {
    return this.http.post<any>('/api/v1/users/change-schedule', data)
  }

  savedAppointment(data: any): Observable<any> {
    return this.http.post<any>('/api/v1/users/saved-appointment', data)
  }

  updateUser(id, data) {
    return this.http.put<UserResponse>(`/api/v1/users/${id}`, data)
      .map(user => new User(user));
  }

  disableUser(id) {
    return this.http.delete(`/api/v1/users/${id}`);
  }

  enableUser(id) {
    return this.http.get(`/api/v1/users/restore-user/${id}`);
  }

  updatePassword(id, data: { password: string }) {
    return this.http.put(`/api/v1/users/reset-password/${id}`, data);
  }
}
