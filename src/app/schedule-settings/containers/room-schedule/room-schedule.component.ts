import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { filter, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { Doctor, DoctorsService } from '@common/services/doctors';
import { BranchesService, IBranch } from '@common/services/dictionaries/branches.service';
import { ToastsService } from '@common/services/toasts.service';
import { AuthService } from '@common/services/auth';
import { RoomsService } from '@common/services/rooms';
import { PaginationChunk } from '@common/services/paginable';
import { DateUtils } from '@common/utils/date';
import { WorkedTime, WorkedTimeRange, WorkedTimeUpdate } from '@common/models/worked-time';
import { DAYS_ORDER, DEFAULT_END_TIME, DEFAULT_HOURS, DEFAULT_INTERVAL, DEFAULT_START_TIME, TIMES_BY_DAY } from '@modules/schedule-settings/schedule-settings.const';
import { Room } from '@common/models/room';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'sl-room-schedule',
  templateUrl: './room-schedule.component.html',
  styleUrls: ['./room-schedule.component.less'],
  providers: [BranchesService],
})
export class RoomScheduleComponent implements OnInit {
  public branches: { value: string; label: string; }[] = [];
  public allBranches: IBranch[] = [];
  public rooms: Room[] = [];
  public allRooms: Room[] = [];
  public doctors: Doctor[] = [];
  public selectedBranch: any = null;
  public selectedRoom: Room = null;
  public selectedDoctor: Doctor = null;
  public mondayDate: Date = DateUtils.getMondayDate(new Date());
  public interval: number = DEFAULT_INTERVAL;
  public hours: number[] = DEFAULT_HOURS;
  public startTime: number = DEFAULT_START_TIME;
  public endTime: number = DEFAULT_END_TIME;
  public doctorWorkPlan = { ...TIMES_BY_DAY };
  public selfDisabledTime = { ...TIMES_BY_DAY };
  public takenTime = { ...TIMES_BY_DAY };
  public selfTakenTime = { ...TIMES_BY_DAY };
  public daysOrder = DAYS_ORDER;
  public selfTakenTimeOriginal;
  public isChanged = false;
  public loading: boolean = false;
  public descriptionMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _selectedRoom: Room = null;
  private _selectedDoctor: Doctor = null;

  constructor(
    private _toastService: ToastsService,
    private _modalService: NzModalService,
    private _authService: AuthService,
    private _branchesService: BranchesService,
    private _doctorsService: DoctorsService,
    private _roomsService: RoomsService,
    private _messageService: ToastsService,
  ) {}

  public ngOnInit() {
    this._loadBranches();
  }

  public hideDescription(): void {
    this.descriptionMode$.next(!this.descriptionMode$.value);
  }

  public selectBranch(branchId: string): void {
    this._loadDoctors(branchId);
    this._loadRooms(branchId);
  }

  public selectRoom(): void {
    this._preloadScheduleCheck();
  }

  public selectDoctor(): void {
    this._preloadScheduleCheck();
  }

  public changedPeriods(periods: WorkedTimeRange[], dayOfWeek: number): void {
    this.selfTakenTime[dayOfWeek].length = 0;
    Object.assign(this.selfTakenTime[dayOfWeek], [...periods]);
    this.isChanged = true;
  }

  public clearSchedule() {
    this._modalService.warning({
      nzTitle: 'Все изменения будут удалены, продолжить?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        Object.keys(this.selfTakenTimeOriginal).forEach((key: string) => {
          this.selfTakenTime[key] = [...this.selfTakenTimeOriginal[key]];
        });

        this.isChanged = false;
      },
      nzOnCancel: () => {},
    });
  }

  public saveSchedule() {
    this._roomsService.updateWorkedTime(this._mapToUpdate(this.selfTakenTime), this.selectedRoom.id, this.selectedDoctor.id)
      .pipe(
        tap((result: number) => {
          const message = result === 1 ?
            'Данные не были перенесены в таблицу графика докторов на день, так как в один из периодов есть запись на прием.' :
            'Данные были успешно перенесены в таблицу графика докторов на день.';

          result === 1 ? this._messageService.error(message, { nzDuration: 3000 }) : this._messageService.info(message, { nzDuration: 3000 });
        }),
      )
      .subscribe(() => {
        Object.keys(this.selfTakenTime).forEach((key: string) => {
          this.selfTakenTimeOriginal[key] = { ...this.selfTakenTime[key] };
        });

        this.isChanged = false;
        this._toastService.success('Расписание сохранено');
      });
  }

  private _mapToUpdate(timesByDay: Record<any, WorkedTimeRange[]>): WorkedTimeUpdate {
    const timeRanges = [].concat.apply([], Object.values(timesByDay));
    const weeklyWorkedSchedule = timeRanges
      .map((value: WorkedTimeRange) => ({
        dateTimeStart: value.dateTimeStart && DateUtils.toISODateTimeString(value.dateTimeStart),
        dateTimeEnd: value.dateTimeEnd && DateUtils.toISODateTimeString(value.dateTimeEnd),
        dayOfWeek: value.dayOfWeek,
        doctorId: value.doctorId,
      }));

    return { weeklyWorkedSchedule };
  }

  private _loadBranches(): void {
    this._branchesService.getList(null, null)
      .subscribe((list: PaginationChunk<IBranch>) => {
        this.branches = list.data
          .filter(filterBranch => this._authService.user.branchIds.includes(filterBranch.id))
          .map((branch: IBranch) => {
            return {
              label: branch.name,
              value: branch.id,
            };
          });

        this.allBranches = list.data;

        this._loadAllRooms();
      });
  }

  private _loadAllRooms(): void {
    this._roomsService.getList()
      .subscribe((rooms: Room[]) => {
        this.allRooms = rooms
          .filter((room: Room) => {
            return this.allBranches.some((branch: IBranch) => room.branchId === branch.id);
          })
          .map((room: Room) => {
            const branchName = this.allBranches.find((branch: IBranch) => room.branchId === branch.id).name;

            return {
              ...room,
              branchName,
            };
          });
      });
  }

  private _loadDoctors(branchId: string): void {
    this._doctorsService.getDoctors(branchId)
      .subscribe((doctors: Doctor[]) => {
        this.doctors = doctors;

        if (!this.doctors || !this.doctors[0]) {
          this._noHaveError('selectedDoctor', 'докторов');
          return;
        }

        this.selectedDoctor = doctors[0];
        this.selectDoctor();
      });
  }

  private _loadRooms(branchId: string): void {
    this._roomsService.getList(null, branchId)
      .subscribe((rooms: Room[]) => {
        this.rooms = rooms;

        if (!rooms || !rooms[0]) {
          this._noHaveError('selectedRoom', 'кабинетов');
          return;
        }

        this.selectedRoom = rooms[0];
        this.selectRoom();
      });
  }

  private _preloadScheduleCheck(): void {
    if (!this.selectedRoom || !this.selectedDoctor) {
      return;
    }

    if (!this.isChanged && this.selectedRoom && this.selectedDoctor) {
      this._loadSchedule();

      return;
    }

    this._modalService.warning({
      nzTitle: 'Все несохраненные изменения будут удалены, продолжить?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this._loadSchedule();
      },
      nzOnCancel: () => {
        this.selectedRoom = this._selectedRoom;
        this.selectedDoctor = this._selectedDoctor;
      },
    });
  }

  private _loadSchedule(): void {
    this.loading = true;

    this._selectedRoom = this.selectedRoom;
    this._selectedDoctor = this.selectedDoctor;

    forkJoin([
      this._doctorsService.workedTime(this.selectedDoctor.id, this.mondayDate, this.selectedDoctor), // Рабочий график доктора
      this._roomsService.workedTime(this.selectedRoom.id, this.mondayDate, this.selectedDoctor.id), // Интервалы выбранного доктора в других кабинетах
      this._roomsService.workedTime(this.selectedRoom.id, this.mondayDate), // Интервалы докторов (включая выбранного) в кабинете
    ])
      .subscribe(([doctorWorkPlan, selfDisabledTime, takenTime]: WorkedTime[]) => {
        this.selfTakenTimeOriginal = { ...TIMES_BY_DAY };

        const times: string[] = ['doctorWorkPlan', 'selfDisabledTime', 'takenTime', 'selfTakenTime', 'selfTakenTimeOriginal'];

        times.forEach((time: string) => Object.keys(this[time]).forEach((key: string) => this[time][key] = []));

        doctorWorkPlan.times.forEach((time: WorkedTimeRange) => this.doctorWorkPlan[time.dayOfWeek].push(time));
        selfDisabledTime.times.forEach((time: WorkedTimeRange) => this.selfDisabledTime[time.dayOfWeek].push(time));

        const allTakenByDoctorsTime = takenTime.times.filter((time: WorkedTimeRange) => time.doctorId);

        allTakenByDoctorsTime
          .filter((time: WorkedTimeRange) => time.doctorId !== this.selectedDoctor.id)
          .forEach((time: WorkedTimeRange) => this.takenTime[time.dayOfWeek].push(time));

        allTakenByDoctorsTime
          .filter((time: WorkedTimeRange) => time.doctorId === this.selectedDoctor.id)
          .forEach((time: WorkedTimeRange) => {
            this.selfTakenTime[time.dayOfWeek].push(time);
            this.selfTakenTimeOriginal[time.dayOfWeek].push(time);
          });

        this.loading = false;
      });
  }

  private _noHaveError(property: 'selectedDoctor' | 'selectedRoom', target: string): void {
    (this[property] as Doctor | Room) = null;

    this._toastService.error(`Ошибка при загрузке ${target}`);
  }
}
