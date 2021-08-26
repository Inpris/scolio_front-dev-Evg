import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocksmithOperation } from '@common/models/locksmith-operation';
import { Room } from '@common/models/room';
import { DateUtils } from '@common/utils/date';

@Component({
  selector: 'sl-locksmith-detail',
  templateUrl: './locksmith-detail.component.html',
  styleUrls: ['./locksmith-detail.component.less'],
})
export class LocksmithDetailComponent implements OnInit {

  @Input()
  productId: string;

  @Input()
  visitId: string;

  @Input()
  set data(data: LocksmithOperation[]) {
    this._data = data;
    this.updateOperationDuration(this._data);
  }

  get data() {
    return this._data;
  }

  get isData() {
    return this.data && this.data.length > 0;
  }

  @Input()
  isLoading: boolean;

  @Input()
  room: Room;

  @Output()
  save = new EventEmitter();

  operationDuration;
  private _data: LocksmithOperation[];

  constructor() {
  }

  ngOnInit() {
    this.updateOperationDuration(this.data);
  }

  updateOperationDuration(data: LocksmithOperation[]) {
    this.operationDuration = (data) ?
      DateUtils.getDuration(0, data.reduce((sum: number, element: LocksmithOperation) => {
        const start = element.start && DateUtils.normalizeSeconds(element.start);
        const end = element.end && DateUtils.normalizeSeconds(element.end);
        return sum + (end ? (end.getTime() - start.getTime()) : 0);
      }, 0))
      : null;
  }

  onSave(data) {
    this.data = data;
    this.save.emit(data);
  }
}
