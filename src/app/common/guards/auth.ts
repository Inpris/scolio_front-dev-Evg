import { Injectable } from '@angular/core';
import { CanActivateChild, CanActivate, Router } from '@angular/router';
import { AuthService } from '@common/services/auth';
import { AccessOnStateService } from '@common/services/access-on-state';
import { DefaultPathForRoles } from '@common/constants/default-path-for-roles.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next, state) {
    if (this.authService.isAuth) {
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate() {
    if (!this.authService.isAuth) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}

@Injectable()
export class AlwaysAuthChildrenGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private accessOnStateService: AccessOnStateService) {
  }

  // TODO Refactor the function, to reduce if, perhaps add RXJS
  canActivateChild(childRoute, state) {
    if (this.accessOnStateService.canGoToTheState(state.url)) {
      return true;
    }
    if (this.authService.isAuth) {
      if (state.url === '/no-access') {
        return true;
      }
      const roles = this.authService.user.roles;
      if (roles.length > 0) {
        const nameRole = roles[0].name;
        if (nameRole) {
          const defaultPathForRole = DefaultPathForRoles.find(value => nameRole === value.role);
          if (defaultPathForRole) {
            this.router.navigate([defaultPathForRole.path]);
            return false;
          }
        }
      }
      this.router.navigate(['no-access']);
      return false;
    }
    this.router.navigate(['/']);
    return false;
  }
}
