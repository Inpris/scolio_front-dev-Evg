import { Component, OnInit } from '@angular/core';
import {PageParams} from "@common/interfaces/Page-params";
import {Doctor} from "@common/models/doctor";
import {Room, RoomsService} from "@common/services/rooms";
import {DoctorsService} from "@common/services/doctors";
import {ToastsService} from "@common/services/toasts.service";
import {WorkedTime, WorkedTimeRange} from "@common/models/worked-time";
import {map} from "rxjs/operators";
import {BranchesService, IBranch} from "@common/services/dictionaries/branches.service";
import {PaginationChunk} from "@common/services/paginable";
import {hasScrollbar} from "@common/utils/ui";

@Component({
  selector: 'sl-doctors-work-time-table',
  templateUrl: './doctors-work-time-table.component.html',
  styleUrls: ['./doctors-work-time-table.component.less'],
  providers: [BranchesService],
})
export class DoctorsWorkTimeTableComponent implements OnInit {
  public branches: Map<string, IBranch> = null;
  public rooms: Map<string, Room> = null;
  public selectedDoctor: Doctor = null;
  public doctors: Doctor[] = [];
  public selectedRange: Date[] = [];
  public scrollBarPadding = hasScrollbar();
  public sortMap = {
    branchName: null,
    roomName: null,
    dateTimeStart: null,
  };

  public sortData = {
    sortBy: null,
    sortType: null,
  };

  public pageParams: PageParams = {
    page: 1,
    pageSize: 20,
    pageCount: 0,
    totalCount: null,
  };

  public fullData: WorkedTimeRange[] = [];
  public data: WorkedTimeRange[] = [];
  public pending = false;

  constructor(
    private _roomsService: RoomsService,
    private _doctorsService: DoctorsService,
    private _toastService: ToastsService,
    private _branchesService: BranchesService,
  ) { }

  public ngOnInit() {
    this._loadDoctors();
    this._loadBranches();
  }

  public sort(sortName, value) {
    this.clearSort();
    this.resetPageParams();

    this.fullData = [...this.fullData].sort((a: WorkedTimeRange, b: WorkedTimeRange) => {
      if (value === 'descend') {
        return a[sortName] < b[sortName] ? -1 : 1;
      }

      return a[sortName] > b[sortName] ? -1 : 1;
    });

    this.data = this.fullData.slice(0, this.pageParams.pageSize);
  }

  public clearSort() {
    Object.keys(this.sortMap).map(key => this.sortMap[key] = null);
  }

  public resetPageParams() {
    this.data = [];

    this.pageParams = {
      page: 1,
      pageSize: 20,
      pageCount: this.pageParams.pageCount = Math.round(this.fullData.length / this.pageParams.pageSize),
      totalCount: null,
    };
  }

  public getData() {
    this.pageParams.page = this.pageParams.page + 1;

    this.data = [
      ...this.data,
      ...this.fullData.slice((this.pageParams.page - 1) * this.pageParams.page, this.pageParams.page * this.pageParams.pageSize),
    ];
  }

  public loadSchedule(): void {
    if (!this.selectedDoctor || !this.selectedRange.length || !this.selectedRange[0] || !this.selectedRange[1]) {
      return;
    }

    // this.loading$.next(true);

    this._roomsService.doctorWorkedTime(
      this.selectedDoctor.id,
      this.selectedRange[0],
      this.selectedRange[1],
    )
      .pipe(
        map((doctorWorkTime: WorkedTime) => {
          const times: WorkedTimeRange[] = doctorWorkTime.times.map((time: WorkedTimeRange) => {
            return {
              ...time,
              branchName: this.rooms.get(time.roomId).branchName,
              roomName: this.rooms.get(time.roomId).name,
            };
          });

          return times;
        }),
      )
      .subscribe((times: WorkedTimeRange[]) => {
        this.fullData = times;
        this.data = times.slice(0, this.pageParams.pageSize);
        this.pageParams.pageCount = Math.round(times.length / this.pageParams.pageSize);
      });
  }

  private _loadDoctors(): void {
    this._doctorsService.getList({ pageSize: 999 })
      .subscribe((response: { data: Doctor[] }) => {
        this.doctors = response.data;

        if (!this.doctors || !this.doctors[0]) {
          this._noHaveError('selectedDoctor', 'докторов');
          return;
        }

        this.selectedDoctor = response.data[0];

        this.loadSchedule();
      });
  }

  private _loadBranches(): void {
    this._branchesService.getList(null, null)
      .subscribe((list: PaginationChunk<IBranch>) => {
        const branchesMaps = new Map<string, IBranch>();

        list.data.forEach((branch: IBranch) => branchesMaps.set(branch.id, branch));

        this.branches = branchesMaps;

        this._loadAllRooms();
      });
  }

  private _loadAllRooms(): void {
    this._roomsService.getList()
      .subscribe((rooms: Room[]) => {
        const roomsMap = new Map<string, Room>();

        rooms.forEach((room: Room) => {
          const branchName = this.branches.get(room.branchId).name;

          roomsMap.set(room.id, {
            ...room,
            branchName,
          });
        });

        this.rooms = roomsMap;
      });
  }

  private _noHaveError(property: 'selectedDoctor' | 'selectedRoom', target: string): void {
    (this[property] as Doctor | Room) = null;

    this._toastService.error(`Ошибка при загрузке ${target}`);
  }
}
