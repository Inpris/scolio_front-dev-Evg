import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Appointment, AppointmentCreate, AppointmentResponse } from '@common/models/appointment';
import { DateUtils } from '@common/utils/date';
import { RoomsService } from '@common/services/rooms';
import { SignalR } from '@common/services/signalR';
import { Observable } from 'rxjs/Observable';

export { Appointment, AppointmentCreate };

const APPOINTMENT_CREATED = 'appointment.created';
const APPOINTMENT_CHANGED = 'appointment.changed';
const APPOINTMENT_DELETED = 'appointment.deleted';

@Injectable()
export class AppointmentsService {
  readonly appointmentCreated = this.signalR.on(APPOINTMENT_CREATED).map(data => new Appointment(data));
  readonly appointmentChanged = this.signalR.on(APPOINTMENT_CHANGED).map(data => new Appointment(data));
  readonly appointmentDeleted = this.signalR.on(APPOINTMENT_DELETED);

  constructor(
    private http: HttpClient,
    private roomsService: RoomsService,
    private signalR: SignalR,
  ) {
  }

  create(data: AppointmentCreate) {
    return this.http.post<AppointmentResponse>('/api/v1/appointments', data)
      .do((response) => { this.signalR.call(APPOINTMENT_CREATED, response); })
      .map(response => new Appointment(response));
  }

  update(data: AppointmentCreate) {
    return this.http.put<AppointmentResponse>(`/api/v1/appointments/${data.id}`, data)
      .do((response) => { this.signalR.call(APPOINTMENT_CHANGED, response); })
      .map(response => new Appointment(response));
  }

  remove(id: string) {
    return this.http.delete<void>(`/api/v1/appointments/${id}`)
      .do(() => { this.signalR.call(APPOINTMENT_DELETED, id); });
  }

  get(id: string) {
    return this.http.get<AppointmentResponse>(`/api/v1/appointments/${id}`)
      .map(appointment => new Appointment(appointment));
  }

  getListForRoom(roomId: string, mondayDate: Date) {
    return this.getList({ roomId }, mondayDate);
  }

  getListForDoctor(doctorId: string, mondayDate: Date) {
    return this.getList({ doctorId }, mondayDate);
  }

  getListForPurchasePatient(purchaseId: string, patientId: string) {
    return this.http.get<AppointmentResponse[]>(`/api/v1/appointments`, { params: { purchaseId, contactId: patientId, sortBy: 'dateTime' } })
      .map(appointments => appointments.map(appointment => new Appointment(appointment)));
  }

  private getList(params, mondayDate: Date) {
    params.mondayDate = DateUtils.toISODateString(mondayDate);
    return this.http.get<AppointmentResponse[]>(`/api/v1/appointments/weekly-appointments`, { params })
      .map(appointments => appointments.map(appointment => new Appointment(appointment)));
  }
}
