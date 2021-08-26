import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { BranchesService, IBranch } from '@common/services/dictionaries/branches.service';
import { Room } from '@common/models/room';
import { RoomsService } from '@common/services/rooms';
import { RoomComponent } from '@modules/dictionary/room/room.component';
import { Observable } from 'rxjs/Observable';
import { PaginationChunk } from '@common/services/paginable';

@Component({
  selector: 'sl-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.less'],
  providers: [
    BranchesService,
  ],
})
export class BranchesComponent implements OnInit, OnDestroy {
  public form = this._fb.group({
    id: [''],
    name: ['', Validators.required],
    isMain: [false],
  });
  public branchControl: FormControl = this._fb.control(null);
  public branches: IBranch[] = [];
  public selectedBranch: IBranch;
  public rooms: Room[] = [];
  public destroyed$: Subject<boolean> = new Subject();
  public pendingRooms$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public get disabledSave(): boolean {
    if (this.form.invalid) {
      return true;
    }

    const { name, isMain } = this.form.value as IBranch;

    if (this.branchControl.value) {
      return this.selectedBranch.name === name && this.selectedBranch.isMain === isMain;
    }

    return false;
  }

  constructor(
    private _fb: FormBuilder,
    private _branchesService: BranchesService,
    private _roomsService: RoomsService,
    private _modalService: NzModalService,
  ) {}

  public ngOnInit() {
    this._loadBranches().subscribe(response => this.branches = response.data);
    this._addBranchListener();
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public cancel() {
    this.branchControl.updateValueAndValidity();
  }

  public _addBranchListener(): void {
    this.branchControl.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((branch: IBranch) => {
        this.form.patchValue({
          id: '',
          name: '',
          isMain: false,
        });

        this.selectedBranch = null;

        if (branch) {
          this.form.patchValue(branch);
          this.selectedBranch = branch;

          this._loadRooms(branch.id);
        } else {
          this.rooms = [];
        }
      });
  }

  public save(): void {
    const value: IBranch = this.form.value;
    let id: string;

    if (!value.id) {
      delete value.id;
    }

    this._branchesService.save(this.form.value)
      .pipe(
        tap((newBranch: IBranch) => id = newBranch.id),
        switchMap(() => this._loadBranches()),
        map(response => response.data),
      )
      .subscribe((branches: IBranch[]) => {
        this.branches = branches;

        const branchFromList: IBranch = this.branches.find((branch: IBranch) => branch.id === id);

        if (branchFromList) {

          this.branchControl.patchValue(branchFromList);
        }
      });
  }

  public addRoom(): void {
    this._createRoomWindow({ branchId: this.form.value.id });
  }

  public editRoom(room: Room): void {
    this._createRoomWindow({ room, branchId: this.form.value.id });
  }

  private _loadBranches(): Observable<PaginationChunk<IBranch>> {
    return this._branchesService.getList({});
  }

  private _loadRooms(branchId: string): void {
    this.pendingRooms$.next(true);

    this._roomsService.getList(null, branchId)
      .pipe(finalize(() => this.pendingRooms$.next(false)))
      .subscribe((rooms: Room[]) => this.rooms = rooms);
  }

  private _createRoomWindow(params: { branchId: string, room?: Room }): void {
    const roomWindow = this._modalService.create({
      nzTitle: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzContent: RoomComponent,
      nzComponentParams: params,
      nzFooter: null,
      nzWidth: '800px',
      nzStyle: {
        top: '24px',
      },
    });

    roomWindow.afterClose
      .pipe(filter(Boolean))
      .subscribe(() => this._loadRooms(this.form.value.id));
  }
}
