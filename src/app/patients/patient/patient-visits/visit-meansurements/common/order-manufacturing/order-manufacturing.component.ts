import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { AuthService } from '@common/services/auth';
import { RolesUsers } from '@common/constants/roles-users.constant';
import { UsersService } from '@common/services/users';

export interface Schema {
  name: string;
  field: string;
  defects?: { label: string, formControl: string }[];
}
@Component({
  selector: 'sl-order-manufacturing',
  templateUrl: './order-manufacturing.component.html',
  styleUrls: ['./order-manufacturing.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(OrderManufacturingComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderManufacturingComponent extends FormValueAccessor implements OnInit {
  readonly ROLES_USERS = RolesUsers;

  @Output()
  deviceControlledEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  is3DModelReady = false;

  @Input()
  public schema: Schema[] = [];

  @Input()
  disableComment;

  @Input()
  public users;
  public hasDefects = false;
  public manufacturingStatus = ProductOperationStatus;
  public defectChoseEnabled = false;
  public currentOperationIndex = 0;

  fromPaginationChunk = response => response.data;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private authService: AuthService,
    public usersService: UsersService) {
    super();
  }

  ngOnInit() {
    const stages = this.schema.reduce((formGroup, stage) => {
      return Object.assign(formGroup, {
        [`${stage.field}Executor1`]: [null],
        [`${stage.field}Executor2`]: [null],
        [`${stage.field}Status`]: [ProductOperationStatus.WAITING],
        ...stage.defects && stage.defects.reduce((defects, defect) => Object.assign(
          defects, { [defect.formControl]: [null] }),
          {},
        ),
      });
    }, {});
    this.form = this.fb.group({
      ...stages,
      comment: [null],
      isControlled: [false],
      controlledBy: [null],
    });
    this.defectChoseEnabled = this.isDefectChoseEnabled();
    if (this.defectChoseEnabled) {
      this.form.valueChanges
        .take(2)
        .skip(1)
        .subscribe((value) => {
          this.hasDefects = this.getDefectStatus(value);
          if (this.hasDefects) {
            setTimeout(() => this.markForCheck());
          }
        });
    }
    if (!this.users) {
      if (this.usersService.users$.value) {
        this.users = this.usersService.users$.value.data.map(user => ({ id: user.id, name: user.abbreviatedName }));
      } else {
        this.usersService.getList({ pageSize: 1000 })
          .map(this.fromPaginationChunk)
          .subscribe(users => this.users = users.map(user => ({ id: user.id, name: user.abbreviatedName })));
      }
    }
    this.form.valueChanges
        .subscribe(value =>
          this.currentOperationIndex = this._getCurrentOperationIndex());
    super.ngOnInit();
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  deviceControlledClick() {
    this.form.patchValue({
      isControlled: true,
      controlledBy: { ...this.authService.user, name: this.authService.user.abbreviatedName },
    });
    this.form.controls.isControlled.markAsDirty();
    setTimeout(() => this.markForCheck());
    this.currentOperationIndex = -1;
    this.deviceControlledEvent.emit();
  }

  isDefectChoseEnabled() {
    return this.schema.reduce((enabled, stage) => enabled || Boolean(stage.defects), false);
  }

  isAllProductStatesDone() {
    const formData = this.form.value;
    return this.schema
      .reduce((result, stage) =>
        result && [ProductOperationStatus.DONE, 1].includes(formData[`${stage.field}Status`]), true,
      );
  }

  getDefectStatus(formData) {
    for (const stage of this.schema) {
      if (stage.defects) {
        for (const defect of stage.defects) {
          if (formData[defect.formControl]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  defectStatusChange(status) {
    if (!status) {
      const formData = this.form.value;
      for (const stage of this.schema) {
        let shouldFormUpdate = false;
        const data = {};
        if (stage.defects) {
          Object.assign(data, stage.defects.reduce((defects, defect) => {
            shouldFormUpdate = shouldFormUpdate || formData[defect.formControl];
            defects[defect.formControl] = false;
            return defects;
          }, {}));
        }
        if (shouldFormUpdate) {
          this.form.patchValue(data);
          this.form.markAsDirty();
        }
      }
    }
  }

  statusSelectionDisabled(i: number): boolean {
    const executor = this.selectExecutor(i);
    return !this.form.get(executor).value;
  }

  statusButtonDisabled(i: number): boolean {
    const executor = this.selectExecutor(i);
    return !this.form.get(executor).value || !this.is3DModelReady || this.rowDisabled(i);
  }

  selectExecutor(i: number, numExecutor: number = 1): string {
    const field = this.schema[i].field;
    return `${field}Executor${numExecutor}`;
  }

  public markAsPristine() {
    this.hasDefects = this.getDefectStatus(this.form.value);
    setTimeout(() => super.markAsPristine());
  }

  public isCurrentRow(rowIndex: number): boolean {
    return rowIndex === this.currentOperationIndex;
  }

  public rowDisabled(rowIndex: number): boolean {
    return this.currentOperationIndex === -1 ||
      !(this.isCurrentRow(rowIndex) || rowIndex === this.currentOperationIndex - 1);
  }

  public allowClear(rowIndex: number): boolean {
    return this.currentOperationIndex !== -1 && this.currentOperationIndex <= rowIndex;
  }

  public changeRowStatusHandler(status: ProductOperationStatus, rowIndex: number) {
    switch (status) {
      case ProductOperationStatus.DONE: this.currentOperationIndex = rowIndex + 1; break;
      case ProductOperationStatus.WAITING: this.currentOperationIndex = rowIndex; break;
      default: break;
    }
  }

  private _getCurrentOperationIndex(): number {
    if (this.form.get('controlledBy').value) {
      return -1;
    }
    if (this.isAllProductStatesDone()) {
      return this.schema.length;
    }
    const formData = this.form.value;

    return this.schema.findIndex(stage => [ProductOperationStatus.WAITING, 0].includes(formData[`${stage.field}Status`]));
  }
}
