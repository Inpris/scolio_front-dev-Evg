import { Component, OnDestroy, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductStatus } from '@modules/common/enums/product-status.enum';
import { ProductOrderService } from '@common/services/product-order.service';
import { ToastsService } from '@common/services/toasts.service';
import { Subject } from 'rxjs/Subject';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { OrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/model/order-detail-component';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormUtils } from '@common/utils/form';
import { ProthesisNkOrderUpdate, ProthesisNksResponse } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/prothesis-nk-order-update.interface';
import {map, takeUntil} from 'rxjs/operators';
import {
  FORM_VALUE,
  FULL_SCHEMA,
  INFO_CONTROL_VALUE, MANUFACTURING_DATA, MANUFACTURING_PROGRESS,
  MEASUREMENT_FORM,
} from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/protez-nk-order-detail/protez-nk-order-short.const';
import { Schema } from '@modules/patients/patient/patient-visits/visit-meansurements/common/order-manufacturing/order-manufacturing.component';
import { Contact } from '@common/models/contact';
import { ContactsService } from '@common/services/contacts';
import { OrderHelper } from '@modules/patients/patient/patient-visits/visit-meansurements/helpers/order-helper';
import {UsersService} from '@common/services/users';

@Component({
  selector: 'sl-protez-nk-order-detail',
  templateUrl: './protez-nk-order-detail.component.html',
  styleUrls: ['./protez-nk-order-detail.component.less'],
})
export class ProtezNkOrderDetailComponent extends OrderDetailComponent implements OnInit, OnDestroy {
  public schema = null;
  public contact: Contact;
  public manufacturingProgress: { [key: string]: boolean } = MANUFACTURING_PROGRESS;
  public manufacturingData = this._fb.control(MANUFACTURING_DATA);
  public form: FormGroup = this._fb.group(FORM_VALUE);
  public measurementForm = this._fb.group(MEASUREMENT_FORM);
  public infoControl: FormControl = this._fb.control(INFO_CONTROL_VALUE);
  public issueControl: FormControl = this._fb.control({});
  public users: Map<string, { id: string; name: string; }> = new Map();

  private destroyed$ = new Subject();

  @Input() public visitsManager: VisitsManager;

  constructor(
    public modal: NzModalRef,
    public messageService: ToastsService,
    private _fb: FormBuilder,
    private _cd: ChangeDetectorRef,
    private _productOrderService: ProductOrderService,
    private _contactService: ContactsService,
    private _usersService: UsersService,
  ) {
    super();
  }

  public ngOnInit() {
    this._loadUsers();
  }

  public ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public getCurrentStep() {
    return OrderHelper.getCurrentStep(this.form.value.generalStatus) - 1;
  }

  public save(): void {
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

    const value = {
      ...this.form.value,
      ...this.infoControl.value,
      ...this.manufacturingData.value,
      issuer1: this.issueControl.value.issuer1,
      issuer2: this.issueControl.value.issuer2,
      generalStatus: this.form.value.generalStatus,
    };

    const branchId = value.branch.id;

    delete value.branch;
    delete value.productType;
    delete value.productType;

    const savedValue: ProthesisNkOrderUpdate = {
      ...value,
      branchId,
      prothesisNkMeasurement: this.measurementForm.value,
      ...this._saveManufacturingData(value),
    };

    delete savedValue.issuer1;
    delete savedValue.issuer2;
    delete value.model3DExecutor1;
    delete value.model3DExecutor2;

    this._productOrderService.updateNk(this.device.id, savedValue)
      .subscribe(
        (order) => {
          this.messageService.success('Бланк заказа протеза НК успешно сохранён!', { nzDuration: 3000 });
          this.modal.destroy(order);
        },
        error => this.onError(error),
      );
  }

  public openPrintOrder(): void {
    if (this.contact && this.device && this.visitsManager.selected) {
      window.open(`${window.location.protocol}//${window.location.host}/patients/${this.contact.id}/visits/${this.visitsManager.selected.id}/${this.device.id}/prothesis-nk/print`,
        '_blank', 'noopener, resizable=true,scrollbars,status, modal = no');
    }
  }

  public deviceControlledEventHandler(val) {
    this.issueVisible = true;
    this.form.patchValue({
      generalStatus: ProductStatus.READY,
    });
  }

  public deviceIssuedEventHandler(val) {
    this.form.patchValue({
      generalStatus: ProductStatus.GIVEN,
    });
  }

  private _loadUsers(): void {
    if (this._usersService.users$.value) {
      const users = this._usersService.users$.value.data.map(user => ({ id: user.id, name: user.abbreviatedName }));
      const usersMap = new Map();

      users.forEach((user: { id: string, name: string }) => usersMap.set(user.id, user));
      this.users = usersMap;

      this._loadInfo();
      this._addGeneralStatusListener();
      this._loadContact();
    } else {
      this._usersService.getList({ pageSize: 1000 })
        .subscribe((response) => {
          const users = response.data.map(user => ({ id: user.id, name: user.abbreviatedName }));
          const usersMap = new Map();

          users.forEach((user: { id: string, name: string }) => usersMap.set(user.id, user));
          this.users = usersMap;

          this._loadInfo();
          this._addGeneralStatusListener();
          this._loadContact();
        });
    }
  }

  private _loadInfo(): void {
    this._productOrderService.getNk(this.device.id)
      .pipe(
        map((productOrder: ProthesisNksResponse) => this._prepareManufacturingData(productOrder)),
      )
      .subscribe(
        (productOrder: ProthesisNksResponse) => {
          this.form.patchValue(productOrder);
          this.infoControl.patchValue(productOrder);
          this.manufacturingData.patchValue(productOrder);
          this.measurementForm.patchValue(productOrder.prothesisNkMeasurement);
          this.issueControl.patchValue(productOrder);
          this._filterManufacturingOptions();
          this.isImported = !!productOrder.isImported;
        },
        error => this.onError(error),
        () => {
          this.isBusy = false;
          this._cd.detectChanges();
        },
      );
  }

  private _loadContact(): void {
    this._contactService.getById(this.visitsManager.patientId)
      .subscribe(response => this.contact = response);
  }

  private _addGeneralStatusListener(): void {
    this.form.get('generalStatus').valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((step) => {
        this.currentStep = this.getCurrentStep();
        this.issueVisible = step === ProductStatus.READY || step === ProductStatus.GIVEN;
      });
  }

  private _filterManufacturingOptions(): void {
    const value: Record<string, boolean> = {
      model3d: this.form.get('model3d').value,
      htv: this.form.get('htv').value,
      lamination: this.form.get('lamination').value,
      cosmeticCladding: this.form.get('cosmeticCladding').value,
    };

    let validFields: any = ['blocking', 'firstFitting', 'assembly', 'secondFitting', 'delivery'];

    value.model3d ? validFields.push(['model3d', 'createModel3d']) : validFields.push(['impressionTaking', 'impressionProcess']);

    if (value.htv) {
      validFields.push(['htv']);
    }

    if (value.lamination) {
      validFields.push(['lamination', 'thirdFitting']);
    }

    if (value.cosmeticCladding) {
      validFields.push(['productionCosmeticCladding']);
    }

    validFields = validFields.flat();

    this.schema = [...FULL_SCHEMA].filter((item: Schema) => validFields.includes(item.field));

    this._cd.detectChanges();

    this._addManufacturingDataListener();
  }

  private _addManufacturingDataListener(): void {
    this.manufacturingData.valueChanges
      .pipe(takeUntil(this.destroyed$))
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

  private _saveManufacturingData(productOrder: any): any {
    return {
      assemblyExecutor1: productOrder.assemblyExecutor1 ? productOrder.assemblyExecutor1.id : null,
      assemblyExecutor2: productOrder.assemblyExecutor2 ? productOrder.assemblyExecutor2.id : null,
      assemblyStatus: productOrder.assemblyStatus === ProductOperationStatus.DONE ? 1 : 0,

      blockingExecutor1: productOrder.blockingExecutor1 ? productOrder.blockingExecutor1.id : null,
      blockingExecutor2: productOrder.blockingExecutor2 ? productOrder.blockingExecutor2.id : null,
      blockingStatus: productOrder.blockingStatus === ProductOperationStatus.DONE ? 1 : 0,

      deliveryExecutor1: productOrder.deliveryExecutor1 ? productOrder.deliveryExecutor1.id : null,
      deliveryExecutor2: productOrder.deliveryExecutor2 ? productOrder.deliveryExecutor2.id : null,
      deliveryStatus: productOrder.deliveryStatus === ProductOperationStatus.DONE ? 1 : 0,

      firstFittingExecutor1: productOrder.firstFittingExecutor1 ? productOrder.firstFittingExecutor1.id : null,
      firstFittingExecutor2: productOrder.firstFittingExecutor2 ? productOrder.firstFittingExecutor2.id : null,
      firstFittingStatus: productOrder.firstFittingStatus === ProductOperationStatus.DONE ? 1 : 0,

      htvExecutor1: productOrder.htvExecutor1 ? productOrder.htvExecutor1.id : null,
      htvExecutor2: productOrder.htvExecutor2 ? productOrder.htvExecutor2.id : null,
      htvStatus: productOrder.htvStatus === ProductOperationStatus.DONE ? 1 : 0,

      impressionTakingExecutor1: productOrder.impressionTakingExecutor1 ? productOrder.impressionTakingExecutor1.id : null,
      impressionTakingExecutor2: productOrder.impressionTakingExecutor2 ? productOrder.impressionTakingExecutor2.id : null,
      impressionTakingStatus: productOrder.impressionTakingStatus === ProductOperationStatus.DONE ? 1 : 0,

      laminationExecutor1: productOrder.laminationExecutor1 ? productOrder.laminationExecutor1.id : null,
      laminationExecutor2: productOrder.laminationExecutor2 ? productOrder.laminationExecutor2.id : null,
      laminationStatus: productOrder.laminationStatus === ProductOperationStatus.DONE ? 1 : 0,

      model3dExecutor1Nk: productOrder.model3dExecutor1 ? productOrder.model3dExecutor1.id : null,
      model3dExecutor2Nk: productOrder.model3dExecutor2 ? productOrder.model3dExecutor2.id : null,
      model3dStatus: productOrder.model3dStatus === ProductOperationStatus.DONE ? 1 : 0,

      productionCosmeticCladdingExecutor1: productOrder.productionCosmeticCladdingExecutor1 ? productOrder.productionCosmeticCladdingExecutor1.id : null,
      productionCosmeticCladdingExecutor2: productOrder.productionCosmeticCladdingExecutor2 ? productOrder.productionCosmeticCladdingExecutor2.id : null,
      productionCosmeticCladdingStatus: productOrder.productionCosmeticCladdingStatus === ProductOperationStatus.DONE ? 1 : 0,

      secondFittingExecutor1: productOrder.secondFittingExecutor1 ? productOrder.secondFittingExecutor1.id : null,
      secondFittingExecutor2: productOrder.secondFittingExecutor2 ? productOrder.secondFittingExecutor2.id : null,
      secondFittingStatus: productOrder.secondFittingStatus === ProductOperationStatus.DONE ? 1 : 0,

      thirdFittingExecutor1: productOrder.thirdFittingExecutor1 ? productOrder.thirdFittingExecutor1.id : null,
      thirdFittingExecutor2: productOrder.thirdFittingExecutor2 ? productOrder.thirdFittingExecutor2.id : null,
      thirdFittingStatus: productOrder.thirdFittingStatus === ProductOperationStatus.DONE ? 1 : 0,

      createModel3dExecutor1: productOrder.createModel3dExecutor1 ? productOrder.createModel3dExecutor1.id : null,
      createModel3dExecutor2: productOrder.createModel3dExecutor2 ? productOrder.createModel3dExecutor2.id : null,
      createModel3dStatus: productOrder.createModel3dStatus === ProductOperationStatus.DONE ? 1 : 0,

      impressionProcessingExecutor1: productOrder.impressionProcessingExecutor1 ? productOrder.impressionProcessingExecutor1.id : null,
      impressionProcessingExecutor2: productOrder.impressionProcessingExecutor2 ? productOrder.impressionProcessingExecutor2.id : null,
      impressionProcessingStatus: productOrder.impressionProcessingStatus === ProductOperationStatus.DONE ? 1 : 0,

      issuer1Id: productOrder.issuer1 ? productOrder.issuer1.id : null,
      issuer2Id: productOrder.issuer2 ? productOrder.issuer2.id : null,

      controlledById: productOrder.controlledBy ? productOrder.controlledBy.id : null,
    };
  }

  private _prepareManufacturingData(productOrder: any): any {
    const data = {
      assemblyExecutor1: productOrder.assemblyExecutor1 ?
        this.users.get(productOrder.assemblyExecutor1) : null,
      assemblyExecutor2: productOrder.assemblyExecutor2 ?
        this.users.get(productOrder.assemblyExecutor2) : null,
      assemblyStatus: productOrder.assemblyStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      blockingExecutor1: productOrder.blockingExecutor1 ?
        this.users.get(productOrder.blockingExecutor1) : null,
      blockingExecutor2: productOrder.blockingExecutor2 ?
        this.users.get(productOrder.blockingExecutor2) : null,
      blockingStatus: productOrder.blockingStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      deliveryExecutor1: productOrder.deliveryExecutor1 ?
        this.users.get(productOrder.deliveryExecutor1) : null,
      deliveryExecutor2: productOrder.deliveryExecutor2 ?
        this.users.get(productOrder.deliveryExecutor2) : null,
      deliveryStatus: productOrder.deliveryStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      firstFittingExecutor1: productOrder.firstFittingExecutor1 ?
        this.users.get(productOrder.firstFittingExecutor1) : null,
      firstFittingExecutor2: productOrder.firstFittingExecutor2 ?
        this.users.get(productOrder.firstFittingExecutor2) : null,
      firstFittingStatus: productOrder.firstFittingStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      htvExecutor1: productOrder.htvExecutor1 ?
        this.users.get(productOrder.htvExecutor1) : null,
      htvExecutor2: productOrder.htvExecutor2 ?
        this.users.get(productOrder.htvExecutor2) : null,
      htvStatus: productOrder.htvStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      impressionTakingExecutor1: productOrder.impressionTakingExecutor1 ?
        this.users.get(productOrder.impressionTakingExecutor1) : null,
      impressionTakingExecutor2: productOrder.impressionTakingExecutor2 ?
        this.users.get(productOrder.impressionTakingExecutor2) : null,
      impressionTakingStatus: productOrder.impressionTakingStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      laminationExecutor1: productOrder.laminationExecutor1 ?
        this.users.get(productOrder.laminationExecutor1) : null,
      laminationExecutor2: productOrder.laminationExecutor2 ?
        this.users.get(productOrder.laminationExecutor2) : null,
      laminationStatus: productOrder.laminationStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      model3dExecutor1: productOrder.model3dExecutor1 ?
        this.users.get(productOrder.model3dExecutor1) : null,
      model3dExecutor2: productOrder.model3dExecutor2 ?
        this.users.get(productOrder.model3dExecutor2) : null,
      model3dStatus: productOrder.model3dStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      productionCosmeticCladdingExecutor1: productOrder.productionCosmeticCladdingExecutor1 ?
        this.users.get(productOrder.productionCosmeticCladdingExecutor1) : null,
      productionCosmeticCladdingExecutor2: productOrder.productionCosmeticCladdingExecutor2 ?
        this.users.get(productOrder.productionCosmeticCladdingExecutor2) : null,
      productionCosmeticCladdingStatus: productOrder.productionCosmeticCladdingStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      secondFittingExecutor1: productOrder.secondFittingExecutor1 ?
        this.users.get(productOrder.secondFittingExecutor1) : null,
      secondFittingExecutor2: productOrder.secondFittingExecutor2 ?
        this.users.get(productOrder.secondFittingExecutor2) : null,
      secondFittingStatus: productOrder.secondFittingStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      thirdFittingExecutor1: productOrder.thirdFittingExecutor1 ?
        this.users.get(productOrder.thirdFittingExecutor1) : null,
      thirdFittingExecutor2: productOrder.thirdFittingExecutor2 ?
        this.users.get(productOrder.thirdFittingExecutor2) : null,
      thirdFittingStatus: productOrder.thirdFittingStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      createModel3dExecutor1: productOrder.createModel3dExecutor1 ?
        this.users.get(productOrder.createModel3dExecutor1) : null,
      createModel3dExecutor2: productOrder.createModel3dExecutor2 ?
        this.users.get(productOrder.createModel3dExecutor2) : null,
      createModel3dStatus: productOrder.createModel3dStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,

      impressionProcessingExecutor1: productOrder.impressionProcessingExecutor1 ?
        this.users.get(productOrder.impressionProcessingExecutor1) : null,
      impressionProcessingExecutor2: productOrder.impressionProcessingExecutor2 ?
        this.users.get(productOrder.impressionProcessingExecutor2) : null,
      impressionProcessingStatus: productOrder.impressionProcessingStatus === 1 ? ProductOperationStatus.DONE : ProductOperationStatus.WAITING,
    };

    return {
      ...productOrder,
      ...data,
    };
  }
}
