import { Appointment } from '@common/models/appointment';
import { Room } from '@common/models/room';
import { WorkedTime } from '@common/models/worked-time';

interface SheduleResponse {
  appointments: Appointment[];
  mondayDate: Date;
  room: Room;
  workedTime: WorkedTime;
}

export class Shedule {
  appointments: Appointment[];
  mondayDate: Date;
  room: Room;
  workedTime: WorkedTime;

  constructor(data: SheduleResponse) {
    this.appointments = data.appointments;
    this.mondayDate = data.mondayDate;
    this.room = data.room;
    this.workedTime = data.workedTime;
  }
}
