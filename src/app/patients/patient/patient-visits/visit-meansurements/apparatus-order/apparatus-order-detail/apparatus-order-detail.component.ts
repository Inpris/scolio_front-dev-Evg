import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductStatus } from '@modules/common/enums/product-status.enum';
import { CorsetStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/corset-status.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ManufacturingFormData } from '@common/interfaces/Manufacturing-form-data';
import { ProductOperationStatus } from '@modules/common/enums/product-operation-status';
import { ToastsService } from '@common/services/toasts.service';
import { OrderHelper } from '@modules/patients/patient/patient-visits/visit-meansurements/helpers/order-helper';
import { CorsetOrderUpdate } from '@common/interfaces/product-order/Corset-order-update';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { Contact, ContactsService } from '@common/services/contacts';
import { ApparatusOrder } from '@common/models/product-order/apparatus-order/apparatus-order';
import { ProductionMethod } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/models/production-method';
import { ProductOrderService } from '@common/services/product-order.service';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { Subject } from 'rxjs/Subject';
import { OrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/model/order-detail-component';
import { RobotBlockingOrder } from '@common/models/product-order/apparatus-order/robot-blocking-order';
import { MoldOrder } from '@common/models/product-order/apparatus-order/mold-order';
import { RobotLaminationOrder } from '@common/models/product-order/apparatus-order/robot-lamination-order';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormUtils } from '@common/utils/form';

@Component({
  selector: 'sl-apparatus-order-detail',
  templateUrl: './apparatus-order-detail.component.html',
  styleUrls: ['./apparatus-order-detail.component.less'],
})
export class ApparatusOrderDetailComponent extends OrderDetailComponent implements OnInit {

  @Input()
  public device: ApparatusOrder;
  @Input()
  public visitsManager: VisitsManager;

  public issueVisible = false;
  public isBusy = true;
  public manufacturingProgress: { [key: string]: boolean } = {};
  public schema = [];
  public order: ApparatusOrder;
  public apparatusType;
  public form: FormGroup;
  public orderName: string;
  public contact: Contact;

  public get is3DModel() {
    return (this.apparatusType !== ProductOrderTypes.MOLD);
  }
  private unsubscriber$ = new Subject();

  constructor(
    public modal: NzModalRef,
    public messageService: ToastsService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private productOrderService: ProductOrderService,
    private contactService: ContactsService,
    private toastsService: ToastsService,
  ) {
    super();
    this.form = fb.group({
      productionTime: [{}],
      generalStatus: [ProductStatus.MODEL3D],
      corsetData: [{}],
      apparatLegMeasurement: [{}],
      issueData: [{}],
      modelData: [{}],
      manufacturingData: [{}],
      productionMethod: [{}],
      hingeParameters: [{}],
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
    let productType;
    switch (this.device.productType.sysName) {
      case ProductOrderTypes.APPARATUS:
        productType = ProductOrderTypes.APPARATUS;
        this.orderName = 'аппарата'; break;
      case ProductOrderTypes.TUTOR:
        productType = ProductOrderTypes.TUTOR;
        this.orderName = 'тутора'; break;
      default: break;
    }
    this.productOrderService.get(productType, this.device.id)
      .subscribe(
        (productOrder: ApparatusOrder) => {
          switch (productOrder.productionMethod) {
            case ProductionMethod.ROBOT_WITH_BLOCKING:
              this.schema = RobotBlockingOrder.getSchema();
              this.manufacturingProgress = RobotBlockingOrder.getManufactoringProgress();
              this.apparatusType = ProductOrderTypes.ROBOT_WITH_BLOCKING;
              break;
            case ProductionMethod.MOLD:
              this.schema = MoldOrder.getSchema();
              this.manufacturingProgress = MoldOrder.getManufactoringProgress();
              this.apparatusType = ProductOrderTypes.MOLD;
              break;
            case ProductionMethod.ROBOT_WITH_LAMINATION:
              this.schema = RobotLaminationOrder.getSchema();
              this.manufacturingProgress = RobotLaminationOrder.getManufactoringProgress();
              this.apparatusType = ProductOrderTypes.ROBOT_WITH_LAMINATION;
              break;
            default: break;
          }
          this.form.patchValue(productOrder.getFormData());
          this.isImported = productOrder.isImported;
        },
        error => this.onError(error),
        () => {
          this.isBusy = false;
        });
    this.form.get('generalStatus')
      .valueChanges
      .takeUntil(this.unsubscriber$)
      .subscribe((step) => {
        this.currentStep = this.getCurrentStep();
        this.issueVisible = step === ProductStatus.READY || step === ProductStatus.GIVEN;
      });
    this.form.get('manufacturingData')
      .valueChanges
      .takeUntil(this.unsubscriber$)
      .subscribe((data) => {
        this.manufacturingProgress = this.schema.reduce(
          (manufacturingProgress, stage) =>
            Object.assign(manufacturingProgress, {
              [stage.field]: data[`${stage.field}Status`] === ProductOperationStatus.DONE,
            }),
          {} as { [key: string]: boolean },
        );
      });
    this.contactService.getById(this.visitsManager.patientId)
        .subscribe(response => this.contact = response);
  }

  closeForm() {
    this.modal.destroy();
  }

  saveData() {
    this.controls.forEach((control) => {
      if (control.valueAccessor instanceof FormValueAccessor) {
        (<FormValueAccessor>control.valueAccessor).markAsDirty();
      }
    });
    FormUtils.markAsDirty(this.form);
    if (this.form.invalid) {
      return;
    }
    this.isBusy = true;
    let orderClass;
    switch (this.apparatusType) {
      case ProductOrderTypes.ROBOT_WITH_BLOCKING:
        orderClass = RobotBlockingOrder; break;
      case ProductOrderTypes.MOLD:
        orderClass = MoldOrder; break;
      case ProductOrderTypes.ROBOT_WITH_LAMINATION:
        orderClass = RobotLaminationOrder; break;
      default:  orderClass = ApparatusOrder;
    }
    const updateModel =
      orderClass.fromFormData(this.form.value)
                .toUpdateModel();
    if (this.isAllProductStatesDone(updateModel) &&
      updateModel.generalStatus !== ProductStatus.GIVEN) {
      const status = updateModel.isControlled ?
        ProductStatus.READY : ProductStatus.CONTROL;
      updateModel.generalStatus = status;
      this.form.get('generalStatus').patchValue(status);
    }
    let productType;
    switch (this.device.productType.sysName) {
      case ProductOrderTypes.APPARATUS: productType = ProductOrderTypes.APPARATUS; break;
      case ProductOrderTypes.TUTOR: productType = ProductOrderTypes.TUTOR; break;
    }
    this.productOrderService.update(productType, this.device.id, updateModel)
      .subscribe(
        (order) => {
          this.messageService.success(`Бланк заказа ${this.orderName} успешно сохранён!`, { nzDuration: 3000 });
          this.modal.destroy(order);
        },
        error => this.onError(error),
      );
  }

  isAllProductStatesDone(updateData: CorsetOrderUpdate) {
    return this.schema.reduce(
      (result, stage) =>
        result && updateData[`${stage.field}Status`] === ProductOperationStatus.DONE,
      true,
    );
  }

  onError(response: HttpErrorResponse) {
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
    return OrderHelper.getCurrentStep(this.form.value.generalStatus) + (!this.is3DModel ? -1 : 0);
  }


  public get isShema() {
    return this.schema && this.schema.length > 0;
  }

  public openPrintOrder() {
    if (this.contact && this.device && this.visitsManager.selected) {
      window.open(`${window.location.protocol}//${window.location.host}/patients/${this.contact.id}/visits/${this.visitsManager.selected.id}/${this.device.id}/apparatus/print`,
       '_blank', 'noopener, resizable=true,scrollbars,status, modal = no');
    }
  }
}
