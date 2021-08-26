import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormBuilder, Validators } from '@angular/forms';
import { FormUtils } from '@common/utils/form';
import { NzModalRef } from 'ng-zorro-antd';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from '@common/services/toasts.service';
import { User, UserRole } from '@common/models/user';
import { Entity } from '@common/interfaces/Entity';
import { PhoneValidator } from '@common/validators/phone-validator';
import { UsersService } from '@common/services/users';
import { DateUtils } from '@common/utils/date';
import { AuthService } from '@common/services/auth';
import { takeUntil } from 'rxjs/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import value from '*.json';

@Component({
  selector: 'sl-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(UserFormComponent)],
})
export class UserFormComponent extends FormValueAccessor implements OnInit, OnDestroy {
  private isKilled$: Subject<boolean> = new Subject<boolean>();
  public isBusy = false;
  public showPassword = false;
  public regex = /[^A-Za-z\.0-9]/g;
  public allowBranches: Entity[] = [];
  @Input() public user: User;
  @Input() public roles: UserRole[];
  @Input() public branches: Entity[];
  @Input() public departments: Entity[];
  @Input() public positions: Entity[];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modal: NzModalRef,
    private toastsService: ToastsService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super();
    this.form = fb.group({
      firstName: [null, Validators.required],
      secondName: [null],
      lastName: [null, Validators.required],
      birthDate: [null, Validators.required],
      userName: [null, Validators.required],
      password: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [null, [Validators.required, PhoneValidator.checkNumber]],
      roles: [null, Validators.required],
      branchId: [null, Validators.required],
      branchIds: [null, Validators.required],
      departmentId: [null, Validators.required],
      positionId: [null, Validators.required],
    });
  }

  ngOnInit() {

    super.ngOnInit();

    this.branches = this.branches.filter(branch => (this.authService.user.branchIds || []).includes(branch.id));
    this.allowBranches = this.branches.filter((branch: any) => (this.form.get('branchIds').value || []).includes(branch.id));

    this.form.get('branchIds').valueChanges
      .takeUntil(this.isKilled$)
      .filter(ids => ids && ids.length)
      .subscribe((ids_value: string[]) => {
        this.allowBranches = this.branches.filter((branch: Entity) => (ids_value || []).includes(branch.id));

        if (!(ids_value || []).includes(this.form.get('branchId').value)) {
          this.form.get('branchId').setValue(ids_value[0] || null);
        }
      });

    if (this.user) {
      this.form.patchValue({
        ...this.user,
        roles: (this.user.roles || []).map(({ id }) => id),
      });
      this.form.controls.password.disable();
    }
  }

  ngOnDestroy() {
    this.isKilled$.next(false);
    this.isKilled$.complete();
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  public onSubmit() {
    FormUtils.markAsDirty(this.form);
    if (this.form.invalid) {
      return;
    }
    const action = this.user ?
      this.usersService.updateUser.bind(this.usersService, this.user.id)
      : this.usersService.createUser.bind(this.usersService);
    const newUser = this.form.value;
    this.isBusy = true;

    action({
      ...this.user,
      ...newUser,
      phoneNumber: newUser.phoneNumber,
      birthDate: newUser.birthDate ? DateUtils.toISODateString(newUser.birthDate) : null,
      roleIds: newUser.roles,
    })
      .subscribe(
        (user) => {
          const newUser = this.user ? {
            ...this.user,
            ...user,
            branchIds: [...this.form.get('branchIds').value],
          } : {
            ...user,
          };

          this.form.reset();
          this.modal.destroy(Object.assign(this.user || {}, newUser));
        },
        error => this.onError(error),
      );
  }

  public close() {
    this.modal.destroy();
  }

  public onError(response: HttpErrorResponse) {
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.toastsService.error(errors[0], { nzDuration: 3000 });
    }
  }

  public showPsw(value) {
    this.showPassword = value;
  }
}
