import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Product } from '@common/models/product';
import { SelectProductComponent } from '../select-product/select-product.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Purchase } from '@common/models/purchase';
import { PurchaseStore } from '@common/services/purchase.store';
import { Patient } from '@common/models/patient';
import { PatientService } from '@common/services/patient.service';
import { PatientDeviceCreate } from '@common/interfaces/Patient-device-create';
import { ProductCount } from '@common/interfaces/Product-count';
import { PatientDevice } from '@common/models/patient-device';
import { ToastsService } from '@common/services/toasts.service';

@Component({
  selector: 'sl-patient-devices',
  templateUrl: './patient-devices.component.html',
  styleUrls: ['./patient-devices.component.less'],
})
export class PatientDevicesComponent implements OnInit {
  @ViewChild('table')
  table;

  @Input()
  patient: Patient;

  @Output()
  save = new EventEmitter<PatientDevice[]>();

  products: PatientDevice[];
  purchaseData: Purchase;
  pageParams: any;

  constructor(
    private modalService: NzModalService,
    private purchaseStore: PurchaseStore,
    private patientService: PatientService,
    private message: NzMessageService,
    private toastService: ToastsService,
  ) {
  }

  ngOnInit() {
    this.pageParams = {
      page: 1,
      pageSize: 100,
    };
    this.getPurchase();
    this.getProducts();
  }
  getPurchase() {
    this.purchaseStore.getState().subscribe((purchaseData: Purchase) => {
      this.purchaseData = purchaseData;
    });
  }

  getProducts() {
    const purchaseId = this.purchaseData.id;
    const patientId = this.patient.contact.id;
    this.patientService.getProduct(purchaseId, patientId, this.pageParams).subscribe((data) => {
      this.products = data.data;
    });
  }

  removeDevice(id, index) {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите удалить изделие?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.deletePatientDevice(id, index);
      },
      nzZIndex: 1200,
    });
  }

  openModalDeviceForm(data?) {
    const isEditMode = !!data;
    const modalRef = this.modalService.create({
      // nzTitle: isEditMode ? 'Изменение данных изделия' : 'Добавление нового изделия',
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: SelectProductComponent,
      nzComponentParams: {
        data,
        formType: isEditMode ? 'edit' : 'create',
        productsPatients: this.products,
      },
      nzFooter: null,
      nzWidth: '600px',
    });
    modalRef.afterClose
      .filter(newData => newData)
      .subscribe((newData) => {
        if (isEditMode) {
          this.updatePatientDevice(newData, data);
        } else {
          this.createPatientDevice(newData);
        }
      });
  }

  createPatientDevice(data: PatientDeviceCreate) {
    const purchaseId = this.purchaseData.id;
    const patientId = this.patient.contact.id;
    this.patientService.createProduct(purchaseId, patientId, data)
      .subscribe((response) => {
        this.products.unshift(response);
        this.table.data = [...this.products];
        this.save.emit(this.products);
      }, (err) => {
        this.message.error(err.error.errors[0], { nzDuration: 4000 });
        console.dir(err);
      });
  }

  updatePatientDevice(newData, oldData) {
    const purchaseId = this.purchaseData.id;
    const patientId = this.patient.contact.id;
    this.patientService.updateProduct(purchaseId, patientId, newData)
      .subscribe((product) => {
        Object.assign(oldData, product);
      }, (err) => {
        this.toastService.error(err.error.errors[0], { nzDuration: 4000 });
      });
  }

  deletePatientDevice(id: string, index: number) {
    const purchaseId = this.purchaseData.id;
    const patientId = this.patient.contact.id;
    this.patientService.deleteProduct(purchaseId, patientId, id)
      .subscribe((response) => {
        this.table.data.splice(index, 1);
        this.products.splice(index, 1);
        this.save.emit(this.products);
      }, (err) => {
        this.toastService.error(err.error.errors[0], { nzDuration: 4000 });
      });
  }

  createProductCountData(data) {
    const countProducts: ProductCount = {
      total: data.reserved,
      inWorked: data.inWork,
      done: data.given,
      notDone: data.reserved - data.inWork - data.given,
    };
    return countProducts;
  }

  print() {
    window.print();
  }
}
