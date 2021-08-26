import { RolesUsers } from '@common/constants/roles-users.constant';

export const AccessRolesToTheState = [
  { path: 'shedule', parent: '', roles: [RolesUsers.DOCTOR, RolesUsers.USER, RolesUsers.USER_MANAGER, RolesUsers.ADMIN, RolesUsers.CALLCENTER, RolesUsers.WORKER_MANAGER] },
  { path: 'crm', parent: '', roles: [RolesUsers.USER, RolesUsers.USER_MANAGER, RolesUsers.ADMIN, RolesUsers.SALES_MANAGER] },
  { path: 'purchases', parent: '', roles: [RolesUsers.USER, RolesUsers.USER_MANAGER, RolesUsers.ADMIN] },
  { path: 'patients', parent: '', roles: [RolesUsers.DOCTOR, RolesUsers.USER, RolesUsers.USER_MANAGER, RolesUsers.ADMIN, RolesUsers.XRAY_MASTER, RolesUsers.SALES_MANAGER] },
  { path: 'robot', parent: '', roles: [RolesUsers.DOCTOR, RolesUsers.USER, RolesUsers.USER_MANAGER, RolesUsers.ADMIN, RolesUsers.WORKER, RolesUsers.WORKER_MANAGER] },
  { path: 'locksmith', parent: '', roles: [RolesUsers.DOCTOR, RolesUsers.USER, RolesUsers.USER_MANAGER, RolesUsers.ADMIN, RolesUsers.LOCKSMITH_USER, RolesUsers.LOCKSMITH_LEAD] },
  { path: 'users', parent: '', roles: [RolesUsers.ADMIN] },
  { path: 'schedule-settings', parent: '', roles: [RolesUsers.DOCTOR_TIME_TABLE] },
  { path: 'reports', parent: '', roles: [RolesUsers.ADMIN] },
  { path: 'dictionary', parent: '', roles: [RolesUsers.ADMIN] },
];

export const MAIN_BRANCH = '4491883d-2c06-4795-8220-59bc1e668965';
