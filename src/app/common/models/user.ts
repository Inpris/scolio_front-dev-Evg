import * as moment from 'moment';

export interface UserResponse {
  abbreviatedName: string;
  id: string;
  firstName: string;
  secondName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  roles: UserRole[];
  branchId: string;
  branchIds: string[];
  birthDate: string;
  departmentId: string;
  positionId: string;
  isDeleted: boolean;
}

export interface UserCreate {
  id?: string;
  firstName: string;
  secondName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  roles: UserRole[];
  isDeleted?: boolean;
  birthDate: string;
  branchId: string;
  departmentId: string;
  positionId: string;
}

export interface UserRole {
  id: string;
  name: string;
  sort: number;
}

export class User {
  id: string;
  firstName: string;
  secondName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  roles: UserRole[];
  rolesSysNames: string;
  abbreviatedName: string;
  branchId: string;
  branchIds: string[];
  birthDate: Date;
  departmentId: string;
  positionId: string;
  isDeleted: boolean;

  constructor(data: UserResponse) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.secondName = data.secondName;
    this.lastName = data.lastName;
    this.userName = data.userName;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.roles = data.roles;
    this.rolesSysNames = data.roles.map(({ name }) => name).join(', ');
    this.abbreviatedName = data.abbreviatedName;
    this.branchId = data.branchId;
    this.branchIds = data.branchIds;
    this.departmentId = data.departmentId;
    this.positionId = data.positionId;
    this.isDeleted = data.isDeleted;
    this.birthDate = data.birthDate ? new Date(moment(data.birthDate).format()) : null;
  }
}
