import { Doctor } from './doctor';
import * as moment from 'moment';

export interface WorkedTimeUpdate {
  weeklyWorkedSchedule: {
    dateTimeStart: string;
    dateTimeEnd: string;
    dayOfWeek: number;
    doctorId: string;
  }[];
}

export interface DoctorWorkedTimeUpdate {
  weeklyWorkedSchedule: {
    timeFrom: string;
    timeTo: string;
    dayOfWeek: number;
  }[];
}

export interface WorkedTimeResponse {
  dateTimeStart: string;
  dateTimeEnd: string;
  doctorId: string;
  dayOfWeek: number;
  roomId: string;
  flag?: string;
}

export interface DoctorWorkedTimeResponse {
  timeFrom: string;
  timeTo: string;
  weekDay: number;
  doctorId: string;
  roomId: string;
  flag?: string;
}

export interface DoctorRoomWorkTimeResponse {
  timeFrom: string;
  timeTo: string;
  doctorId: string;
  roomId: string;
}

export interface WorkedTimeRange {
  dateTimeStart: Date;
  dateTimeEnd: Date;
  doctorId: string;
  dayOfWeek: number;
  roomId?: string;
  flag?: string;
  branchName?: string;
  roomName?: string;
}

export const mapDoctorWorkToWorkedTime = (times: DoctorWorkedTimeResponse[], mondayDate: Date, doctor: Doctor): WorkedTimeResponse[] => {
  return times.map((time: DoctorWorkedTimeResponse) => {
    const correctDay = time.weekDay === 0 ? 7 : time.weekDay;
    // @ts-ignore
    const currentDay = moment(mondayDate).startOf('isoweek').add(correctDay - 1, 'days');
    const timeStart = moment(time.timeFrom, 'hh:mm:ss');
    const timeEnd = moment(time.timeTo, 'hh:mm:ss');

    const dateTimeStart: string = currentDay.clone().set({
      hour:   timeStart.get('hour'),
      minute: timeStart.get('minute'),
      second: timeStart.get('second'),
    }).format().split('+')[0];

    const dateTimeEnd: string = currentDay.clone().set({
      hour:   timeEnd.get('hour'),
      minute: timeEnd.get('minute'),
      second: timeEnd.get('second'),
    }).format().split('+')[0];

    return {
      dateTimeStart,
      dateTimeEnd,
      doctorId: time.doctorId,
      dayOfWeek: time.weekDay,
      roomId: time.roomId,
      flag: time.flag,
    };
  });
};

export class WorkedTime {
  times: WorkedTimeRange[];

  constructor(response: WorkedTimeResponse[]) {
    this.times = response.map((item) => {
      return {
        doctorId: item.doctorId,
        roomId: item.roomId,
        dayOfWeek: moment(item.dateTimeStart).day(),
        dateTimeStart: new Date(moment(item.dateTimeStart).format()),
        dateTimeEnd: new Date(moment(item.dateTimeEnd).format()),
        flag: item.flag,
      };
    });
  }

  contain(time: Date) {
    for (const timeRange of this.times) {
      if (time < timeRange.dateTimeEnd && time >= timeRange.dateTimeStart) {
        return true;
      }
    }
    return false;
  }
}
