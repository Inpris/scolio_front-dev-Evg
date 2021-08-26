import { Component, OnInit } from '@angular/core';
import { InfinityTable } from '@common/helpers/infinity-table';
import { LocksmithService } from '@common/services/locksmith.service';
import { LocksmithOperation } from '@common/models/locksmith-operation';
import { VisitReason, VisitReasonsService } from '@common/services/visit-reasons';
import { DateUtils } from '@common/utils/date';
import { ProductTypesByMedicalService } from '@common/services/dictionaries/product-types-by-medical.service';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { RolesUsers } from '@common/constants/roles-users.constant';
import { LocalStorage } from '@common/services/storage';
import { NzModalService } from 'ng-zorro-antd';
import { LocksmithReportComponent } from '@modules/locksmith/locksmith/locksmith-report/locksmith-report.component';
import { Locksmith } from '@common/models/locksmith';

const STORAGE_KEY = 'LOCKSMITH_FILTER_DATA';

@Component({
  selector: 'sl-locksmith',
  templateUrl: './locksmith.component.html',
  styleUrls: ['./locksmith.component.less'],
  providers: [ProductTypesByMedicalService],
})
export class LocksmithComponent extends InfinityTable implements OnInit {
  operations: LocksmithOperation[];
  productTypes: EntityWithSysName[] = [];
  visitReasons: VisitReason[] = [];
  readonly ROLES_USERS = RolesUsers;

  additionalFilterParams = [];
  readonly patientLinkAccessOnRoles = [RolesUsers.DOCTOR, RolesUsers.USER, RolesUsers.USER_MANAGER, RolesUsers.ADMIN];

  constructor(public tableDataService: LocksmithService,
              private productTypeService: ProductTypesByMedicalService,
              private visitReasonService: VisitReasonsService,
              private modalService: NzModalService,
              storageService: LocalStorage) {
    super(
      {
        dateFromTo: null,
        visitDate: null,
        visitTime: null,
        medicalService: null,
        visitReason: null,
        fullName: null,
        note: null,
      },
      STORAGE_KEY,
      storageService,
    );
  }

  ngOnInit() {
    if (!this.filterMap.dateFromTo) {
      this.setDefaultDateFromTo();
    }
    this.updateDateFromTo();
    this.loadDictionariesData();
    super.ngOnInit();
    this.getData();
  }

  loadDictionariesData() {
    this.productTypeService.getProductTypes().subscribe(data => this.productTypes = data);
    this.visitReasonService.getListForLocksmith().subscribe(data => this.visitReasons = data);
  }

  onError(error) {
    console.error(error);
  }

  expandChange(row, state) {
    this.nzTable.data.forEach(_row => _row.expand = state && row === _row);
    if (state) {
      row.isLoading = true;
      this.tableDataService.getOperations(row.productId, row.visitId)
        .subscribe((response) => {
          row.isLoading = false;
          row.operations = response;
        });
    }
  }

  search(_) {
    this.updateDateFromTo();
    super.search(_);
  }

  setDefaultDateFromTo() {
    this.filterMap.dateFromTo = [];
    this.filterMap.dateFromTo.push(new Date());
    this.filterMap.dateFromTo.push(new Date());
    this.updateDateFromTo();
  }

  resetFilter() {
    this.clearPageParams();
    this.clearFilters();
    this.setDefaultDateFromTo();
    this.getData();
  }

  updateDateFromTo() {
    this.filterMap.dateVisitFrom =
      (this.filterMap.dateFromTo && this.filterMap.dateFromTo.length > 0) ? DateUtils.toISODateString(this.filterMap.dateFromTo[0]) : null;
    this.filterMap.dateVisitTo =
      (this.filterMap.dateFromTo && this.filterMap.dateFromTo.length > 0) ? DateUtils.toISODateString(this.filterMap.dateFromTo[1]) : null;
    this.filterData = { ...this.filterData, ...this.filterMap };
  }

  showReport() {
    this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: LocksmithReportComponent,
      nzFooter: null,
      nzWidth: '640px',
    });
  }

  getRange(date1, date2) {
    if (!date2) {
      return '00:00:00';
    }
    const from: any = DateUtils.normalizeSeconds(date1);
    const to: any = DateUtils.normalizeSeconds(date2);
    const { days, hours, minutes } = DateUtils.toDateMap(to - from);
    return ((days + '').length > 1 ? days : '0' + days) + ':' +
      ((hours + '').length > 1 ? hours : '0' + hours) + ':' +
      ((minutes + '').length > 1 ? minutes : '0' + minutes);
  }

  updateRow(operations: LocksmithOperation[], row: Locksmith) {
    row.operations = operations;
    row.lockSmithExecutions = operations;
  }
}
