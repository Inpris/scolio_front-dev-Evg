import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { ToastsService } from '@common/services/toasts.service';
import { UsersService } from '@common/services/users';
import { User } from '@common/models/user';
import { FormUtils } from '@common/utils/form';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'sl-user-change-pass',
  templateUrl: './user-change-pass.component.html',
  styleUrls: ['./user-change-pass.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(UserChangePassComponent)],
})
export class UserChangePassComponent extends FormValueAccessor implements OnInit {

  public isBusy = false;
  public showPassword = false;
  @Input() user: User;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modal: NzModalRef,
    private toastsService: ToastsService,
    private usersService: UsersService,
  ) {
    super();
    this.form = fb.group({
      password: [null, Validators.required],
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  close() {
    this.modal.destroy();
  }

  public showPsw(value) {
    this.showPassword = value;
  }

  public onSubmit() {
    FormUtils.markAsDirty(this.form);
    if (this.form.invalid) {
      return;
    }
    this.isBusy = true;
    this.usersService.updatePassword(this.user.id, this.form.value)
      .subscribe(
        () => {
          this.toastsService.onSuccess('Пароль успешно изменен');
          this.form.reset();
          this.close();
        },
        error => this.onError(error),
      );
  }

  public onError(response: HttpErrorResponse) {
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.toastsService.error(errors[0], { nzDuration: 3000 });
    }
  }

}
