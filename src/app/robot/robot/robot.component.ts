import { Component, OnInit, ViewChild } from '@angular/core';
import { RobotService } from '@modules/common/services/robot.service';
import { NzModalService } from 'ng-zorro-antd';
import { ToastsService } from '@common/services/toasts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderTerm } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/order-term.enum';
import { Robot } from '@modules/common/interfaces/Robot';
import { ProductStatus } from '@common/enums/product-status.enum';
import { DateUtils } from '@common/utils/date';
import { RobotStage, RobotStageLimits } from '@common/interfaces/Robot-stage';
import { InfinityTable } from '@common/helpers/infinity-table';
import { RolesUsers } from '@common/constants/roles-users.constant';
import { LocalStorage } from '@common/services/storage';
import { RobotHelper } from '@modules/robot/helpers/robot-helper';
import { UsersService } from '@common/services/users';
import { RobotReportComponent } from '@modules/robot/robot/robot-report/robot-report.component';
import { OrderManufacturingComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/order-manufacturing/order-manufacturing.component';

enum TABS {
  Corset,
  Swosh,
  Apparatus,
  Tutor,
  ProsthesisNk,
}

const STORAGE_KEY = 'ROBOT_FILTER_DATA';
export const DOCTORS = 'doctors';
export const TECHNICS = 'technics';
export const ALL = 'all';

@Component({
  selector: 'sl-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.less'],
})
export class RobotComponent extends InfinityTable implements OnInit {
  public users;
  public orderTerm = OrderTerm;
  public doctors = DOCTORS;
  public technics = TECHNICS;
  public all = ALL;

  public schema = [];
  public statistic: RobotStage[];
  public limits: RobotStageLimits[];
  public tableDataService;
  public loadPending = false;
  readonly ROLES_USERS = RolesUsers;
  readonly patientLinkAccessOnRoles = [RolesUsers.DOCTOR, RolesUsers.USER, RolesUsers.USER_MANAGER, RolesUsers.ADMIN];

  @ViewChild(OrderManufacturingComponent) orderManufacturingComponent;

  get additionalFilterParams() {
    return {
      ProductTypeSysName: TABS[!!this.filterMap.currentTab ? this.filterMap.currentTab : 0],
      MakingStage: this.filterMap.selectedGeneralStatus,
      ...this.dateFilterRange,
    };
  }

  get dateFilterRange() {
    return {
      DateFrom: (this.filterMap.dateFromTo && this.filterMap.dateFromTo.length > 0) ? DateUtils.toISODateString(this.filterMap.dateFromTo[0]) : null,
      DateTo: (this.filterMap.dateFromTo && this.filterMap.dateFromTo.length > 0) ? DateUtils.toISODateString(this.filterMap.dateFromTo[1]) : null,
    };
  }

  setDefaultDateFromTo() {
    this.filterMap.dateFromTo = [];
    this.filterMap.dateFromTo.push(new Date());
    this.filterMap.dateFromTo.push(new Date());
  }

  constructor(
    private robotService: RobotService,
    private usersService: UsersService,
    private modalService: NzModalService,
    private toastsService: ToastsService,
    storageService: LocalStorage,
  ) {
    super(
      {
        patientFio: null,
        visitDate: null,
        dateOfIssue: null,
        dateSendingToBranch: null,
        branchName: null,
        acceptedBy: null,
        selectedGeneralStatus: ProductStatus.MODEL3D,
        currentTab: 0,
      },
      STORAGE_KEY,
      storageService,
    );
    this.tableDataService = robotService;
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.filterMap.dateFromTo) {
      this.setDefaultDateFromTo();
    }
    this.updateDatetime();
    this.usersService.getList({ pageSize: 1000 })
      .map(response => response.data)
      .subscribe(
        (users) => {
          this.users = users.map(user => ({ id: user.id, name: user.abbreviatedName }));
          this.schema = RobotHelper.getSchema(TABS[!!this.filterMap.currentTab ? this.filterMap.currentTab : 0]);
          this.getData();
        },
        error => this.onError(error));
    this.updateStatistic();
  }

  saveChanges(data, component) {
    const formComponent = (data.is3DModelReady) ? this.orderManufacturingComponent : component;
    const updateData = RobotHelper.updateDeviceData(data, formComponent, this.schema);
    this.robotService.update(data.productType.sysName, updateData)
      .subscribe(
        (response: Robot) => {
          if ((!data.isControlled && updateData.isControlled)
            || (!data.is3DModelReady && updateData.is3DModelReady)
            || (this.filterMap.selectedGeneralStatus !== response.makingStage)) {
            this.data = null;
            this.getData();
          } else {
            formComponent.markAsPristine();
            data.updating = false;
            Object.assign(data, response);
            formComponent.form.patchValue(response);
          }
          this.updateStatistic();
          this.toastsService.success('Данные успешно обновлены', { nzDuration: 3000 });
        },
        (error) => {
          this.onError(error);
          data.updating = false;
        });
  }

  resetChanges(data, component) {
    const formComponent = (data.is3DModelReady) ? this.orderManufacturingComponent : component;
    this.modalService.confirm({
      nzOkText: 'Сбросить',
      nzCancelText: 'Отмена',
      nzContent: `Вы действительно хотите сбросить все изменения?`,
      nzOnOk: () => {
        formComponent.writeValue(data);
        formComponent.markAsPristine();
      },
    });
  }

  onError(response: HttpErrorResponse) {
    this.pending = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.toastsService.error(errors[0], { nzDuration: 3000 });
    }
  }

  onTabChange(index) {
    this.filterMap.currentTab = index;
    this.data = null;
    this.schema = RobotHelper.getSchema(TABS[index]);
    this.clearPageParams();
    this.getData();
    this.rewriteStoredFilterData();
  }

  public openOrderBlankDetail(formComponent, device: Robot) {
    const component = (device.is3DModelReady) ? this.orderManufacturingComponent : formComponent;
    const modal = this.showModal(RobotHelper.getTemplate(device));
    modal.afterClose
      .filter(value => value)
      .subscribe(
        (newDeviceData) => {
          this.updateStatistic();
          if ((!device.isControlled && newDeviceData.isControlled)
            || (!device.is3DModelReady && newDeviceData.is3DModelReady)) {
            this.data = null;
            this.getData();
          }
          component.writeValue(Object.assign(device, newDeviceData));
          component.markAsPristine();
        },
      );
  }

  private showModal({ componentParams, component, width }) {
    return this.modalService.create({
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: component,
      nzComponentParams: componentParams,
      nzStyle: { top: '24px' },
      nzFooter: null,
      nzWidth: width,
    });
  }

  public onStatusChange(data) {
    this.filterMap.selectedGeneralStatus = data.stage;
    this.data = null;
    this.clearPageParams();
    this.getData();
    this.rewriteStoredFilterData();
  }

  public updateStatistic() {
    let dateParams = {};
    if (this.dateFilterRange.DateFrom != null && this.dateFilterRange.DateTo != null) {
      dateParams = this.dateFilterRange;
    }
    this.robotService.getDiagram(dateParams)
      .subscribe(({ data, settings }) => {
        this.limits = settings;
        this.statistic = data;
      });
  }

  search(_) {
    this.updateDatetime();
    this.updateStatistic();
    this.clearPageParams();
    this.getData();
    this.rewriteStoredFilterData();
  }

  deviceReadyEventHandler() {
    this.updateStatistic();
  }

  resetFilter() {
    this.clearPageParams();
    this.clearFilters();
    this.setDefaultDateFromTo();
    this.filterMap.selectedGeneralStatus = this.statistic[0].stage;
    this.filterData = { ...this.filterData, ...this.filterMap };
    this.updateStatistic();
    this.getData();
  }

  updateDatetime() {
    this.filterData = { ...this.filterData, ...this.filterMap };
    if (this.filterMap.visitDate) {
      this.filterData.visitDate = DateUtils.toISODateString(this.filterMap.visitDate);
    }
    if (this.filterMap.dateOfIssue) {
      this.filterData.dateOfIssue = DateUtils.toISODateString(this.filterMap.dateOfIssue);
    }
    if (this.filterMap.dateSendingToBranch) {
      this.filterData.dateSendingToBranch = DateUtils.toISODateString(this.filterMap.dateSendingToBranch);
    }
  }
  expandChange(row, state) {
    if (state) {
      this.updateSchema(row);
      this.nzTable.data.forEach(_row => _row.expand = state && row === _row);
      if (state) {
        this.loadPending = row.loading = true;

        setTimeout(() => {
          this.robotService.getRobot(row.id).subscribe((robot) => {
            Object.assign(row, robot);
            this.loadPending = row.loading = false;
            if (RobotHelper.getIsWithout3DModel(row)) {
              row.is3DModelReady = true;
            }
          });
        });
      }
    }
  }

  showReport(type: string) {
    this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: RobotReportComponent,
      nzFooter: null,
      nzWidth: '640px',
      nzComponentParams: {
        type,
      }
    });
  }

  updateSchema(data) {
    if (['Apparatus', 'Tutor'].includes(data.productType.sysName)) {
      this.schema = RobotHelper.getSchema(data.productType.sysName, data.productionMethod);
    }
  }

  has3Dmodel(data) {
    return !RobotHelper.getIsWithout3DModel(data);
  }

  isResetButton(data) {
    return data['generalStatus'] !== ProductStatus.READY;
  }

  isFormPristine(data, component: OrderManufacturingComponent) {
    const formComponent = (data.is3DModelReady) ? this.orderManufacturingComponent : component;
    return !formComponent || formComponent.form.pristine;
  }
}
