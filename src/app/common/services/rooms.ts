import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DateUtils } from '@common/utils/date';
import { Room } from '@common/models/room';
import { DoctorRoomWorkTimeResponse, DoctorWorkedTimeResponse, mapDoctorWorkToWorkedTime, WorkedTime, WorkedTimeResponse, WorkedTimeUpdate } from '@common/models/worked-time';
import { Observable } from 'rxjs/Observable';
import { Doctor } from '@common/models/doctor';
import { map } from 'rxjs/operators';

export { Room };

@Injectable()
export class RoomsService {
  constructor(private http: HttpClient) {}

  getList(serviceId?: string, branchId?: string) {
    let params = {};

    if (serviceId) {
      params = { ...params, serviceId };
    }

    if (branchId) {
      params = { ...params, branchId };
    }

    return this.http.get<Room[]>('/api/v1/rooms', { params });
  }

  public addRoom(name: string, branchId: string): Observable<Room> {
    return this.http.post<Room>('/api/v1/rooms', { name, branchId });
  }

  public updateRoom(data: { id: string; name: string; branchId: string; }): Observable<Room> {
    return this.http.put<Room>('/api/v1/rooms', data);
  }

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>('/api/v1/rooms');
  }

  workedTime(roomId: string, mondayDate: Date, doctorId?: string) {
    const params: any = { mondayDate: DateUtils.toISODateString(mondayDate) };

    if (doctorId) {
      params.doctorId = doctorId;
    }

    return this.http.get<WorkedTimeResponse[]>(`/api/v1/rooms/${roomId}/weekly-worked-time`, { params })
      .map(times => new WorkedTime(times));
  }

  doctorRoomWorkTime(roomId: string, date: Date, doctor: Doctor, mondayDate: Date, weekDay: number) {
    const params: any = { doctorId: doctor.id, date: DateUtils.toISODateString(date) };

    return this.http.get<DoctorRoomWorkTimeResponse[]>(`/api/v1/rooms/${roomId}/doctor-room-work-time`, { params })
      .pipe(
        map((times: DoctorRoomWorkTimeResponse[]) =>  {
          const doctorTimes: DoctorWorkedTimeResponse[] = times.map(
            (time: DoctorRoomWorkTimeResponse): DoctorWorkedTimeResponse => ({ ...time, weekDay }),
          );

          const workedTimes: WorkedTimeResponse[] = mapDoctorWorkToWorkedTime(doctorTimes, mondayDate, doctor);

          return new WorkedTime(workedTimes);
        }),
      );
  }

  updateWorkedTime(workedTimeUpdate: WorkedTimeUpdate, roomId: string, doctorId: string) {
    return this.http.post<number>(`/api/v1/rooms/${roomId}/weekly-worked-time/${doctorId}`, workedTimeUpdate);
  }

  doctorWorkedTime(doctorId: string, startDate: Date, endDate: Date): Observable<WorkedTime> {
    const params: any = { startDate: DateUtils.toISODateString(startDate), endDate: DateUtils.toISODateString(endDate) };

    return this.http.get<WorkedTimeResponse[]>(`/api/v1/rooms/${doctorId}/doctor-worked-time`, { params })
      .map(times => new WorkedTime(times));
  }

  doctorWeekRoomWorkTime(roomId: string, date: Date): Observable<WorkedTime> {
    const params: any = { date: DateUtils.toISODateString(date) };

    return this.http.get<WorkedTimeResponse[]>(`/api/v1/rooms/${roomId}/doctor-week-room-work-time`, { params })
      .map(times => new WorkedTime(times));
  }

  updateRealRoomWorkTimes(workedTimeUpdate: WorkedTimeUpdate, roomId: string, doctorId: string, date: Date) {
    const day: string = DateUtils.toISODateString(date);

    return this.http.post<boolean>(`/api/v1/rooms/${roomId}/real-weekly-worked-time/${doctorId}/${day}`, workedTimeUpdate);
  }

  copyRealRoomWorkTimes(request: ICopy): Observable<{ result: string; }> {
    return this.http.post<{ result: string; }>(`/api/v1/rooms/weekly-worked-time-copy`, request);
  }
}

export interface ICopy {
  roomId: string;
  date: string;
  doctorTo: string;
  roomTo: string;
  timeFromTo: string;
  timeToTo: string;
  visitTimeTo: number;
  visitTimeIncrementTo: number;
  dateTo: string;
  userId: string;
}
