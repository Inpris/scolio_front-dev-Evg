import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { FormBuilder } from '@angular/forms';
import { ProthesisVkOrder } from '@common/models/product-order/prothesis-vk-order';
import { ProductStatus } from '@modules/common/enums/product-status.enum';
import { ProductOrderService } from '@common/services/product-order.service';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { ToastsService } from '@common/services/toasts.service';
import { Subject } from 'rxjs/Subject';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { OrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/model/order-detail-component';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormUtils } from '@common/utils/form';

@Component({
  selector: 'sl-protez-vk-order-detail',
  templateUrl: './protez-vk-order-detail.component.html',
  styleUrls: ['./protez-vk-order-detail.component.less'],
})
export class ProtezVkOrderDetailComponent extends OrderDetailComponent implements OnInit, OnDestroy {
  private unsubscriber$ = new Subject();
  public manufacturingProgress: { [key: string]: boolean } = {
    blocking: false,
    impressionTaking: false,
    impressionProcess: false,
    lamination: false,
    assembly: false,
    cutting: false,
    fastenersInstall: false,
    fitting: false,
  };
  public schema = ProthesisVkOrder.getSchema();

  @Input()
  public visitsManager: VisitsManager;

  constructor(
    public modal: NzModalRef,
    private fb: FormBuilder,
    private productOrderService: ProductOrderService,
    public messageService: ToastsService,
  ) {
    super();
    this.form = fb.group({
      generalStatus: [ProductStatus.MODEL3D],
      orderData: [{}],
      measurementData: [{}],
      issueData: [{}],
      modelData: [{}],
      manufacturingData: [{}],
    });
  }

  ngOnInit() {
    this.productOrderService.get(ProductOrderTypes.PROTHESISVK, this.device.id)
      .subscribe(
        (productOrder: ProthesisVkOrder) => {
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
    this.productOrderService.update(ProductOrderTypes.PROTHESISVK, this.device.id, ProthesisVkOrder.fromFormData(this.form.value).toUpdateModel())
      .subscribe(
        (order) => {
          this.messageService.success('Бланк заказа протеза ВК успешно сохранён!', { nzDuration: 3000 });
          this.modal.destroy(order);
        },
        error => this.onError(error),
      );
  }

}
