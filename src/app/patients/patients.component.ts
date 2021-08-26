import { Component, ViewChild, OnInit } from '@angular/core';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Contact, ContactsService } from '@common/services/contacts';
import { ContactsTableComponent } from '@modules/contacts/contacts-table/contacts-table.component';
import { Router } from '@angular/router';
import { Region } from '@common/models/region';
import { RegionService } from '@common/services/region.service';
import { DateUtils } from '@common/utils/date';
import { LocalStorage } from '@common/services/storage';
import { BranchesService } from '@common/services/dictionaries/branches.service';
import { AuthService } from '@common/services/auth';
import { Entity } from '@common/interfaces/Entity';
import { RolesUsers } from '@common/constants/roles-users.constant';
import {MAIN_BRANCH} from "@common/constants/access-roles-to-the-path.constant";
import {FormBuilder} from "@angular/forms";

export enum EColumns {
  fio = 'fio',
  date = 'date',
  phone = 'phone',
  email = 'email',
  region = 'region',
}

const STORAGE_KEY = 'PATIENT_LIST_FILTERS';
// TODO: Rename patients since this is naming conflict with purchases
@Component({
  selector: 'sl-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.less'],
  providers: [
    BranchesService,
  ],
})
export class PatientsComponent implements OnInit {

  readonly ROLES_USERS = RolesUsers;
  @ViewChild(ContactsTableComponent) table: ContactsTableComponent;

  public columnsEnum = EColumns;
  public sort;
  public branches: Entity[] = [];
  public selectedColumn = this._fb.control(['fio', 'date', 'phone', 'email', 'region']);
  public columns: { id: string, name: string }[] = [
    { id: EColumns.fio, name: 'ФИО Пациента' },
    { id: EColumns.date, name: 'Дата рождения' },
    { id: EColumns.phone, name: 'Телефон' },
    { id: EColumns.email, name: 'Email' },
    { id: EColumns.region, name: 'Регион' },
  ];
  public selectedTabIndex: number;
  public selectedBranch: string | string[] = this.authService.user.branchIds.length > 1 ? null : this.authService.user.branchIds[0];
  public oldSelectedBranch: string | string[] = null;
  public filter: any = {
    branchId: this.selectedBranch ? [this.selectedBranch] : null,
  };

  public sortMap: { [key: string]: any } = {
    email: null,
    fullName: null,
    birthDate: null,
    phone: null,
    'address.region.name': null,
    branchId: null,
  };

  public filterMap = {
    ...this.sortMap,
  };

  public get showTable(): boolean {
    return this.selectedColumn.value && this.selectedColumn.value.length;
  }

  constructor(
    private modalService: NzModalService,
    private router: Router,
    private regionService: RegionService,
    private storageService: LocalStorage,
    private contactsService: ContactsService,
    private message: NzMessageService,
    private branchesService: BranchesService,
    private authService: AuthService,
    private _fb: FormBuilder,
  ) {
    const savedFilters = storageService.getTemplJsonItem(STORAGE_KEY);
    if (savedFilters) {
      this.sortMap = savedFilters.sortMap;
      this.filterMap = savedFilters.filterMap;
      this.filterChanged();
      const sortBy = Object.keys(this.sortMap).find(key => this.sortMap[key]);
      this.sortChanged(this.sortMap[sortBy], sortBy);
    }
  }

  public get hasMainBranch(): boolean {
    return this.authService.user.branchIds.includes(MAIN_BRANCH);
  }

  public regions: Region[] = [];

  ngOnInit() {
    this.branchesService.getList(null, { pageSize: 500 })
      .subscribe((list: any) => {
        this.branches = list.data.filter((branch: any) => this.authService.user.branchIds.includes(branch.id));
      });
  }

  public onTabChange(event: any) {

  }

  public showColumn(columnName: EColumns): boolean {
    return this.selectedColumn.value.includes(columnName);
  }

  public onSelectBranch() {
    if (this.oldSelectedBranch !== this.selectedBranch) {
      this.oldSelectedBranch = this.selectedBranch;
      this.filterChanged();
    }
  }

  public filterChanged() {
    this.rewriteStoredFilterData();
    this.filter = {
      ...this.filterMap.email && { email: this.filterMap.email },
      ...this.filterMap.fullName && this.getFIOFromFullName(this.filterMap.fullName),
      ...this.filterMap.phone && { phone: this.filterMap.phone },
      ...this.filterMap.region && { regionId: this.filterMap.region },
      ...this.filterMap.birthDate && { birthDate: DateUtils.toISODateTimeString(this.filterMap.birthDate) },
      branchId: this.selectedBranch ? [this.selectedBranch] : null,
    };
  }

  public resetFilters() {
    let shouldListUpdate = false;
    for (const filter in this.filterMap) {
      if (filter && this.filterMap[filter]) {
        shouldListUpdate = true;
        this.filterMap[filter] = null;
      }
    }
    this.sort = this.sortMap = { };
    if (shouldListUpdate) {
      this.filterChanged();
    }
    this.storageService.removeTempItem(STORAGE_KEY);
  }

  public rewriteStoredFilterData() {
    this.storageService.setTempJsonItem(STORAGE_KEY, {
      filterMap: this.filterMap,
      sortMap: this.sortMap,
    });
  }

  public getFIOFromFullName(fullName: string = '') {
    const [lastName, firstName, secondName] = fullName.split(' ');
    return { lastName, firstName, secondName };
  }

  public sortChanged(type, field) {
    this.sort = { sortBy: type && field, sortType: type === 'descend' ? 'DESC' : 'ASC' };
    this.sortMap = { ...type && { [field]: type } };
    this.rewriteStoredFilterData();
  }

  public createPatient() {
    const modalRef = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: CreatePatientComponent,
      nzComponentParams: {
        formType: 'create',
      },
      nzStyle: {
        top: '24px',
      },
      nzFooter: null,
      nzWidth: '660px',
    });
    modalRef.afterClose
      .filter(newData => newData)
      .subscribe((contact: Contact) => {
        if (contact) {
          this.router.navigate(['/patients/', contact.id]);
        }
      });
  }

  public deletePatient(id: string, index: number) {
    this.contactsService.delete(id).subscribe((response) => {
      this.table.data.splice(index, 1);
      this.table.getContacts();
      const message = 'Пациент успешно удален';
      this.message.info(message, { nzDuration: 3000 });
    }, (err) => {
      const message = 'Возникла непредвиденная ошибка во время удаления пациента';
      this.message.error(message, { nzDuration: 3000 });
    });
  }

  public confirmRemove(id: string, index: number) {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите удалить пациента?',
      nzContent: 'Это действие удалит все его посещения.',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => { this.deletePatient(id, index); },
      nzZIndex: 1200,
    });
  }

  public onSearchRegion(value: string): void {
    if (!value || value && value.length < 3) {
      this.regions = [];
      return;
    }
    this.getRegions(value);
  }

  private getRegions(value: string) {
    const params = { filter: value };
    this.regionService.getList(params)
      .subscribe((data) => {
        this.regions = data.data;
      });
  }
}
