import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { OrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/model/order-detail-component';
import { Subject } from 'rxjs/Subject';
import { NzModalRef } from 'ng-zorro-antd';
import { FormBuilder, FormControlName } from '@angular/forms';
import { ProductOrderService } from '@common/services/product-order.service';
import { ToastsService } from '@common/services/toasts.service';
import { CorsetCorrectionOrder } from '@common/models/product-order/corset-correction-order';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormUtils } from '@common/utils/form';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { ActivatedRoute } from '@angular/router';
import { ProductStatus } from '@common/enums/product-status.enum';
import { ProductOrder } from '@common/models/product-order/product-order';
import { ProductOrderHelper } from '@modules/patients/patient/patient-visits/helpers/product-order-helper';
import { ProductOrderTypes } from '@common/enums/product-order-types';

@Component({
  selector: 'sl-corset-correction-order-detail',
  templateUrl: './corset-correction-order-detail.component.html',
  styleUrls: ['./corset-correction-order-detail.component.less'],
})
export class CorsetCorrectionOrderDetailComponent extends OrderDetailComponent implements OnInit, OnDestroy {

  @Input()
  device: ProductOrder;
  @Input()
  public visitsManager: VisitsManager;
  @Input()
  public measurement;
  @ViewChildren(FormControlName) controls: QueryList<FormControlName>;
  private unsubscriber$ = new Subject();
  public manufacturingProgress: { [key: string]: boolean };
  public schema;
  public products = [];

  constructor(
    public modal: NzModalRef,
    private fb: FormBuilder,
    private productOrderService: ProductOrderService,
    public messageService: ToastsService,
    private route: ActivatedRoute,
  ) {
    super();
    this.form = fb.group({
      measurementData: [{}],
      orderData: [{}],
      correction: [{}],
      issueData: [{}],
      comment: [null],
    });
  }

  ngOnInit() {
    this.productOrderService.getList(this.visitsManager.patientId).switchMap((products) => {
      this.products = products.filter(
        product => product.productType.sysName === this.device.productType.sysName
          && product.generalStatus === ProductStatus.GIVEN
          && !product.isCorrection,
      );
      return this.productOrderService.get(ProductOrderHelper.getType(this.device), this.device.id);
    })
      .subscribe(
        (productOrder) => {
          this.form.patchValue(
            {
              ...productOrder.toFormData(),
              measurementData: this.measurement,
            },
          );
        },
        error => this.onError(error),
        () => {
          this.isBusy = false;
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
    if (this.form.valid) {
      this.isBusy = true;
      const device = CorsetCorrectionOrder.fromFormData(this.form.getRawValue());
      this.productOrderService
        .update(
          ProductOrderHelper.getType(this.device),
          this.device.id,
          device.toUpdateModel(),
        )
        .subscribe(
          (order) => {
            this.messageService.success(
              `Бланк заказа ${this.getUpdateMessageTarget(this.device.productType.sysName)}успешно изменен!`,
              { nzDuration: 3000 },
              );
            this.modal.destroy(order);
          },
          error => this.onError(error),
        );
    }
  }

  private getUpdateMessageTarget(type) {
    switch (type) {
      case ProductOrderTypes.SWOSH_CORRECTION: return 'СВОШ ';
      case ProductOrderTypes.CORSET_CORRECTION: return 'корсета ';
      default: return '';
    }
  }
}
