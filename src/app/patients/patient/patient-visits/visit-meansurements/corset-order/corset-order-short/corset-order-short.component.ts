import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { CorsetOrder, CorsetOrderService } from '@common/services/corset-order';
import { HttpErrorResponse } from '@angular/common/http';
import { CorsetShortFormData } from '@common/interfaces/product-order/Corset-short-form-data';
import { CorsetMeasurement } from '@common/interfaces/product-order/Corset-measurement';
import { CorsetOrderComponent } from '@modules/patients/patient/patient-visits/visit-meansurements';
import { ProductStatus } from '@modules/common/enums/product-status.enum';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';

@Component({
  selector: 'sl-corset-order-short',
  templateUrl: './corset-order-short.component.html',
  styleUrls: ['./corset-order-short.component.less'],
})
export class CorsetOrderShortComponent implements OnInit {

  @ViewChild(CorsetOrderComponent) corsetOrderComponent: CorsetOrderComponent;

  @Input()
  device: CorsetOrder;
  @Input()
  measurement: CorsetMeasurement;
  @Input()
  corsetData: CorsetShortFormData;
  @Input()
  visitsManager: VisitsManager;
  measurementData;
  public isBusy = false;

  constructor(
    private modal: NzModalRef,
    private corsetOrderService: CorsetOrderService,
    private messageService: NzMessageService,
  ) {
  }

  ngOnInit() {
    this.fillCorsetData(this.device);
    if (this.measurement) {
      this.fillMeasurementData(this.measurement);
    }
  }

  fillCorsetData(data: CorsetOrder) {
    const { id, name, dateOfIssue, corsetType, plasticType, color, dateOfIssueTurner, dateSendingToBranch, branch } = data;
    this.corsetData = { id, name, dateOfIssue, corsetType, plasticType, color, dateOfIssueTurner, dateSendingToBranch, branch };
  }

  fillMeasurementData(data: CorsetMeasurement) {
    const { samplingDate, acceptedBy, circle1, circle2, circle3, circle4, circle5, fas1, fas2, fas3, fas4, fas5 } = data;
    this.measurementData = { circle1, circle2, circle3, circle4, circle5, fas1, fas2, fas3, fas4, fas5 };
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
    const updateModel = CorsetOrder.fromFormData(
      {
        corsetData: this.corsetData,
        generalStatus: ProductStatus.MODEL3D,
        measurementData: this.measurementData,
      })
      .toUpdateModel();
    this.isBusy = true;
    this.corsetOrderService.update(this.device.id, updateModel)
      .subscribe(
        (corsetOrder) => {
          this.messageService.success('Бланк заказа корсета успешно создан!', { nzDuration: 3000 });
          this.modal.destroy(corsetOrder);
        },
        error => this.onError(error),
        () => {
          this.isBusy = false;
          this.closeForm();
        });
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
