import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProductStatus } from '@common/enums/product-status.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { ToastsService } from '@common/services/toasts.service';
import { SwoshOrder } from '@common/models/product-order/swosh-order';
import { ProductOrderService } from '@common/services/product-order.service';
import { CorsetMeasurement } from '@common/interfaces/product-order/Corset-measurement';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { FormUtils } from '@common/utils/form';
import { FormValueAccessor } from '@common/models/form-value-accessor';

@Component({
  selector: 'sl-swosh-order-short',
  templateUrl: './swosh-order-short.component.html',
  styleUrls: ['./swosh-order-short.component.less'],
})
export class SwoshOrderShortComponent implements OnInit {
  @ViewChildren(FormControlName) controls: QueryList<FormControlName>;
  @Input()
  measurement;

  @Input()
  device: SwoshOrder;
  public form: FormGroup;
  public isBusy = false;
  @Input()
  public visitsManager: VisitsManager;

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
      measurement: this.measurement && this.fillMeasurementData(this.measurement),
      blankData: { name: this.device.name },
    });
  }

  closeForm() {
    this.modal.destroy();
  }

  fillMeasurementData(data: CorsetMeasurement) {
    const { circle1, circle2, circle3, circle4, circle5, fas1, fas2, fas3, fas4, fas5, hipsCirculRight, hipsCirculLeft } = data;
    return { circle1, circle2, circle3, circle4, circle5, fas1, fas2, fas3, fas4, fas5, hipsCirculRight, hipsCirculLeft };
  }

  onSubmit() {
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
    const updateModel = SwoshOrder.fromFormData(
      {
        corsetData: this.form.value.blankData,
        generalStatus: ProductStatus.MODEL3D,
        measurementData: this.form.value.measurement,
      })
      .toUpdateModel();
    this.productOrderService.update(ProductOrderTypes.SWOSH, this.device.id, updateModel)
      .subscribe(
        (deviceData) => {
          this.messageService.success('Бланк заказа СВОШ успешно создан!', { nzDuration: 3000 });
          this.modal.destroy(deviceData);
        },
        error => this.onError(error),
      );
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
