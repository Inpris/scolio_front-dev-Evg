import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { ProductOrderService } from '@common/services/product-order.service';
import { ProthesisVkOrder } from '@common/models/product-order/prothesis-vk-order';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from '@common/services/toasts.service';
import { ProductStatus } from '@modules/common/enums/product-status.enum';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormUtils } from '@common/utils/form';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';

@Component({
  selector: 'sl-protez-vk-order-short',
  templateUrl: './protez-vk-order-short.component.html',
  styleUrls: ['./protez-vk-order-short.component.less'],
})
export class ProtezVkOrderShortComponent implements OnInit {
  @Input()
  measurement;

  @Input()
  device: ProthesisVkOrder;

  @Input()
  visitsManager: VisitsManager;

  @ViewChildren(FormControlName) controls: QueryList<FormControlName>;

  public form: FormGroup;
  public isBusy = false;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private productOrderService: ProductOrderService,
    private messageService: ToastsService,
  ) {
    this.form = this.fb.group({
      measurement: [{}],
      blankData: [{}],
    });
  }

  ngOnInit() {
    this.form.patchValue({
      ...this.measurement && {
        measurement: {
          bzpvkPL1: this.measurement.bzpvkPL1,
          bzpvkPL2: this.measurement.bzpvkPL2,
          bzpvkPL3: this.measurement.bzpvkPL3,
          bzpvkPL4: this.measurement.bzpvkPL4,
          bzpvkPL5: this.measurement.bzpvkPL5,
          bzpvkPL6: this.measurement.bzpvkPL6,
          bzpvkPL7: this.measurement.bzpvkPL7,
          bzpvkPC1: this.measurement.bzpvkPC1,
          bzpvkPC2: this.measurement.bzpvkPC2,
          bzpvkPC3: this.measurement.bzpvkPC3,
          bzpvkPC4: this.measurement.bzpvkPC4,
          bzpvkPR1: this.measurement.bzpvkPR1,
          bzpvkPR2: this.measurement.bzpvkPR2,
          bzpvkPR3: this.measurement.bzpvkPR3,
          bzpvkPR4: this.measurement.bzpvkPR4,
          bzpvkPR5: this.measurement.bzpvkPR5,
          bzpvkPR6: this.measurement.bzpvkPR6,
          bzpvkPR7: this.measurement.bzpvkPR7,
          bzpvkPR8: this.measurement.bzpvkPR8,
          bzpvkPB1: this.measurement.bzpvkPB1,
          bzpvkPB2: this.measurement.bzpvkPB2,
          bzpvkPB3: this.measurement.bzpvkPB3,
          bzpvkPB4: this.measurement.bzpvkPB4,
          bzpvkPB5: this.measurement.bzpvkPB5,
        } as any },
      blankData: { name: this.device.name },
    });
  }

  closeForm() {
    this.modal.destroy();
  }

  onSubmit() {
    this.controls.forEach((control) => {
      if (control.valueAccessor instanceof FormValueAccessor) {
        (<FormValueAccessor>control.valueAccessor).markAsDirty();
      }
    });
    FormUtils.markAsDirty(this.form);
    if (this.form.valid) {
      this.isBusy = true;
      const updateModel = ProthesisVkOrder.fromFormData(
        {
          orderData: this.form.value.blankData,
          generalStatus: ProductStatus.MODEL3D,
          measurementData: this.form.value.measurement,
        })
        .toUpdateModel();
      this.productOrderService.update(ProductOrderTypes.PROTHESISVK, this.device.id, updateModel)
        .subscribe(
          (deviceData) => {
            this.messageService.success('Бланк заказа протеза ВК успешно создан!', { nzDuration: 3000 });
            this.modal.destroy(deviceData);
          },
          error => this.onError(error),
        );
    }
  }

  private onError(response: HttpErrorResponse) {
    let message = 'Произошла ошибка';
    const { errors } = response.error;
    this.isBusy = false;
    if (errors != null && errors.length > 0) {
      message = errors[0];
    }
    this.messageService.error(message, { nzDuration: 3000 });
  }

}
