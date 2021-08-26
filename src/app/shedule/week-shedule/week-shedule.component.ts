import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Appointment } from '@common/models/appointment';
import { DateUtils } from '@common/utils/date';
import { DaySheduleComponent } from '../day-shedule/day-shedule.component';
import { Shedule } from '@common/models/shedule';
import { VisitReason } from '@common/models/visit-reason';
import { Doctor } from '@common/models/doctor';
import { WorkedTimeRange } from '@common/models/worked-time';
import * as moment from 'moment';

type SheduleRecordStatus = 'unavailable' | 'empty' | 'busy';

interface ISheduleRecord {
  appointment?: Appointment;
  dateTimeStart: Date;
  available: boolean;
  defaultDoctor: string;
  visibleDate: Date;
}

class SheduleRecord {
  appointment: Appointment;
  dateTimeStart: Date;
  dateTimeStartMilliseconds: number;
  available: boolean;
  defaultDoctor: string;
  visibleDate: Date;

  get confirmed() {
    return this.appointment != null && this.appointment.status !== 'NotConfirmed';
  }

  get status(): SheduleRecordStatus {
    if (this.appointment != null) {
      return 'busy';
    }
    return this.available && DateUtils.nowDate().valueOf() < this.dateTimeStartMilliseconds ? 'empty' : 'unavailable';
  }

  constructor(data: ISheduleRecord) {
    this.appointment = data.appointment;
    this.dateTimeStart = data.dateTimeStart;
    this.dateTimeStartMilliseconds = this.dateTimeStart.getTime();
    this.available = data.available;
    this.defaultDoctor = data.defaultDoctor;
    this.visibleDate = data.visibleDate;
  }
}

class SheduleColumn {
  date: Date;
  records: SheduleRecord[][];

  constructor(date: Date, records: SheduleRecord[][]) {
    this.date = date;
    this.records = records;
  }
}

@Component({
  selector: 'sl-week-shedule',
  templateUrl: './week-shedule.component.html',
  styleUrls: ['./week-shedule.component.less'],
})
export class WeekSheduleComponent implements OnChanges {
  private sheduleDays = 7;
  private timeStart = '9:00';
  private timeEnd = '21:00';

  @Output()
  loadWeek = new EventEmitter<Date>();

  @Output()
  selectAppointment = new EventEmitter<Appointment>();

  @Output()
  selectDate = new EventEmitter<Date>();

  @Output()
  selectDoctor = new EventEmitter<Doctor>();

  @Output()
  selectDefaultDoctor = new EventEmitter<string>();

  @Input()
  date: Date;

  @Input()
  public timeStep = 30;

  @Input() anotherSelected: string[];

  @Input()
  shedule: Shedule;

  @Input()
  visitReason: VisitReason;

  private mondayDate: Date;

  weekShedule;

  get firstDay() {
    return this.weekShedule[0];
  }

  get lastDay() {
    return this.weekShedule[this.weekShedule.length - 1];
  }

  get multiMonthWeek() {
    return this.firstDay.date.getMonth() !== this.lastDay.date.getMonth();
  }

  constructor(private modalService: NzModalService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.shedule != null) {
      const { appointments, mondayDate, workedTime } = changes.shedule.currentValue;
      const visitReasonTime = this.visitReason != null ? this.visitReason.visitReasonTime : this.timeStep;
      const halfLifeMode = false;
      const sheduleTable: SheduleColumn[] = [];
      const createSheduleRecord = (dateTime: Date) => {
        const endOfPeriod = DateUtils.addMinutes(dateTime, this.timeStep - 1);
        const appointment = appointments.filter((a: Appointment) => {
          return (moment(dateTime).isBefore(moment(a.dateTimeEnd)) &&
            moment(dateTime).isSameOrAfter(moment(a.dateTimeStart))) ||
            (moment(a.dateTimeStart).isBefore(moment(endOfPeriod)) &&
            moment(a.dateTimeStart).isSameOrAfter(moment(dateTime)));
        })[0];

        return new SheduleRecord({
          appointment,
          defaultDoctor: this.getDefaultDoctor(workedTime.times, dateTime),
          dateTimeStart: dateTime,
          visibleDate: dateTime,
          available: workedTime.contain(dateTime) && workedTime.contain(endOfPeriod),
        });
      };
      const containFullLifeAppointment = (sheduleRecord: SheduleRecord) => {
        return sheduleRecord.appointment != null && sheduleRecord.appointment.visitReason.visitReasonTime >= this.timeStep;
      };
      const containHalfLifeAppointment = (sheduleRecord: SheduleRecord) => {
        return sheduleRecord.appointment != null && sheduleRecord.appointment.visitReason.visitReasonTime < this.timeStep;
      };
      for (let i = 0; i < this.sheduleDays; i = i + 1) {
        let dateTime = DateUtils.addDays(DateUtils.parse(mondayDate, this.timeStart), i);
        const dateTimeEnd = DateUtils.addDays(DateUtils.parse(mondayDate, this.timeEnd), i);
        const records = [];

        while (dateTime < dateTimeEnd) {
          const firstSheduleRecord = createSheduleRecord(dateTime);
          // const secondSheduleRecord = createSheduleRecord(DateUtils.addMinutes(dateTime, 0.5 * this.timeStep));
          // if (halfLifeMode) {
          //   switch (true) {
          //     case containFullLifeAppointment(firstSheduleRecord):
          //       records.push([firstSheduleRecord]); break;
          //     case containHalfLifeAppointment(firstSheduleRecord) && containFullLifeAppointment(secondSheduleRecord):
          //       records.push([firstSheduleRecord, secondSheduleRecord]); break;
          //     case !firstSheduleRecord.appointment && containFullLifeAppointment(secondSheduleRecord):
          //       secondSheduleRecord.visibleDate = dateTime;
          //       records.push([secondSheduleRecord]); break;
          //     default:
          //       records.push([
          //         firstSheduleRecord,
          //         secondSheduleRecord,
          //       ]);
          //       break;
          //   }
          // } else {
          //   const secondHalfAppointment = (secondSheduleRecord.appointment);
          //   switch (true) {
          //     case containHalfLifeAppointment(firstSheduleRecord) && containHalfLifeAppointment(secondSheduleRecord):
          //     case containHalfLifeAppointment(firstSheduleRecord) && containFullLifeAppointment(secondSheduleRecord):
          //     case containFullLifeAppointment(firstSheduleRecord) && containHalfLifeAppointment(secondSheduleRecord):
          //       records.push([firstSheduleRecord, secondSheduleRecord]); break;
          //     case containFullLifeAppointment(firstSheduleRecord):
          //       records.push([firstSheduleRecord]); break;
          //     case containFullLifeAppointment(secondSheduleRecord):
          //       if (secondHalfAppointment.visitReason && secondHalfAppointment.visitReason.sysName === 'Delivering') {
          //         firstSheduleRecord.available = false;
          //         records.push([firstSheduleRecord, secondSheduleRecord]);
          //       } else {
          //         secondSheduleRecord.visibleDate = dateTime;
          //         records.push([secondSheduleRecord]);
          //       }
          //       break;
          //     case containHalfLifeAppointment(firstSheduleRecord):
          //       secondSheduleRecord.available = false;
          //       records.push([firstSheduleRecord, secondSheduleRecord]);
          //       break;
          //     case containHalfLifeAppointment(secondSheduleRecord):
          //       firstSheduleRecord.available = false;
          //       records.push([firstSheduleRecord, secondSheduleRecord]);
          //       break;
          //     default:
          //       records.push([firstSheduleRecord]); break;
          //   }
          // }

          records.push([firstSheduleRecord]);
          dateTime = DateUtils.addMinutes(dateTime, this.timeStep);
        }
        sheduleTable.push(new SheduleColumn(DateUtils.addDays(mondayDate, i), records));
      }
      this.mondayDate = mondayDate;
      this.weekShedule = sheduleTable;
    }
  }
  private getDefaultDoctor(times: WorkedTimeRange[], dateTime: Date) {
    const filterTime = times.filter(a => DateUtils.between(dateTime, a.dateTimeStart, a.dateTimeEnd));
    const defaultDoctor = filterTime && filterTime[0] ? filterTime[0].doctorId : null;
    return defaultDoctor;
  }

  isSelectedDate(date: Date) {
    if (this.date != null) {
      return DateUtils.equals(this.date, date);
    }
    return false;
  }

  isSelectedOfAnotherUserDate(date: Date) {
    if (this.anotherSelected.length) {
      return this.anotherSelected
        .some((anotherDate: string) => moment(anotherDate).format() === moment(date).format());
    }

    return false;
  }

  onPrevWeek() {
    this.loadWeek.emit(DateUtils.addWeeks(this.firstDay.date, -1));
  }

  onNextWeek() {
    this.loadWeek.emit(DateUtils.addWeeks(this.firstDay.date, 1));
  }

  onShowDayShedule(date: Date) {
    this.modalService.create({
      nzClosable: true,
      nzMaskClosable: false,
      nzContent: DaySheduleComponent,
      nzComponentParams: { date, mondayDate: this.mondayDate, shedule: this.shedule },
      nzFooter: null,
      nzWidth: 768,
      nzZIndex: 1210,
    });
  }

  onSelectRecord(sheduleRecord: SheduleRecord) {
    const { appointment, status, defaultDoctor } = sheduleRecord;
    let selectedDoctor = null;
    if (appointment != null) {
      this.selectAppointment.emit(sheduleRecord.appointment);
      if (appointment.doctor) {
        selectedDoctor = appointment.doctor;
      }
    } else if (status === 'empty') {
      this.selectDate.emit(sheduleRecord.dateTimeStart);
      this.selectDefaultDoctor.emit(defaultDoctor);
    }
    this.selectDoctor.emit(selectedDoctor);
  }
}
