import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { RoomsService } from '@common/services/rooms';
import { Room } from '@common/models/room';

@Component({
  selector: 'sl-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.less'],
})
export class RoomComponent {
  @Input() public set room(value: Room) {
    this._room = value;
    this.form.patchValue(value);
  }
  @Input() branchId: string;

  public form = this._fb.group({
    id: [''],
    name: ['', Validators.required],
  });

  public loading: boolean = false;

  private _room: Room;

  public get disabledButton(): boolean {
    if (!this._room) {
      return this.form.invalid;
    }

    return this.form.invalid || this._room.name === this.form.value.name;
  }

  constructor(
    private _fb: FormBuilder,
    private _modal: NzModalRef,
    private _roomsService: RoomsService,
  ) {}

  public close() {
    this._modal.destroy();
  }

  public save(): void {
    this.loading = true;

    this._determineService()
      .pipe(
        finalize(() => this.loading = false),
      )
      .subscribe((room: Room) => {
        this._modal.destroy(room);
      });
  }

  private _determineService(): Observable<Room> {
    const value: { id: string; name: string; } = this.form.value;

    if (value.id) {
      return this._roomsService.updateRoom({
        ...value,
        branchId: this.branchId,
      });
    }

    delete value.id;

    return this._roomsService.addRoom(value.name, this.branchId);
  }
}
