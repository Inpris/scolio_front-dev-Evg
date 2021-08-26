import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Shedule } from '@common/models/shedule';
import { DateUtils } from '@common/utils/date';
import { WorkedTimeRange } from '@common/models/worked-time';

type SheduleRecordStatus = 'unavailable' | 'empty';

interface ISheduleRecord {
  dateTimeStart: Date;
  available: boolean;
}

class SheduleRecord {
  dateTimeStart: Date;
  available: boolean;
  dateTimeStartMilliseconds: number;

  constructor(data: ISheduleRecord) {
    this.dateTimeStart = data.dateTimeStart;
    this.available = data.available;
    this.dateTimeStartMilliseconds = this.dateTimeStart.getTime();
  }

  get status(): SheduleRecordStatus {
    return this.available ? 'empty' : 'unavailable';
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
  selector: 'sl-room-week-shedule',
  templateUrl: './room-week-shedule.component.html',
  styleUrls: ['./room-week-shedule.component.less'],
})
export class RoomWeekSheduleComponent implements OnChanges {
  private sheduleDays = 7;
  private timeStart = '9:00';
  private timeEnd = '21:00';
  private timeStep = 30;
  private mondayDate: Date;

  public weekShedule;

  @Input()
  date: Date;

  @Input()
  shedule: Shedule;

  @Output()
  recordChanged = new EventEmitter();

  get firstDay() {
    return this.weekShedule[0];
  }

  get lastDay() {
    return this.weekShedule[this.weekShedule.length - 1];
  }

  get multiMonthWeek() {
    return this.firstDay.date.getMonth() !== this.lastDay.date.getMonth();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.shedule && changes.shedule.currentValue) {
      const { mondayDate, workedTime } = changes.shedule.currentValue;
      const sheduleTable: SheduleColumn[] = [];
      for (let i = 0; i < this.sheduleDays; i = i + 1) {
        let dateTime = DateUtils.addDays(DateUtils.parse(mondayDate, this.timeStart), i);
        const dateTimeEnd = DateUtils.addDays(DateUtils.parse(mondayDate, this.timeEnd), i);
        const records = [];
        while (dateTime < dateTimeEnd) {
          const record = new SheduleRecord({
            dateTimeStart: dateTime,
            available: workedTime.contain(dateTime),
          });
          records.push(record);
          dateTime = DateUtils.addMinutes(dateTime, this.timeStep);
        }
        sheduleTable.push(new SheduleColumn(DateUtils.addDays(mondayDate, i), records));
      }
      this.mondayDate = mondayDate;
      this.weekShedule = sheduleTable;
    }
  }

  isSelectedDate(date: Date) {
    if (this.date != null) {
      return DateUtils.equals(this.date, date);
    }
    return false;
  }

  onSelectRecord(record: ISheduleRecord) {
    this.recordChanged.emit(null);
    record.available = !record.available;
  }

  getShedule() {
    const periods: WorkedTimeRange[] = [];
    // tslint:disable-next-line
    for (let i = 0; i < this.weekShedule.length; i++) {
      const day = this.weekShedule[i];
      let period: WorkedTimeRange;
      for (const record of  day.records) {
        if (record.available && !period) {
          period = { dateTimeStart: record.dateTimeStart,
            dateTimeEnd: DateUtils.addMinutes(record.dateTimeStart, this.timeStep),
            doctorId: null,
            dayOfWeek: i === 6 ? 0 : i + 1,
          };
        } else if (record.available && period) {
          period.dateTimeEnd = DateUtils.addMinutes(record.dateTimeStart, this.timeStep);
        } else if (!record.available && period) {
          period.dateTimeEnd = record.dateTimeStart;
          periods.push(period);
          period = null;
        }
      }
      if (period) {
        periods.push(period);
      }
    }
    return periods;
  }
}
