import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { ProductOrderService } from '@common/services/product-order.service';
import { ProthesisVkOrder } from '@common/models/product-order/prothesis-vk-order';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from '@common/services/toasts.service';
import { ProductStatus } from '@modules/common/enums/product-status.enum';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormUtils } from '@common/utils/form';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { BehaviorSubject } from 'rxjs';
import { ProtezNkInfo } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/protez-nk-info/protez-nk-info.interface';
import {ProthesisNkOrderUpdate} from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/prothesis-nk-order-update.interface';
import {EMPTY_NK} from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/protez-nk-order-detail/protez-nk-order-short.const';

@Component({
  selector: 'sl-protez-nk-order-short',
  templateUrl: './protez-nk-order-short.component.html',
  styleUrls: ['./protez-nk-order-short.component.less'],
})
export class ProtezNkOrderShortComponent implements OnInit {
  @Input() measurement;
  @Input() device: ProthesisVkOrder;
  @Input() visitsManager: VisitsManager;

  @ViewChildren(FormControlName) controls: QueryList<FormControlName>;

  public form: FormGroup = this._fb.group({
    info: [{}],
    model3d: false,
    htv: false,
    lamination: false,
    cosmeticCladding: false,
  });
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private _modal: NzModalRef,
    private _fb: FormBuilder,
    private productOrderService: ProductOrderService,
    private messageService: ToastsService,
  ) {}

  public ngOnInit() {
    this.form.patchValue({
      info: {
        name: this.device.name,
      },
    });
  }

  public closeForm(): void {
    this._modal.destroy();
  }

  public save(): void {
    this.controls.forEach((control) => {
      if (control.valueAccessor instanceof FormValueAccessor) {
        (<FormValueAccessor>control.valueAccessor).markAsDirty();
      }
    });

    FormUtils.markAsDirty(this.form);

    if (this.form.valid) {
      this.loading$.next(true);

      const { model3d, htv, lamination, cosmeticCladding } = this.form.value;

      const info: ProtezNkInfo = this.form.get('info').value;

      const createOrder: ProthesisNkOrderUpdate = {
        ...EMPTY_NK,
        name: info.name,
        dateOfIssue: info.dateOfIssue,
        generalStatus: ProductStatus.MAKING,
        branchId: info.branch.id,
        dateSendingToBranch: info.dateSendingToBranch,
        guarantee: info.guarantee,
        prothesisFastening: info.prothesisFastening,
        sleeveMaterial: info.sleeveMaterial,
        prothesisParts: info.prothesisParts,
        prothesisNkMeasurement: this.measurement,
        model3d: +model3d,
        htv: +htv,
        lamination: +lamination,
        cosmeticCladding: +cosmeticCladding,
      };

      this.productOrderService.updateNk(this.device.id, createOrder)
        .subscribe(
          (deviceData) => {
            this.messageService.success('Бланк заказа протеза НК успешно создан!', { nzDuration: 3000 });
            this._modal.destroy(deviceData);
          },
          error => this.onError(error),
        );
    }
  }

  private onError(response: HttpErrorResponse) {
    const { errors } = response.error;
    let message = 'Произошла ошибка';

    this.loading$.next(false);

    if (errors != null && errors.length > 0) {
      message = errors[0];
    }

    this.messageService.error(message, { nzDuration: 3000 });
  }
}
