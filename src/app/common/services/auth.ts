import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LocalStorage } from '@common/services/storage';
import { User, UserResponse } from '@common/models/user';
import * as moment from 'moment';
import { Router } from '@angular/router';

interface LoginData {
  userName: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';
const TOKEN_EXPIRE = 'tokenExpire';

export function authFactory(authService: AuthService) {
  return () => authService.init();
}

@Injectable()
export class AuthService {

  public user: User;
  private router: Router;

  constructor(private http: HttpClient, private localStorage: LocalStorage, private injector: Injector) {
    window.addEventListener('storage', (event) => {
      this.router = this.router || this.injector.get(Router);
      switch (true) {
        case document.hasFocus():
          return;
        case event.key === ACCESS_TOKEN && /login$/.test(document.location.href):
          return this.checkSession().subscribe(() => {
            this.router.navigate(['/']);
          });
        case this.accessToken === null:
          return this.router.navigate(['login']);
      }
    }, false);
  }

  get accessToken() {
    return this.localStorage.getItem(ACCESS_TOKEN);
  }

  get refreshToken() {
    return this.localStorage.getItem(REFRESH_TOKEN);
  }

  get isTokenExpired() {
    const expirationTime = this.localStorage.getItem(TOKEN_EXPIRE);
    return expirationTime && moment().unix() > +expirationTime;
  }

  get isAuth() {
    return this.accessToken != null;
  }

  init() {
    return this.checkSession().catch(() => Observable.of(null)).toPromise();
  }

  login({ userName, password, rememberMe }: LoginData) {
    return this.http.post<LoginResponse>('/api/v1/token', { userName, password, rememberMe, grandType: 'password' })
      .flatMap((response) => {
        this.onLogin(response);
        return this.checkSession();
      });
  }

  updateToken() {
    return this.http.post<LoginResponse>('/api/v1/token', { refreshToken: this.refreshToken, grandType: 'refreshToken' })
      .flatMap((response) => {
        this.onLogin(response);
        return this.checkSession();
      });
  }

  logout() {
    return Observable.of(void 0).do(() => { this.onLogout(); });
  }

  isRolesHasAccess(rolesForVerification) {
    if (this.isAuth) {
      return this.user.roles.some(userRole => rolesForVerification.some(this.hasRole(userRole.name)));
    }
    return false;
  }

  private hasRole(userRole) {
    return roleForVerification => roleForVerification === userRole;
  }

  private checkSession() {
    if (this.isAuth) {
      return this.http.get<UserResponse>('/api/v1/users/current')
        .map((data) => {
          return this.user = new User(data);
        })
        .catch((response) => {
          this.onLogout();
          return Observable.throw(response);
        });
    }
    return Observable.throw(void 0);
  }

  private onLogin({ accessToken, refreshToken, expiresIn }) {
    this.localStorage.setItem(ACCESS_TOKEN, accessToken);
    this.localStorage.setItem(REFRESH_TOKEN, refreshToken);
    this.localStorage.setItem(TOKEN_EXPIRE, moment().add(expiresIn, 'minute').unix().toString());
  }

  private onLogout() {
    this.localStorage.clear();
  }
}
