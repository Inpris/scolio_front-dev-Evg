import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '@common/utils/form';
import { NzTimePickerComponent } from 'ng-zorro-antd';
import { startDateCustomValid, endDateCustomValid } from '@common/validators/start-end-time-valid';
import { UsersService } from '@common/services/users';

@Component({
  selector: 'sl-edit-row',
  templateUrl: './edit-row.component.html',
  styleUrls: ['./edit-row.component.less'],
})
export class EditRowComponent implements OnInit {
  @Input() data;
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();

  @ViewChild('endTimePicker') endTimePicker: NzTimePickerComponent;
  @ViewChild('startTimePicker') startTimePicker: NzTimePickerComponent;

  public users = [];
  public form: FormGroup;

  constructor(
    public usersService: UsersService,
    private fb: FormBuilder,
  ) {
    this.form = fb.group({
      executor: [null, Validators.required],
      note: [null],
      start: [null, [Validators.required, startDateCustomValid]],
      end: [null, [endDateCustomValid]],
    });
    usersService
      .getList({ pageSize: 500 })
      .subscribe(response => this.users = response.data.map(user => ({ id: user.id, name: user.abbreviatedName })));
  }

  ngOnInit() {
    this.form.patchValue({ ...this.data });
  }

  onSubmit() {
    FormUtils.markAsDirty(this.form);
    if (this.form.valid) {
      this.save.emit({ ...this.form.value });
    }
  }

  public start() {
    const start = new Date();
    start.setSeconds(0, 0);
    this.form.patchValue({
      start,
    });
    this.form.controls.start.markAsDirty();
  }

  public finish() {
    const end = new Date();
    end.setSeconds(0, 0);
    this.form.patchValue({
      end,
    });
    this.form.controls.end.markAsDirty();
  }

  public disabledStartDate = (startValue: Date): boolean => {
    return this._disableDate(startValue, 'start');
  }

  public disabledEndDate = (endValue: Date): boolean => {
    return this._disableDate(endValue, 'end');
  }

  private _disableDate = (value: Date, type: 'start' | 'end'): boolean => {
    const [startValue, endValue] = this._getStartEndDates(value, type);
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.getTime() <= startValue.getTime();
  }

  private _getStartEndDates(value, type): Date[] {
    const startValue = (type === 'start') ? value : this.form.get('start').value;
    const endValue = (type === 'end') ? value :  this.form.get('end').value;
    return [startValue, endValue];
  }

  public disabledStartHours = (): number[] => {
    return this._disableHours(this.form.get('start').value, 'start');
  }

  public disabledEndHours = (): number[] => {
    return this._disableHours(this.form.get('end').value, 'end');
  }

  private _disableHours = (value: Date, type: 'start' | 'end'): number[] => {
    if (!value) {
      return Array(24).fill(0).map((item, index) => index);
    }
    const [startDate, endDate] = this._getStartEndDates(value, type);

    if (!endDate || (this._getDifferenceInDays(startDate, endDate) > 0)) {
      return [];
    }

    const limitHour = this._getLimitHour(startDate, endDate) + 1;
    return (type === 'start') ?
      Array(24 - limitHour).fill(0).map((item, index) => limitHour + index) :
      Array(limitHour - 1).fill(0).map((item, index) => index);
  }

  public disableStartMinutes = (selectedHour: number): number[] => {
    return this._disableMinutes(selectedHour, this.form.get('start').value, 'start');
  }

  public disableEndMinutes = (selectedHour: number): number[] => {
    return this._disableMinutes(selectedHour, this.form.get('end').value, 'end');
  }

  public _disableMinutes = (selectedHour: number, value: Date, type: 'start' | 'end'): number[] => {
    const [startDate, endDate] = this._getStartEndDates(value, type);

    if (!value) {
      return Array(60).fill(0).map((item, index) => index);
    }

    if (!startDate || !endDate ||
      this._getDifferenceInDays(startDate, endDate) > 0 ||
      startDate.getHours() !== endDate.getHours()) {
      return [];
    }

    let limitMinute = startDate.getMinutes();
    limitMinute = (limitMinute < 60) ? limitMinute : 60;
    return (type === 'start') ?
      Array(60 - limitMinute).fill(0).map((item, index) => limitMinute + index) :
      Array(limitMinute).fill(0).map((item, index) => index);
  }

  public checkStartTime(newDate: Date) {
    this.startTimePicker.writeValue(newDate);
  }

  public checkEndTime(newDate: Date) {
    this.endTimePicker.writeValue(newDate);
  }

  private _getDifferenceInDays(startDate: Date, endDate: Date) {
    return new Date(endDate).setHours(0, 0, 0, 0) - new Date(startDate).setHours(0, 0, 0, 0);
  }

  private _getLimitHour(startDate: Date, endDate: Date) {
    const incrementStartDate = new Date(startDate.getTime() + 1);
    const incrementStartMinutes = incrementStartDate.getMinutes();
    let limitHour = incrementStartDate.getHours();
    const endDateMinutes = endDate.getMinutes();

    if (endDateMinutes < incrementStartMinutes) {
      limitHour = (limitHour < 23) ? limitHour + 1 : limitHour;
    }

    return limitHour;
  }
}
