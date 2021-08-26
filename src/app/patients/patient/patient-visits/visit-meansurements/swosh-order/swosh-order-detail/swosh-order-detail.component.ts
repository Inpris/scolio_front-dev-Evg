import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/model/order-detail-component';
import { ProductOrderService } from '@common/services/product-order.service';
import { ProductStatus } from '@common/enums/product-status.enum';
import { FormBuilder } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { ToastsService } from '@common/services/toasts.service';
import { Subject } from 'rxjs/Subject';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { SwoshOrder } from '@common/models/product-order/swosh-order';
import { SwoshOrderUpdate } from '@common/interfaces/product-order/Swosh-order-update';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { Contact, ContactsService } from '@common/services/contacts';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormUtils } from '@common/utils/form';

@Component({
  selector: 'sl-swosh-order-detail',
  templateUrl: './swosh-order-detail.component.html',
  styleUrls: ['./swosh-order-detail.component.less'],
})
export class SwoshOrderDetailComponent extends OrderDetailComponent implements OnInit, OnDestroy {
  private unsubscriber$ = new Subject();
  public manufacturingProgress: { [key: string]: boolean } = {
    blocking: false,
    cutting: false,
    fastenersInstall: false,
    turning: false,
    assembly: false,
  } as { [key: string]: boolean };
  public schema = SwoshOrder.getSchema();
  public contact: Contact;

  @Input()
  public visitsManager: VisitsManager;

  constructor(
    public modal: NzModalRef,
    private fb: FormBuilder,
    private productOrderService: ProductOrderService,
    public messageService: ToastsService,
    private modalService: NzModalService,
    private contactService: ContactsService,
  ) {
    super();
    this.form = fb.group({
      generalStatus: [ProductStatus.MODEL3D],
      corsetData: [{}],
      measurementData: [{}],
      issueData: [{}],
      modelData: [{}],
      manufacturingData: [{}],
      productionTime: [{}],
    });
  }

  ngOnInit() {
    this.productOrderService.get(ProductOrderTypes.SWOSH, this.device.id)
      .subscribe(
        (productOrder: SwoshOrder) => {
          this.form.patchValue(
            productOrder.toFormData(),
          );
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
        this.currentStep = this.getCurrentStep(step);
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

  ngOnDestroy() {
    this.unsubscriber$.next();
  }

  save() {
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
    const updateModel = SwoshOrder
      .fromFormData(this.form.value)
      .toUpdateModel();
    if (this.isAllProductStatesDone(updateModel) &&
      updateModel.generalStatus !== ProductStatus.GIVEN) {
      const status = updateModel.isControlled ?
        ProductStatus.READY : ProductStatus.CONTROL;
      updateModel.generalStatus = status;
      this.form.get('generalStatus').patchValue(status);
    }
    this.productOrderService.update(ProductOrderTypes.SWOSH, this.device.id, updateModel)
      .subscribe(
        (order) => {
          this.messageService.success('Бланк заказа СВОШ успешно сохранён!', { nzDuration: 3000 });
          this.modal.destroy(order);
        },
        error => this.onError(error),
      );
  }


  isAllProductStatesDone(updateData: SwoshOrderUpdate) {
    return this.schema.reduce(
      (result, stage) =>
        result && updateData[`${stage.field}Status`] === ProductOperationStatus.DONE,
      true,
    );
  }

  public openPrintOrder() {
    if (this.contact && this.device && this.visitsManager.selected) {
      window.open(`${window.location.protocol}//${window.location.host}/patients/${this.contact.id}/visits/${this.visitsManager.selected.id}/${this.device.id}/swosh/print`,
       '_blank', 'noopener, resizable,scrollbars,status');
    }
  }
}
