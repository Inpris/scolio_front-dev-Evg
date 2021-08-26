import { UserRole } from './User-role';
export interface User {
  id: string;
  firstName: string;
  secondName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  roles: UserRole[];
  abbreviatedName: string;
}
