import {Doctor, IDoctorItem} from '@common/models/doctor';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '@common/interfaces/User';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';
import { UserResponse } from '@common/models/user';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {DateUtils} from '@common/utils/date';
import {DoctorWorkedTimeResponse, DoctorWorkedTimeUpdate, mapDoctorWorkToWorkedTime, WorkedTime, WorkedTimeResponse, WorkedTimeUpdate} from '@common/models/worked-time';

export { User };
export { Doctor };


@Injectable()
export class DoctorsService extends PaginableService {
  constructor(protected http: HttpClient) {
    super(http);
  }

  getList(paginationParams: PaginationParams = {}, searchCriteria?) {
    return this.paginationRequest<UserResponse>(`/api/v1/users/doctors`, paginationParams, { ...searchCriteria, IsDeleted: false })
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          // data: data.map(user => new User(user)),
          data: data.map(user => ({ id: user.id, name: user.abbreviatedName })),
        } as PaginationChunk<any>;
      });
  }

  getDoctors(branchId: string): Observable<Doctor[]> {
    return this.http.get<IDoctorItem[]>(`/api/v1/users/get-doctors?branchId=${branchId}`)
      .pipe(
        map((doctors: IDoctorItem[]) => doctors.map((doctor: IDoctorItem) => ({ id: doctor.doctorId, name: doctor.doctorName }))),
      );
  }

  workedTime(doctorId: string, mondayDate: Date, doctor: Doctor) {
    const params = { mondayDate: DateUtils.toISODateString(mondayDate) };
    return this.http.get<DoctorWorkedTimeResponse[]>(`/api/v1/users/${doctorId}/weekly-worked-time`, { params })
      .map((times: DoctorWorkedTimeResponse[]) => {
        const workedTimes: WorkedTimeResponse[] = mapDoctorWorkToWorkedTime(times, mondayDate, doctor);

        return new WorkedTime(workedTimes);
      });
  }

  updateWorkedTime(workedTimeUpdate: DoctorWorkedTimeUpdate, doctorId: string) {
    return this.http.post<boolean>(`/api/v1/users/${doctorId}/weekly-worked-time`, workedTimeUpdate);
  }
}
