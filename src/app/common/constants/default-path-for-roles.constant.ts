import { RolesUsers } from '@common/constants/roles-users.constant';

export const DefaultPathForRoles = [
  { role: RolesUsers.DOCTOR, path: 'patients' },
  { role: RolesUsers.XRAY_MASTER, path: 'patients' },
  { role: RolesUsers.USER, path: 'shedule' },
  { role: RolesUsers.USER_MANAGER, path: 'purchases' },
  { role: RolesUsers.WORKER, path: 'robot' },
  { role: RolesUsers.WORKER_MANAGER, path: 'robot' },
  { role: RolesUsers.LOCKSMITH_USER, path: 'locksmith' },
  { role: RolesUsers.LOCKSMITH_LEAD, path: 'locksmith' },
  { role: RolesUsers.ADMIN, path: 'robot' },
  { role: RolesUsers.CALLCENTER, path: 'shedule' },
  { role: RolesUsers.SALES_MANAGER, path: 'crm' },
];
