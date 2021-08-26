import { Component, ViewEncapsulation } from '@angular/core';
import { RolesUsers } from '@common/constants/roles-users.constant';

@Component({
  selector: 'sl-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  constructor() {}

  readonly ROLES_USERS = RolesUsers;
}
