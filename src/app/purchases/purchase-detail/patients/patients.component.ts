import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PatientService } from '@common/services/patient.service';
import { Patient } from '@common/models/patient';
import { Purchase } from '@common/models/purchase';
import { NzModalService, NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { Product } from '@common/models/product';
import { ProductCount } from '@common/interfaces/Product-count';
import { DateUtils } from '@common/utils/date';
import { InfinityScrollComponent } from '@common/modules/infinity-scroll/infinity-scroll/infinity-scroll.component';
import { ToastsService } from '@common/services/toasts.service';
import { LocalStorage } from '@common/services/storage';
import { Service } from '@common/models/service';
import { MedicalServicesService } from '@common/services/medical-services.service';
import { Appointment } from '@common/models/appointment';
import { AppointmentsService } from '@common/services/appointments';

const STORAGE_KEY = 'PURCHASE_PATIENT_LIST_FILTERS';
// TODO: Rename patients since this is naming conflict with purchases
@Component({
  selector: 'sl-purchase-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.less'],
})
export class PatientsComponent implements OnInit {
  sortMap = {
    sortBy: null,
    sortType: null,
  };

  filterMap = {
    fullName: null,
  };

  @ViewChild('table')
  table;

  @ViewChild('pacientModalContent')
  pacientModalContent: any;

  @Input()
  purchase: Purchase;

  pageParams = {
    totalCount: null,
    page: 1,
    pageSize: 10,
    pageCount: null,
  };
  loading = true;
  scrollContainer;
  @ViewChild('infinityScroll') infinityScroll: InfinityScrollComponent;

  patients: Patient[] = [];
  products: Product[] = [];

  formType: string;
  pacientData: any;
  modalRef: NzModalRef;
  availableServices: Service[];
  appointments: Appointment[];

  deviceCount: number;

  constructor(
    private patientService: PatientService,
    private modalService: NzModalService,
    private message: ToastsService,
    private medicalServicesService: MedicalServicesService,
    private toastService: ToastsService,
    private appointmentsService: AppointmentsService,
    private storageService: LocalStorage,
) {
    const savedFilters = storageService.getTemplJsonItem(STORAGE_KEY);
    if (savedFilters) {
      this.filterMap = savedFilters.filterMap;
    }
  }

  ngOnInit() {
    this.scrollContainer = document.querySelector('.sl-root-layout .sl-root-container');
    this.getPatientsData();
  }

  public filterChanged() {
    this.clearPageParams();
    this.getPatientsData();
    this.rewriteStoredFilterData();
  }

  public resetFilters() {
    this.filterMap.fullName = null;
    this.rewriteStoredFilterData();
    this.clearPageParams();
    this.getPatientsData();
  }

  public rewriteStoredFilterData() {
    this.storageService.setTempJsonItem(STORAGE_KEY, {
      filterMap: this.filterMap,
    });
  }

  sort(sortName, value) {
    this.sortMap.sortBy = sortName;

    this.sortMap.sortType = value ? value.substr(0, value.length - 3) : null;
    this.clearPageParams();
    this.getPatientsData();
  }

  private clearPageParams() {
    this.pageParams.page = 1;
    this.pageParams.pageSize = 10;
    this.pageParams.pageCount = null;
    this.pageParams.totalCount = null;
  }

  getPatientsData(more?) {
    if (
      (this.loading && more) ||
      this.pageParams.page === this.pageParams.pageCount
    ) {
      return;
    }
    if (more) {
      this.pageParams.page += 1;
    }
    this.loading = true;
    const params = { ...this.sortMap, purchaseId: this.purchase.id, patientFio: this.filterMap.fullName };

    this.patientService.getList(params, this.pageParams)
      .finally(() => {
        this.loading = false;
      })
      .subscribe((response) => {
        const { page, pageSize, pageCount, totalCount, data } = response;
        this.pageParams.page = page;
        this.pageParams.pageSize = pageSize;
        this.pageParams.pageCount = pageCount;
        this.pageParams.totalCount = totalCount;

        if (!more) {
          this.patients = [];
        }
        this.patients = [...this.patients, ...data];
        setTimeout(() => {
          if (this.infinityScroll !== undefined) {
            this.infinityScroll.checkView();
          }
        });
      });
  }

  expandChange(rowData, state) {
    this.table.data.forEach(data => data.expand = state && rowData.contact.id === data.contact.id);
    if (state) {
      this.deviceCount = rowData.purchaseDevices ? rowData.purchaseDevices.length : 0;
      this.medicalServicesService.getByPurchasePatient(this.purchase.id, rowData.contact.id)
          .subscribe(services => this.availableServices = services);
      this.appointmentsService.getListForPurchasePatient(this.purchase.id, rowData.contact.id)
          .subscribe(appointments => this.appointments = appointments);
    }
  }

  removePatient(id, index) {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите удалить пациента?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.deletePatient(id, index);
      },
      nzZIndex: 1200,
    });
  }

  openModalLeadForm (data?) {
    let isEditMode;
    if (data && data.contact) {
      isEditMode = true;
      this.pacientData = data;
    } else {
      isEditMode = false;
      this.pacientData = null;
    }
    this.formType = isEditMode ? 'edit' : 'create';
    this.modalRef = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: this.pacientModalContent,
      nzStyle: {
        top: '24px',
      },
      nzFooter: null,
      nzWidth: '660px',
    });
    this.modalRef.afterClose
      .filter(newData => newData)
      .subscribe((newData) => {
        if (isEditMode) {
          this.updatePatientInTable(newData, data);
        } else {
          this.createLinkPurchasePatient(newData);
        }
      });
  }

  actionPurchase(data) {
    if (!data) {
      this.modalRef.destroy();
    }

    if (data && data.type === 'nextOnSave') {
      this.createLinkPurchasePatient(data.data);
    } else if (data && data.type === 'close') {
      this.modalRef.destroy(data.data);
    }
  }

  private createLinkPurchasePatient(newData) {
    const data = { patientId: newData.contact.id, isCanceled: false };
    if (newData.registryDate) {
      const registryDate = DateUtils.toISODateTimeString(newData.registryDate);
      data['registryDate'] = registryDate;
    }

    const purchaseId = this.purchase.id;
    this.patientService.create(purchaseId, data)
      .subscribe((response: Patient) => {
        this.table.data.unshift(response);
        this.pageParams.totalCount += 1;
      }, (err) => {
        this.message.onError(err);
      });
  }

  private updatePatientInTable(newData, oldData) {
    const purchaseId = this.purchase.id;
    const patientId = newData.contact.id;
    const params = {
      patientId,
      registryDate: newData.registryDate,
      isCanceled: oldData.isCanceled || false,
    };

    this.patientService.update(purchaseId, patientId, params)
      .subscribe((response: Patient) => {
        Object.assign(oldData, response);
      }, (err) => {
        this.message.onError(err);
      });
  }

  deletePatient(patientId, index) {
    const purchaseId = this.purchase.id;
    this.patientService.delete(purchaseId, patientId)
      .subscribe((response) => {
        this.table.data.splice(index, 1);
        this.pageParams.totalCount -= 1;
      }, (err) => {
        this.message.onError(err);
      });
  }

  createProductCountData(data) {
    const countProducts: ProductCount = {
      total: data.count,
      inWorked: data.totalInWork,
      done: data.totalGiven,
      notDone: data.count - data.totalInWork - data.totalGiven,
    };
    return countProducts;
  }

  print() {
    window.print();
  }

  cancelPatient(patientId: string, purchaseId: string, data) {
    this.modalService.warning({
      nzTitle: 'Вы действительно хотите отменить пациента?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.patientService.cancelPatient(patientId, purchaseId, data)
            .subscribe(() => {
              this.toastService.success('Пациент успешно отменен');
              this.clearPageParams();
              this.getPatientsData();
            },
        );
      },
      nzZIndex: 1200,
    });
  }

  onAddDevice(products) {
    const rowData = this.table.data.filter(value => value.expand)[0];
    const contactId = rowData.contact.id;
    this.medicalServicesService.getByPurchasePatient(this.purchase.id, contactId)
        .subscribe(services => this.availableServices = services);
    this.deviceCount = products ? products.length : 0;
    rowData.purchaseDevices = products;
  }
}
