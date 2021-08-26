import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { ProductTypesByMedicalService } from '@common/services/dictionaries/product-types-by-medical.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from '@common/services/toasts.service';
import { ProductOrder } from '@common/models/product-order/product-order';
import { ProductStatus } from '@common/enums/product-status.enum';
import { VisitReasons } from '@common/enums/visit-reasons.enum';
import { ProductOrderService } from '@common/services/product-order.service';
import { ProductOrderHelper } from '@modules/patients/patient/patient-visits/helpers/product-order-helper';
import { ProductOrderTemplateHelper } from '@modules/patients/patient/patient-visits/helpers/product-order-template-helper';
import { ApparatusOrder } from '@common/models/product-order/apparatus-order/apparatus-order';
import { PatientService } from '@common/services/patient.service';
import { Product } from '@common/models/product';

@Component({
  selector: 'sl-visit-devices',
  templateUrl: './visit-devices.component.html',
  styleUrls: ['./visit-devices.component.less'],
  providers: [ProductTypesByMedicalService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitDevicesComponent implements OnInit {

  @Input()
  public visitsManager: VisitsManager;

  @Input()
  public visitReasonSysName;

  @ViewChild('addDeviceModalContent')
  private addDeviceModalContent: any;

  public devices: EntityWithSysName[] = [];
  public deviceNames: string[] = [];
  public existingDevices: ProductOrder[];
  public purchaseDevices: Product[];
  public availableDevices: Product[] = [];
  public purchaseId: string;
  public isLoading = false;

  private _selectedDevice = {} as EntityWithSysName;

  public set selectedDevice(device: EntityWithSysName) {
    this._selectedDevice = device;
    if (this.purchaseDevices) {
      this.availableDevices = this.purchaseDevices.filter(value => !value.productType || value.productType.sysName === device.sysName);
    }
  }

  public get selectedDevice() {
    return this._selectedDevice;
  }

  public newDeviceText = '';
  public purchaseDevice: Product = null;
  public addDeviceModal: NzModalRef;

  get isCorrection() {
    return this.visitReasonSysName === VisitReasons.CORRECTION;
  }

  constructor(
    private productTypesService: ProductTypesByMedicalService,
    private modalService: NzModalService,
    private messageService: ToastsService,
    private productOrderService: ProductOrderService,
    private cdr: ChangeDetectorRef,
    private patientService: PatientService,
  ) {
  }

  ngOnInit() {
    this.getDevices();

    this.visitsManager
      .selectionChanges
      .subscribe((visit) => {
        this.getDevices();
      });
  }

  public getDeviceStatus(device: ProductOrder) {
    switch (device.generalStatus) {
      case ProductStatus.ORDERBLANK:
        return 'Создан бланк заказа';
      case ProductStatus.MODEL3D:
        return 'Изготовление 3D модели';
      case ProductStatus.MAKING:
        return 'Изготовление';
      case ProductStatus.READY:
        return 'Готово';
      case ProductStatus.GIVEN:
        return 'Выдано';
      default:
        return 'Бланк не создан';
    }
  }

  private getDevices() {
    this.toggleLoading();
    this.productTypesService.getList(
      { medicalServiceId: this.visitsManager.selected.medicalService.id },
      { pageSize: 500 },
    ).subscribe(
      (response) => {
        this.devices = response.data;
        this.existingDevices = this.visitsManager.selected.products;
        this.selectedDevice = this.devices[0];
      },
      error => this.onError(error),
      () => this.toggleLoading(),
    );
  }

  public showDevice(device: ApparatusOrder, short = false) {
    const blankTemplate = ProductOrderTemplateHelper.getTemplate(
      ProductOrderHelper.getType(device),
      short,
    );
    const modal = this.showModal({
      width: blankTemplate.width,
      component: blankTemplate.component,
      componentParams: {
        device,
        existingDevices: this.existingDevices,
        visitsManager: this.visitsManager,
        measurement: this.visitsManager.selected[blankTemplate.formField],
        apparatLegMeasurement: this.visitsManager.selected.apparatLegMeasurement,
      },
    });
    modal.afterClose.subscribe(
      newDeviceData => this.updateDevice(newDeviceData),
    );
  }

  private updateDevice(newDeviceData) {
    if (!newDeviceData) {
      return;
    }
    const deviceData = this.existingDevices.find(item => item.id === newDeviceData.id);
    if (deviceData) {
      Object.assign(deviceData, {
        ...newDeviceData,
        productionMethod: newDeviceData.productionMethod,
      });
      this.cdr.markForCheck();
    }
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

  public openAddDeviceModal() {
    this.purchaseId = (this.visitsManager.selected.deal) ? this.visitsManager.selected.deal.purchaseId : null;
    const contactId = this.visitsManager.selected.contactId;
    if (this.purchaseId && contactId) {
      const pageParams = {
        page: 1,
        pageSize: 100,
      };
      this.patientService.getProduct(this.purchaseId, contactId, pageParams).subscribe((data) => {
        this.purchaseDevices = data.data.map(value => value.purchaseDevice);

        if (this.purchaseDevices && this._selectedDevice) {
          // !value.productType - можно убрать, когда нормализуется получение productType в api/v1/purchases/{purchaseId}/patients/{contactId}/devices
          this.availableDevices = this.purchaseDevices.filter(value => !value.productType || value.productType.sysName === this._selectedDevice.sysName);
        }
        this.deviceNames = data.data.map(value => value.purchaseDevice.name);
        this.showAddDeviceModal();
      });
    } else {
      this.showAddDeviceModal();
    }
  }

  public showAddDeviceModal() {
    this.addDeviceModal = this.modalService.create({
      nzMaskClosable: false,
      nzContent: this.addDeviceModalContent,
      nzComponentParams: {
        data: this.visitsManager,
      },
      nzStyle: { top: '204px' },
      nzFooter: null,
      nzWidth: '768px',
    });
  }


  public closeAddDeviceModal() {
    this.purchaseDevice = null;
    this.addDeviceModal.close();
    this.addDeviceModal.destroy(this.newDeviceText);
  }

  public addDevice() {
    this.toggleLoading();
    this.productOrderService.create(
      ProductOrderHelper.getType({ isCorrection: this.isCorrection, productType: { sysName: this.selectedDevice.sysName } }),
      {
        productTypeId: this.selectedDevice.id,
        name: this.purchaseId ? this.purchaseDevice.name : this.newDeviceText,
        purchaseDeviceId: this.purchaseId ? this.purchaseDevice.id : null,
        visitId: this.visitsManager.selected.id,
      }).subscribe(
      (newOrder) => {
        this.closeAddDeviceModal();
        this.existingDevices.push(newOrder);
        this.newDeviceText = '';
      },
      error => this.onError(error),
      () => this.toggleLoading());
  }


  public deleteDevice(device: ProductOrder) {
    this.modalService.confirm({
      nzOkText: 'Удалить',
      nzCancelText: 'Отмена',
      nzContent: `Вы действительно хотите удалить изделие '${device.name}'?`,
      nzBodyStyle: {
        wordWrap: 'break-word',
      },
      nzOnOk: () => {
        this.toggleLoading();
        this.productOrderService.delete(ProductOrderHelper.getType(device), device.id)
          .subscribe(
            () => {
              const index = this.existingDevices.findIndex(_device => _device === device);
              if (index >= 0) {
                this.existingDevices.splice(index, 1);
              }
            },
            error => this.onError(error),
            () => this.toggleLoading(),
          );
      },
    });
  }

  private toggleLoading() {
    this.isLoading = !this.isLoading;
    this.cdr.markForCheck();
  }

  private onError(response: HttpErrorResponse) {
    let message = 'Произошла ошибка';
    const { errors } = response.error || {} as HttpErrorResponse;
    if (errors != null && errors.length > 0) {
      message = errors[0];
    }
    this.messageService.error(message, { nzDuration: 3000 });
    this.toggleLoading();
  }
}
