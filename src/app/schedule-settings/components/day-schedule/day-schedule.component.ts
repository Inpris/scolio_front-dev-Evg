import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as moment from 'moment';

import {WorkedTimeRange} from '@common/models/worked-time';
import {ECellStatus, IDayScheduleCell} from '@modules/schedule-settings/schedule-settings.interface';
import {DAY_NAMES} from '@modules/schedule-settings/schedule-settings.const';
import {DateUtils} from '@common/utils/date';
import {Doctor} from '@common/models/doctor';
import {Room} from '@common/models/room';

@Component({
  selector: 'sl-day-schedule',
  templateUrl: './day-schedule.component.html',
  styleUrls: ['./day-schedule.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayScheduleComponent implements OnChanges {
  @Input() public set day(value: number) {
    this._day = value;
    const correctDay: number = value === 0 ? 7 : value;

    if (this._currentDate) {
      return;
    }
    // @ts-ignore
    this._currentDate = moment().startOf('isoweek').add(correctDay - 1, 'days');
  }
  public get day(): number {
    return this._day;
  }
  @Input() public set date(value: string) {
    this._byDay = true;
    // @ts-ignore
    this._currentDate = moment(value);
  }
  @Input() public interval: number;
  @Input() public startTime: number;
  @Input() public endTime: number;
  @Input() public time: WorkedTimeRange[];
  @Input() public selfDisabledTime: WorkedTimeRange[];
  @Input() public takenTime: WorkedTimeRange[];
  @Input() public selfTakenTime: WorkedTimeRange[];
  @Input() public doctorId: string;
  @Input() public set doctors(value: Doctor[]) {
    this.doctorsMap = {};

    value.forEach((doctor: Doctor) => this.doctorsMap[doctor.id] = doctor);
  }
  @Input() public set rooms(value: Room[]) {
    this.roomsMap = {};

    value.forEach((room: Room) => this.roomsMap[room.id] = room);
  }
  @Input() public set allRooms(value: Room[]) {
    this.allRoomsMap = {};

    value.forEach((room: Room) => this.allRoomsMap[room.id] = room);
  }

  @Output() public changedPeriods: EventEmitter<WorkedTimeRange[]> = new EventEmitter<WorkedTimeRange[]>();

  public dayNames = DAY_NAMES;
  public cells$: BehaviorSubject<IDayScheduleCell[]> = new BehaviorSubject([]);
  public cellStatuses = ECellStatus;
  public doctorsMap: Record<string, Doctor> = {};
  public roomsMap: Record<string, Room> = {};
  public allRoomsMap: Record<string, Room> = {};

  private _day: number = 0;
  private _currentDate: moment.Moment;
  private _byDay: boolean;
  private _changedDayStatus: boolean = true;

  constructor() {}

  public ngOnChanges(changes: SimpleChanges) {
    const doctorInputs: string[] = ['interval', 'startTime', 'endTime', 'time'];
    const roomInputs: string[] = ['selfDisabledTime', 'takenTime', 'selfTakenTime'];
    const validDoctorInputs = doctorInputs.every((input: string) => (changes[input] && changes[input].currentValue) || this[input]);
    const validRoomInputs = roomInputs.every((input: string) => (changes[input] && changes[input].currentValue) || this[input]);

    if (!validDoctorInputs) {
      return;
    }

    if (this.doctorId && !validRoomInputs) {
      return;
    }

    this._setCells();
  }

  public takenTooltip(cell: IDayScheduleCell): string {
    return `Время занято доктором ${this.doctorsMap[cell.doctorId] ? this.doctorsMap[cell.doctorId].name : '-'}`;
  }

  public selfTakenTooltip(cell: IDayScheduleCell): string {
    const room = this.allRoomsMap[cell.roomId];
    const roomName = room ? room.name : '-';
    const branchName = room ? room.branchName : '-';

    return `В данное время доктор работает в филиале ${branchName} в кабинете ${roomName}`;
  }

  public cellClasses(cell: IDayScheduleCell): string {
    let status: ECellStatus | string = cell.status;

    switch (true) {
      case this.doctorId && ECellStatus.ENABLED === (status as ECellStatus):
        status = `room_${status}`;
        break;
      case this.doctorId && !this._byDay && ECellStatus.DISABLED === (status as ECellStatus):
        status = `room_${status}`;
        break;
      case this.doctorId && this._byDay && (status as ECellStatus) === ECellStatus.DISABLED:
        status = `by_day_${status}`;
        break;
      default:
        break;
    }

    return `day-schedule__cell day-schedule__cell_${status}`;
  }

  public changeDayStatus(): void {
    this.cells$.value.forEach((cell: IDayScheduleCell) => {
      const alwaysWrong: boolean = [ECellStatus.TAKEN, ECellStatus.SELF_DISABLED].includes(cell.status);
      const roomWrong: boolean = this.doctorId && !this._byDay && cell.status === ECellStatus.DISABLED;

      if (alwaysWrong || roomWrong) {
        return;
      }

      switch (true) {
        case this.doctorId && !this._byDay:
          cell.status = this._changedDayStatus ? ECellStatus.SELF_TAKEN : ECellStatus.ENABLED;
          break;
        case this.doctorId && this._byDay && !this._changedDayStatus:
          cell.status = !!this._isDisabledCell(cell.time) ? ECellStatus.DISABLED : ECellStatus.ENABLED;
          break;
        case this.doctorId && this._byDay && this._changedDayStatus:
          cell.status = ECellStatus.SELF_TAKEN;
          break;
        default:
          cell.status = this._changedDayStatus ? ECellStatus.DISABLED : ECellStatus.ENABLED;
          break;
      }
    });

    this._changedDayStatus = !this._changedDayStatus;

    this.changedPeriods.emit(this._getSchedulePeriods());
  }

  public changeStatus(cell: IDayScheduleCell): void {
    this._changeStatusByCell(cell);

    this.changedPeriods.emit(this._getSchedulePeriods());
  }

  private _changeStatusByCell(cell: IDayScheduleCell): void {
    const alwaysWrong: boolean = [ECellStatus.TAKEN, ECellStatus.SELF_DISABLED].includes(cell.status);
    const roomWrong: boolean = this.doctorId && !this._byDay && cell.status === ECellStatus.DISABLED;

    if (alwaysWrong || roomWrong) {
      return;
    }

    switch (true) {
      case this.doctorId && !this._byDay:
        cell.status = cell.status === ECellStatus.SELF_TAKEN ? ECellStatus.ENABLED : ECellStatus.SELF_TAKEN;
        break;
      case this.doctorId && this._byDay && cell.status === ECellStatus.SELF_TAKEN:
        cell.status = !!this._isDisabledCell(cell.time) ? ECellStatus.DISABLED : ECellStatus.ENABLED;
        break;
      case this.doctorId && this._byDay && cell.status !== ECellStatus.SELF_TAKEN:
        cell.status = ECellStatus.SELF_TAKEN;
        break;
      default:
        cell.status = cell.status === ECellStatus.ENABLED ? ECellStatus.DISABLED : ECellStatus.ENABLED;
        break;
    }
  }

  private _getSchedulePeriods(): WorkedTimeRange[] {
    const schedulePeriods: WorkedTimeRange[] = [];
    let schedulePeriod: WorkedTimeRange;
    const startStatus: ECellStatus[] = this.doctorId ? [ECellStatus.SELF_TAKEN] : [ECellStatus.ENABLED];
    const endStatus: ECellStatus[] = this.doctorId ?
      [ECellStatus.ENABLED, ECellStatus.DISABLED, ECellStatus.SELF_DISABLED, ECellStatus.TAKEN] :
      [ECellStatus.DISABLED];

    this.cells$.value.forEach((cell: IDayScheduleCell) => {
      if (startStatus.includes(cell.status) && !schedulePeriod) {
        schedulePeriod = {
          doctorId: this.doctorId || null,
          dateTimeStart: cell.time.toDate(),
          dateTimeEnd: DateUtils.addMinutes(cell.time, this.interval),
          dayOfWeek: this.day,
        };
      }

      if (endStatus.includes(cell.status) && schedulePeriod) {
        schedulePeriod.dateTimeEnd = cell.time.toDate();
        schedulePeriods.push(schedulePeriod);
        schedulePeriod = null;
      }
    });

    if (schedulePeriod) {
      schedulePeriod.dateTimeEnd = this._currentDate.clone().hour(this.endTime).toDate();
      schedulePeriods.push(schedulePeriod);
      schedulePeriod = null;
    }

    return schedulePeriods;
  }

  private _setCells(): void {
    const cells = this._getItems().map((item, index: number) => {
      const time = this._currentDate.clone().hour(this.startTime).set('m', this.interval * index);
      return this._determineCellStatus(time);
    });

    this.cells$.next(cells);
  }

  private _determineCellStatus(time: moment.Moment): IDayScheduleCell {
    const cell: IDayScheduleCell = {
      time,
      records: [],
    };

    switch (true) {
      case !!(this.doctorId && this._isTakenCell(time, cell)):
        cell.status = ECellStatus.TAKEN;
        break;
      case !!(this.doctorId && this._isSelfTakenCell(time)):
        cell.status = ECellStatus.SELF_TAKEN;
        break;
      case !!(this.doctorId && this._isSelfDisabledTime(time, cell)):
        cell.status = ECellStatus.SELF_DISABLED;
        break;
      case !!(this._isDisabledCell(time)):
        cell.status = ECellStatus.DISABLED;
        break;
      default:
        cell.status = ECellStatus.ENABLED;
    }

    return cell;
  }

  private _isDisabledCell(time: moment.Moment): boolean {
    if (!this.time.length) {
      return false;
    }

    return !this.time.find((timeItem: WorkedTimeRange) => {
      return time.isBefore(moment(timeItem.dateTimeEnd)) && time.isSameOrAfter(moment(timeItem.dateTimeStart));
    });
  }

  private _isTakenCell(time: moment.Moment, cell: IDayScheduleCell): WorkedTimeRange {
    if (!this.takenTime.length) {
      return null;
    }

    const items: WorkedTimeRange[] = this.takenTime.filter((timeItem: WorkedTimeRange) => {
      return time.isBefore(moment(timeItem.dateTimeEnd)) && time.isSameOrAfter(moment(timeItem.dateTimeStart));
    }).filter((item: WorkedTimeRange) => this._validTaken(item));

    if (!items.length) {
      return null;
    }

    cell.doctorId = items[0].doctorId;

    return items[0];
  }

  private _isSelfTakenCell(time: moment.Moment): WorkedTimeRange {
    if (!this.selfTakenTime.length) {
      return null;
    }

    return this.selfTakenTime.find((timeItem: WorkedTimeRange) => {
      return time.isBefore(moment(timeItem.dateTimeEnd)) && time.isSameOrAfter(moment(timeItem.dateTimeStart));
    });
  }

  private _isSelfDisabledTime(time: moment.Moment, cell: IDayScheduleCell): WorkedTimeRange {
    if (!this.selfDisabledTime.length) {
      return null;
    }

    const item: WorkedTimeRange = this.selfDisabledTime.find((timeItem: WorkedTimeRange) => {
      return time.isBefore(moment(timeItem.dateTimeEnd)) && time.isSameOrAfter(moment(timeItem.dateTimeStart));
    });

    if (item) {
      cell.roomId = item.roomId;
    }

    return item;
  }

  private _getItems(): IDayScheduleCell[] {
    const hours = Math.floor((this.endTime - this.startTime) * 60 / this.interval);
    const items = new Array(hours);

    items.fill({
      status: ECellStatus.ENABLED,
      time: null,
      records: [],
    });

    return items;
  }

  private _validTaken(item: WorkedTimeRange): boolean {
    return item.doctorId && !!this.doctorsMap[item.doctorId];
  }
}
