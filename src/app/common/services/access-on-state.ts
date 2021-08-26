import { Injectable } from '@angular/core';
import { AuthService } from '@common/services/auth';
import { AccessRolesToTheState } from '@common/constants/access-roles-to-the-path.constant';

@Injectable()
export class AccessOnStateService {
  constructor(private authService: AuthService) {}

  canGoToTheState(urlState) {
    return urlState
      .split('/')
      .some(path => this.isHaveAccessRoleAndPath(path));
  }

  isHaveAccessRoleAndPath(path) {
    if (path === '') { return false; }

    // TODO develop api on backend, after that doing refactoring this method
    return AccessRolesToTheState.some((arr) => {
      if (path === arr.path) {
        return this.authService.isRolesHasAccess(arr.roles);
      }
      return false;
    });
  }
}
