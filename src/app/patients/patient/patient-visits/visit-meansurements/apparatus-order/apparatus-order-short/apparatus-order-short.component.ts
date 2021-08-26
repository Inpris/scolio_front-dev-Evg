import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { CorsetOrder } from '@common/services/corset-order';
import { HttpErrorResponse } from '@angular/common/http';
import { CorsetShortFormData } from '@common/interfaces/product-order/Corset-short-form-data';
import { CorsetMeasurement } from '@common/interfaces/product-order/Corset-measurement';
import { ProductStatus } from '@modules/common/enums/product-status.enum';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { ApparatusOrder } from '@common/models/product-order/apparatus-order/apparatus-order';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { ProductOrderService } from '@common/services/product-order.service';
import { ApparatLegMeasurement } from '@common/models/product-order/apparatus-order/apparat-leg-measurement';
import { ProductionMethod } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/models/production-method';
import { ApparatusOrderComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/apparatus-order.component';
import { HingeMeasurementComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/hinge-measurement/hinge-measurement.component';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormUtils } from '@common/utils/form';

@Component({
  selector: 'sl-apparatus-order-short',
  templateUrl: './apparatus-order-short.component.html',
  styleUrls: ['./apparatus-order-short.component.less'],
})
export class ApparatusOrderShortComponent implements OnInit {

  @ViewChildren(FormControlName) controls: QueryList<FormControlName>;
  @Input()
  device: CorsetOrder;
  @Input()
  measurement: CorsetMeasurement;
  @Input()
  corsetData: CorsetShortFormData;
  @Input()
  visitsManager: VisitsManager;
  @Input()
  public apparatLegMeasurement: ApparatLegMeasurement;

  public measurementData;
  public productionMethod: string;
  public isBusy = false;
  public form: FormGroup;

  constructor(
    private modal: NzModalRef,
    private messageService: NzMessageService,
    private productOrderService: ProductOrderService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      productionMethod: [ProductionMethod.MOLD],
      blankData: [{}],
      hingeParameters: [null],
    });
  }

  ngOnInit() {
    this.form.patchValue({
      blankData: { name: this.device.name },
    });
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
    const updateModel = ApparatusOrder.fromFormData(
      {
        corsetData: this.form.value.blankData,
        generalStatus: (this.form.value.productionMethod === ProductionMethod.MOLD) ? ProductStatus.MAKING : ProductStatus.MODEL3D,
        productionMethod: this.form.value.productionMethod,
        apparatLegMeasurement: this.apparatLegMeasurement,
        hingeParameters: this.form.value.hingeParameters,
      })
      .toUpdateModel();
    let productType;
    let messageItem;
    switch (this.device.productType.sysName) {
      case ProductOrderTypes.APPARATUS:
        productType = ProductOrderTypes.APPARATUS;
        messageItem = 'аппарата'; break;
      case ProductOrderTypes.TUTOR:
        productType = ProductOrderTypes.TUTOR;
        messageItem = 'тутора'; break;
      default: break;
    }
    this.isBusy = true;
    this.productOrderService.update(productType, this.device.id, updateModel)
      .subscribe(
        (deviceData) => {
          this.messageService.success(`Бланк заказа ${messageItem} успешно создан!`, { nzDuration: 3000 });
          this.modal.destroy(deviceData);
        },
        error => this.onError(error),
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
}
