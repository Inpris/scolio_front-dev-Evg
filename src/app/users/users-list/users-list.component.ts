import { Component, OnInit } from '@angular/core';
import { UsersService } from '@common/services/users';
import { InfinityTable } from '@common/helpers/infinity-table';
import { LocalStorage } from '@common/services/storage';
import { ToastsService } from '@common/services/toasts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserRole } from '@common/models/user';
import { NzModalService } from 'ng-zorro-antd';
import { UserFormComponent } from '@modules/users/user-form/user-form.component';
import { BranchesService } from '@common/services/dictionaries/branches.service';
import { Entity } from '@common/interfaces/Entity';
import { UserChangePassComponent } from '@modules/users/user-change-pass/user-change-pass.component';
import { AuthService } from '@common/services/auth';
import { DepartmentsService } from '@common/services/dictionaries/departments.service';
import { PositionsService } from '@common/services/dictionaries/positions.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

const STORAGE_KEY = 'USERS_FILTER_DATA';

@Component({
  selector: 'sl-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.less'],
  providers: [
    BranchesService,
    DepartmentsService,
    PositionsService,
  ],
})
export class UsersListComponent extends InfinityTable implements OnInit {
  get additionalFilterParams() {
    return {
      roleIds: this.filterMap.roles,
      isDeleted: null,
    };
  }

  public isBusy = true;
  public roles: UserRole[];
  public branches: Entity[];
  public departments: Entity[];
  public positions: Entity[];
  public dictionariesHashMap = {};

  constructor(
    public tableDataService: UsersService,
    public storageService: LocalStorage,
    private modalService: NzModalService,
    private toastsService: ToastsService,
    private branchesService: BranchesService,
    private authService: AuthService,
    private departmentsService: DepartmentsService,
    private positionsService: PositionsService,
  ) {
    super(
      {
        firstName: null,
        secondName: null,
        lastName: null,
        userName: null,
        email: null,
        phoneNumber: null,
      },
      STORAGE_KEY,
      storageService,
    );
  }

  ngOnInit() {
    super.ngOnInit();
    const pageSize = { pageSize: 500 };
    forkJoin([
      this.branchesService.getList(null, pageSize),
      this.departmentsService.getList(null, pageSize),
      this.positionsService.getList(null, pageSize),
      this.tableDataService.getRoles(),
    ]).subscribe(
      ([{ data: branches }, { data: departments }, { data: positions }, roles]) => {
        [this.branches, this.departments, this.positions, this.roles] = [branches, departments, positions, roles];
        [this.branches, this.departments, this.positions, this.roles].forEach(
          dictionary => dictionary.reduce(
            (map, item) => Object.assign(map, { [item.id]: item })
            , this.dictionariesHashMap,
          ),
        );
      },
      error => this.onError(error),
      () => this.getData(),
    );
  }

  public onError(response: HttpErrorResponse) {
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.toastsService.error(errors[0], { nzDuration: 3000 });
    }
  }

  public resetFilter() {
    this.clearPageParams();
    this.clearFilters();
    this.filterData = { ...this.filterData, ...this.filterMap };
    this.getData();
  }

  public toggleDisabled(user) {
    if (this.authService.user.userName === user.userName) {
      return this.modalService.warning({
        nzTitle: 'Вы не можете заблокировать сами себя!',
      });
    }
    this.modalService.confirm({
      nzTitle: `Вы действительно хотите ${user.isDeleted ? 'разблокировать' : 'заблокировать'} пользователя?`,
      nzOnOk: () => {
        const action = user.isDeleted ?
          this.tableDataService.enableUser.bind(this.tableDataService, user.id)
          : this.tableDataService.disableUser.bind(this.tableDataService, user.id);
        this.isBusy = true;
        action().subscribe(
          () => {
            this.toastsService.onSuccess(`Пользователь успешно ${user.isDeleted ? 'разблокирован' : 'заблокирован'}`);
            user.isDeleted = !user.isDeleted;
            this.isBusy = false;
          },
          error => this.onError(error),
        );
      },
    });
  }

  public editUser(user) {
    this.openUserForm(user)
      .afterClose
      .filter(_ => _)
      .subscribe((newUserData) => {
        this.toastsService.onSuccess('Информация о пользователе успешно обновлена');
        Object.assign(user, newUserData);
      });
  }

  public createUser() {
    this.openUserForm()
      .afterClose
      .filter(_ => _)
      .subscribe(() => {
        this.toastsService.onSuccess('Пользователь успешно создан');
        this.clearPageParams();
        this.getData();
      });
  }

  private openUserForm(user?) {
    return this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: UserFormComponent,
      nzComponentParams: {
        user,
        roles: this.roles,
        branches: this.branches,
        departments: this.departments,
        positions: this.positions,
      },
      nzFooter: null,
      nzWidth: '800px',
      nzStyle: {
        top: '24px',
      },
    });
  }

  public changePassword(user) {
    return this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: UserChangePassComponent,
      nzComponentParams: { user },
      nzFooter: null,
    });
  }
}
