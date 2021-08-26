import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { filter } from 'rxjs/operators';
import * as moment from 'moment';

import { Doctor, DoctorsService } from '@common/services/doctors';
import { BranchesService, IBranch } from '@common/services/dictionaries/branches.service';
import { ToastsService } from '@common/services/toasts.service';
import { AuthService } from '@common/services/auth';
import { PaginationChunk } from '@common/services/paginable';
import { DateUtils } from '@common/utils/date';
import { DoctorWorkedTimeUpdate, WorkedTime, WorkedTimeRange } from '@common/models/worked-time';
import { DAYS_ORDER, DEFAULT_END_TIME, DEFAULT_HOURS, DEFAULT_INTERVAL, DEFAULT_START_TIME, TIMES_BY_DAY } from '@modules/schedule-settings/schedule-settings.const';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'sl-doctor-schedule',
  templateUrl: './doctor-schedule.component.html',
  styleUrls: ['./doctor-schedule.component.less'],
  providers: [BranchesService],
})
export class DoctorScheduleComponent implements OnInit {
  public branches: { value: string; label: string; }[] = [];
  public doctors: Doctor[] = [];
  public selectedBranch: any = null;
  public selectedDoctor: Doctor = null;
  public mondayDate: Date = DateUtils.getMondayDate(new Date());
  public isChanged = false;
  public interval: number = DEFAULT_INTERVAL;
  public hours: number[] = DEFAULT_HOURS;
  public startTime: number = DEFAULT_START_TIME;
  public endTime: number = DEFAULT_END_TIME;
  public timesByDay = { ...TIMES_BY_DAY };
  public daysOrder = DAYS_ORDER;
  public timesByDayOriginal;
  public descriptionMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private _selectedDoctor: Doctor = null;

  constructor(
    private _toastService: ToastsService,
    private _modalService: NzModalService,
    private _authService: AuthService,
    private _branchesService: BranchesService,
    private _doctorsService: DoctorsService,
  ) {}

  public ngOnInit() {
    this._loadBranches();
  }

  public hideDescription(): void {
    this.descriptionMode$.next(!this.descriptionMode$.value);
  }

  public onBranchSelect(branchId: string): void {
    this._loadDoctors(branchId);
  }

  public selectDoctor(doctor: Doctor): void {
    if (!this.isChanged) {
      this._selectedDoctor = doctor;
      this._loadWorkedTime(doctor.id, this.mondayDate);

      return;
    }

    this._modalService.warning({
      nzTitle: 'Все несохраненные изменения будут удалены, продолжить?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this._selectedDoctor = doctor;
        this.isChanged = false;

        this._loadWorkedTime(doctor.id, this.mondayDate);
      },
      nzOnCancel: () => {
        this.selectedDoctor = this._selectedDoctor;
      },
    });
  }

  public changedPeriods(periods: WorkedTimeRange[], dayOfWeek: number): void {
    this.timesByDay[dayOfWeek].length = 0;
    Object.assign(this.timesByDay[dayOfWeek], [...periods]);
    this.isChanged = true;
  }

  public clearSchedule() {
    this._modalService.warning({
      nzTitle: 'Все изменения будут удалены, продолжить?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        Object.keys(this.timesByDayOriginal).forEach((key: string) => {
          this.timesByDay[key] = [...this.timesByDayOriginal[key]];
        });

        this.isChanged = false;
      },
      nzOnCancel: () => {},
    });
  }

  public saveSchedule() {
    this._doctorsService.updateWorkedTime(this._mapToUpdate(this.timesByDay), this.selectedDoctor.id)
      .pipe(filter(Boolean))
      .subscribe(() => {
        Object.keys(this.timesByDay).forEach((key: string) => {
          this.timesByDayOriginal[key] = { ...this.timesByDay[key] };
        });

        this.isChanged = false;
        this._toastService.success('Расписание сохранено');
      });
  }

  private _mapToUpdate(timesByDay: Record<any, WorkedTimeRange[]>): DoctorWorkedTimeUpdate {
    const timeRanges = [].concat.apply([], Object.values(timesByDay));
    const weeklyWorkedSchedule = timeRanges
      .map((value: WorkedTimeRange) => ({
        timeFrom: value.dateTimeStart && moment(value.dateTimeStart).format('HH:mm:ss'),
        timeTo: value.dateTimeEnd && moment(value.dateTimeEnd).format('HH:mm:ss'),
        dayOfWeek: value.dayOfWeek,
      }));

    return { weeklyWorkedSchedule };
  }

  private _loadWorkedTime(doctorId: string, date: Date): void {
    this._doctorsService.workedTime(doctorId, date, this.selectedDoctor)
      .subscribe((workedTime: WorkedTime) => {
        this.timesByDayOriginal = { ...TIMES_BY_DAY };
        Object.keys(this.timesByDay).forEach((key: string) => this.timesByDay[key] = []);
        Object.keys(this.timesByDayOriginal).forEach((key: string) => this.timesByDay[key] = []);

        workedTime.times.forEach((time: WorkedTimeRange) => this.timesByDay[time.dayOfWeek].push(time));
        workedTime.times.forEach((time: WorkedTimeRange) => this.timesByDayOriginal[time.dayOfWeek].push(time));
      });
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
      });
  }

  private _loadDoctors(branchId: string): void {
    this._doctorsService.getDoctors(branchId)
      .subscribe((doctors: Doctor[]) => {
        this.doctors = doctors;

        if (!this.doctors || !this.doctors[0]) {
          this._noHaveDoctorsError();
          return;
        }

        this.selectedDoctor =  doctors[0];
        this.selectDoctor(this.selectedDoctor);
      });
  }

  private _noHaveDoctorsError(): void {
    this.selectedDoctor = null;

    this._toastService.error('Ошибка при загрузке кабинетов');
  }
}
