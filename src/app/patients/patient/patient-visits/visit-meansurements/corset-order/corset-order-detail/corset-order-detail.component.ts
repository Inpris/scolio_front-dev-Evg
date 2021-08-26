import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { CorsetOrder } from '@common/models/product-order/corset-order';
import { CorsetOrderService } from '@common/services/corset-order';
import { HttpErrorResponse } from '@angular/common/http';
import { CorsetOrderComponent } from '@modules/patients/patient/patient-visits/visit-meansurements';
import { ProductStatus } from '@modules/common/enums/product-status.enum';
import { CorsetStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/corset-status.enum';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { ManufacturingFormData } from '@common/interfaces/Manufacturing-form-data';
import { ProductOperationStatus } from '@modules/common/enums/product-operation-status';
import { ToastsService } from '@common/services/toasts.service';
import { OrderHelper } from '@modules/patients/patient/patient-visits/visit-meansurements/helpers/order-helper';
import { CorsetOrderUpdate } from '@common/interfaces/product-order/Corset-order-update';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { Contact, ContactsService } from '@common/services/contacts';

@Component({
  selector: 'sl-corset-order-detail',
  templateUrl: './corset-order-detail.component.html',
  styleUrls: ['./corset-order-detail.component.less'],
})
export class CorsetOrderDetailComponent implements OnInit {

  @ViewChild(CorsetOrderComponent) corsetOrderComponent: CorsetOrderComponent;
  @ViewChildren(FormControlName) controls: QueryList<FormControlName>;
  @Input()
  device: CorsetOrder;

  @Input()
  public visitsManager: VisitsManager;

  issueVisible = false;
  public isBusy = true;
  public manufacturingProgress: { [key: string]: boolean } = {
    blocking: false,
    cutting: false,
    fastenersInstall: false,
    turning: false,
  };
  public schema = CorsetOrder.getSchema();
  public contact: Contact;
  public isImported: boolean = false;

  public form: FormGroup;

  constructor(
    private modal: NzModalRef,
    private corsetOrderService: CorsetOrderService,
    private messageService: ToastsService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private contactService: ContactsService,
  ) {
    this.form = fb.group({
      productionTime: [{}],
      generalStatus: [ProductStatus.MODEL3D],
      corsetData: [{}],
      measurementData: [{}],
      issueData: [{}],
      modelData: [{}],
      manufacturingData: [{}],
    });
    this.form.controls.manufacturingData
      .valueChanges
      .subscribe((data: ManufacturingFormData) => {
        this.manufacturingProgress = this.schema.reduce(
          (manufacturingProgress, stage) =>
            Object.assign(manufacturingProgress, {
              [stage.field]: data[`${stage.field}Status`] === ProductOperationStatus.DONE,
            }),
          {} as { [key: string]: boolean },
        );
      });
  }

  ngOnInit() {
    this.fillForm();
    this.contactService.getById(this.visitsManager.patientId)
        .subscribe(response => this.contact = response);
  }

  private fillForm() {
    const id = this.device.id;
    this.corsetOrderService.get(id)
      .subscribe(
        (response) => {
          this.fillProperties(response);
          this.isImported = response.isImported;
        },
        error => this.onError(error),
        () => {
          this.isBusy = false;
        });
  }

  fillProperties(data: CorsetOrder) {
    // TODO set default value participationPercent1 on backend because participationPercent1 and participationPercent2 cannot both be 0
    if (data.participationPercent1 === 0 && data.participationPercent2 === 0) {
      data.participationPercent1 = 100;
    }
    this.form.setValue(
      data.toFormData(),
    );
  }

  closeForm() {
    this.modal.destroy();
  }

  saveClick() {
    this.corsetOrderComponent.onSubmit();

    if (this.corsetOrderComponent.form.valid) {
      this.saveData();
    }
  }

  saveData() {
    this.isBusy = true;
    const updateModel = CorsetOrder
      .fromFormData(this.form.value)
      .toUpdateModel();
    if (this.isAllProductStatesDone(updateModel) &&
      updateModel.generalStatus !== ProductStatus.GIVEN) {
      const status = updateModel.isControlled ?
        ProductStatus.READY : ProductStatus.CONTROL;
      updateModel.generalStatus = status;
      this.form.get('generalStatus').patchValue(status);
    }
    this.corsetOrderService.update(this.device.id, updateModel)
      .subscribe(
        (corsetData) => {
          this.messageService.success('Бланк заказа корсета успешно сохранён!', { nzDuration: 3000 });
          this.modal.destroy(corsetData);
        },
        error => this.onError(error),
        () => {
          this.isBusy = false;
          this.closeForm();
        });
  }

  isAllProductStatesDone(updateData: CorsetOrderUpdate) {
    return this.schema.reduce(
      (result, stage) =>
        result && updateData[`${stage.field}Status`] === ProductOperationStatus.DONE,
      true,
    );
  }

  private onError(response: HttpErrorResponse) {
    let message = 'Произошла ошибка';
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      message = errors[0];
    }
    this.messageService.error(message, { nzDuration: 3000 });
  }

  makingEventEventHandler(val) {
    this.form.patchValue({
      generalStatus: ProductStatus.MODEL3D,
    });
  }

  deviceControlledEventHandler(val) {
    this.issueVisible = true;
    this.form.patchValue({
      generalStatus: ProductStatus.READY,
      issueData: { corsetStatus: CorsetStatus.READY },
    });
  }

  deviceReadyEventHandler(val) {
    this.form.patchValue({
      generalStatus: ProductStatus.MAKING,
    });
  }

  deviceIssuedEventHandler(val) {
    this.form.patchValue({
      generalStatus: ProductStatus.GIVEN,
    });
  }

  getCurrentStep() {
    return OrderHelper.getCurrentStep(this.form.value.generalStatus);
  }

  issueHidden() {
    return this.form.value.generalStatus !== ProductStatus.READY
      && this.form.value.generalStatus !== ProductStatus.GIVEN;
  }

  public openPrintOrder() {
    if (this.contact && this.device && this.visitsManager.selected) {
      window.open(`${window.location.protocol}//${window.location.host}/patients/${this.contact.id}/visits/${this.visitsManager.selected.id}/${this.device.id}/corset/print`,
       '_blank', 'noopener, resizable=true,scrollbars,status, modal = no');
    }
  }
}
