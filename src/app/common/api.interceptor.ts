import { Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '@common/services/auth';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private isRefreshingToken: boolean;
  private tokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private authService: AuthService;

  constructor(private injector: Injector, private message: NzMessageService) {
  }

  intercept(request, next) {
    const isApiUrl = /^\/api/.test(request.url);
    const isAuthUrl = /^\/api\/v1\/token/.test(request.url);
    this.authService = this.authService || this.injector.get(AuthService);
    if (isAuthUrl) {
      return next.handle(this.setToken(request));
    }
    if (isApiUrl && this.authService.isTokenExpired) {
      return this.refreshToken(request, next);
    }
    if (isApiUrl) {
      return next.handle(this.setToken(request))
        .catch((response) => {
          if (response instanceof HttpErrorResponse) {
            if (response.status === 0) {
              this.message.error('Не удалось установить соединение с сервером. Проверьте ваше интернет подключение.', { nzDuration: 4000 });
            } else if (response.status >= 500) {
              this.message.error('Сервер временно недоступен. Повторите свою попытку через минуту.', { nzDuration: 4000 });
            } else if (response.status === 401) {
              return this.refreshToken(request, next);
            }
          }
          return Observable.throw(response);
        });
    }
    return next.handle(request);
  }

  private setToken(request: HttpRequest<any>) {
    const extend = this.authService.accessToken != null
      ? { setHeaders: { Authorization: `Bearer ${this.authService.accessToken}` } }
      : {};
    return request.clone(extend);
  }

  private refreshToken(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);
      return this.authService.updateToken()
        .switchMap((newToken) => {
          this.tokenSubject.next(newToken);
          return next.handle(this.setToken(request));
        })
        .catch(response => <any>this.doLogout(response))
        .finally(() => {
          this.isRefreshingToken = false;
        });
    }
    return this.tokenSubject
      .filter(token => token != null)
      .take(1)
      .switchMap((token) => {
        return next.handle(this.setToken(request));
      });
  }

  private doLogout(response) {
    if (response instanceof HttpErrorResponse && response.status === 401) {
      const router = this.injector.get(Router);
      return this.authService.logout()
        .switchMap(() => router.navigate(['login']));
    }
    return Observable.throw(response);
  }
}
