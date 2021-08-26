import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { LocksmithService } from '@common/services/locksmith.service';
import { LocksmithOperation } from '@common/models/locksmith-operation';
import { ToastsService } from '@common/services/toasts.service';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { DateUtils } from '@common/utils/date';

@Component({
  selector: 'sl-detail-row',
  templateUrl: './detail-row.component.html',
  styleUrls: ['./detail-row.component.less'],
  animations: [
    trigger('collapse', [
      state('opened', style({ height: '*' })),
      state('closed', style({ height: '0' })),
      transition('opened => closed', animate(250)),
      transition('closed => opened', animate(250)),
    ]),
    trigger('ngIfCollapse', [
      transition('* => void',
        [
          style({ height: '*' }),
          animate(250, style({ height: '0' })),
        ]),
      transition('void => *', [
        style({ height: '0' }),
        animate(250, style({ height: '*' })),
      ]),
    ]),
  ],
  providers: [ToastsService],
})
export class DetailRowComponent {

  @Input()
  productId: string;
  @Input()
  visitId: string;
  @Input()
  data: LocksmithOperation[];
  @Output()
  save = new EventEmitter();

  public isBusy = false;
  public addMode = false;

  constructor(private modalService: NzModalService,
              private locksmithService: LocksmithService,
              private toastService: ToastsService) {
  }

  getRange(date1, date2) {
    const from = DateUtils.normalizeSeconds(date1);
    const to = DateUtils.normalizeSeconds(date2);
    return DateUtils.getDuration(from, to);
  }

  delete(row: LocksmithOperation) {
    this.modalService.warning({
      nzTitle: 'Вы действительно хотите удалить данные?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.data.splice(this.data.indexOf(row), 1);
        this.onSave()
          .subscribe(
            () => {
              this.toastService.success('Запись успешно удалена');
            },
            error => this.onError(error));
      },
    });
  }

  onEdit(row, newData) {
    Object.assign(row, newData);
    this.onSave()
      .subscribe(
        () => {
          this.toastService.success('Запись успешно изменена');
          row.edit = false;
        },
        error => this.onError(error));
  }

  onAdd(newData) {
    this.onSave(newData).subscribe(
      () => {
        this.toastService.success('Запись успешно сохранена');
        this.addMode = false;
      },
      error => this.onError(error));
  }

  onSave(newData?) {
    this.isBusy = true;
    return this.locksmithService.update(
      this.productId, this.visitId,
      newData ? [...this.data, newData] : this.data,
    )
      .switchMap(
        (response) => {
          this.save.emit(response);
          this.isBusy = false;
          return Observable.of(response);
        });
  }

  private onError(response: HttpErrorResponse) {
    let message = 'Произошла ошибка';
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      message = errors[0];
    }
    this.toastService.error(message, { nzDuration: 3000 });
  }

  public editRow(row) {
    this.data.forEach(_row => _row.edit = _row === row);
    this.addMode = !row;
  }
}
