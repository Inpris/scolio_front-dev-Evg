import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { AuthService } from '@common/services/auth';
import { FormUtils } from '@common/utils/form';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'sl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  readonly loginForm: FormGroup;
  loginInProgress = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      userName: [null, Validators.required],
      password: [null, Validators.required],
      rememberMe: false,
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      FormUtils.markAsDirty(this.loginForm);
      return;
    }
    this.loginInProgress = true;
    this.authService.login(this.loginForm.value).subscribe(() => this.onLoginSuccess(), error => this.onLoginError(error));
  }

  private onLoginSuccess() {
    this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl || '/login-success');
  }

  private onLoginError(response: HttpErrorResponse) {
    if (response.status === 401 && response.error && response.error.errors) {
      const { error: { errors: [message] } } = response;
      const wrongAuth = message === 'signin failed';
      this.message.error(
        wrongAuth ? 'Не удается войти. Пожалуйста, проверьте правильность написания логина и пароля.'
          : 'Не удается войти. Пользователь заблокирован.',
        { nzDuration: 4000 },
      );
    }
    this.loginInProgress = false;
  }
}
