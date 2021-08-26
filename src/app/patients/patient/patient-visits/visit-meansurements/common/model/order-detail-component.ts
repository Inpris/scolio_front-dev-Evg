import { ProductStatus } from '@common/enums/product-status.enum';
import { OrderHelper } from '@modules/patients/patient/patient-visits/visit-meansurements/helpers/order-helper';
import { CorsetStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/corset-status.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { Input, QueryList, ViewChildren } from '@angular/core';
import { ProductOrder } from '@common/models/product-order/product-order';
import { NzModalRef } from 'ng-zorro-antd';
import { ToastsService } from '@common/services/toasts.service';
import { FormControlName, FormGroup } from '@angular/forms';

export abstract class OrderDetailComponent {
  @Input()
  device: ProductOrder;
  @ViewChildren(FormControlName) controls: QueryList<FormControlName>;
  public isBusy = true;
  public currentStep;
  public issueVisible = false;
  public form: FormGroup;
  public abstract schema: { name: string, field: string, defects?: { label: string, formControl: string }[] }[];
  abstract manufacturingProgress: { [key: string]: boolean };
  abstract modal: NzModalRef;
  abstract messageService: ToastsService;
  public isImported: boolean = false;

  getCurrentStep(step) {
    return OrderHelper.getCurrentStep(step);
  }

  closeForm() {
    this.modal.destroy();
  }

  public makingEventEventHandler(val) {
    this.form.patchValue({
      generalStatus: ProductStatus.MODEL3D,
    });
  }

  public deviceControlledEventHandler(val) {
    this.issueVisible = true;
    this.form.patchValue({
      generalStatus: ProductStatus.READY,
      issueData: { corsetStatus: CorsetStatus.READY },
    });
  }

  public deviceReadyEventHandler(val) {
    this.form.patchValue({
      generalStatus: ProductStatus.MAKING,
    });
  }

  public deviceIssuedEventHandler(val) {
    this.form.patchValue({
      generalStatus: ProductStatus.GIVEN,
    });
  }

  public onError(response: HttpErrorResponse) {
    let message = 'Произошла ошибка';
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      message = errors[0];
    }
    this.messageService.error(message, { nzDuration: 3000 });
  }

}
