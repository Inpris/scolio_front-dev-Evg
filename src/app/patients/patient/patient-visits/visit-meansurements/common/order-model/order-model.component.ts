import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { UsersService } from '@common/services/users';
import { DateUtils } from '@common/utils/date';

@Component({
  selector: 'sl-order-model',
  templateUrl: './order-model.component.html',
  styleUrls: ['./order-model.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(OrderModelComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderModelComponent extends FormValueAccessor implements OnInit {

  @Input()
  public users;
  @Output()
  deviceReadyEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  makingEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  fromPaginationChunk = response => response.data;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public usersService: UsersService,
  ) {
    super();
    this.form = fb.group({
      is3DModelReady: [false],
      execution3DModelStart: [null],
      execution3DModelEnd: [null],
      model3DExecutor1: [null],
      participationPercent1: [100],
      model3DExecutor2: [null],
      participationPercent2: [0],
    });

    this.form.get('participationPercent2')
      .valueChanges
      .subscribe((value) => {
        const percentage = 100 - value;
        if (this.form.get('participationPercent1').value !== percentage) {
          this.form.patchValue({ participationPercent1: percentage });
        }
      });
  }

  ngOnInit() {
    if (!this.users) {
      this.usersService.getList({ pageSize: 1000 })
        .map(this.fromPaginationChunk)
        .subscribe(users => this.users = users.map(user => ({ id: user.id, name: user.abbreviatedName })));
    }

    super.ngOnInit();
    this.markForCheck();

    this.form.valueChanges
      .subscribe((paramsChanges) => {
        if ((paramsChanges.execution3DModelStart !== null && paramsChanges.execution3DModelEnd !== null) &&
          (DateUtils.normalizeSeconds(paramsChanges.execution3DModelStart).getTime() > DateUtils.normalizeSeconds(paramsChanges.execution3DModelEnd).getTime())) {
          this.form.patchValue({
            execution3DModelEnd: paramsChanges.execution3DModelStart,
          });
        }
      });
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  start() {
    this.form.patchValue({
      execution3DModelStart: DateUtils.normalizeSeconds(new Date()),
    });
    this.form.controls.execution3DModelStart.markAsDirty();
    this.markForCheck();
    this.makingEvent.emit();
  }

  finish() {
    this.form.patchValue({
      execution3DModelEnd: DateUtils.normalizeSeconds(new Date()),
    });
    this.form.controls.execution3DModelEnd.markAsDirty();
    this.markForCheck();
  }

  statusSelectionDisabled(numExecutor: number = 1): boolean {
    return !this.form.get(`model3DExecutor${numExecutor}`).value;
  }

  modelReadyButtonDisabled() {
    const start = this.form.get('execution3DModelStart').value;
    const end = this.form.get('execution3DModelEnd').value;
    const executor = this.form.get('model3DExecutor1').value;
    return !start || !end || !executor;
  }

  modelReadyClick() {
    this.form.patchValue({
      is3DModelReady: true,
    });
    this.deviceReadyEvent.emit(true);
    this.form.markAsDirty();
  }
}
