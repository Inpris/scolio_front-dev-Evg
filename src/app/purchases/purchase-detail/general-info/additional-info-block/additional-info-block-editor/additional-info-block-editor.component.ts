import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerDataService } from '@common/helpers/customer-data';
import { Customer } from '@common/models/customer';
import { Region } from '@common/models/region';
import { RegionService } from '@common/services/region.service';
import { City } from '@common/models/city';
import { CityService } from '@common/services/city.service';
import { FormUtils } from '@common/utils/form';
import { CustomerService } from '@common/services/customer.service';
import { InnCustomValidator } from '@common/validators/inn-custom-valid';
import { PhoneValidator } from '@common/validators/phone-validator';
import { notRequiredEmailValidator } from '@common/validators/email';
import { PurchaseCreateService } from '@common/services/purchase-create.service';
import { extract } from '@common/utils/object';
import { PurchaseStore } from '@common/services/purchase.store';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { PurchaseHelper } from '@modules/purchases/purchase-detail/helpers/purchase-helper';
import { PurchaseService } from '@common/services/purchase.service';
import { Purchase } from '@common/models/purchase';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from '@common/services/toasts.service';
import { Subject } from 'rxjs/Subject';
import { Eis } from '@common/models/eis';
import { Observable } from 'rxjs/Observable';
import { PurchaseResponsible } from '@common/models/purchase-responsible';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'sl-additional-info-block-editor',
  templateUrl: './additional-info-block-editor.component.html',
  styleUrls: ['./additional-info-block-editor.component.less'],
})
export class AdditionalInfoBlockEditorComponent implements OnInit, OnDestroy, OnChanges {
  @Input() componentType: string; // edit of create
  @Input() eis: Eis;
  @Output() changeMode = new EventEmitter<any>();
  @Output() changeResponsible = new EventEmitter<PurchaseResponsible>();
  additionalInfoForm: FormGroup;
  customerData: Customer;
  regionList: Region[];
  regionLoading = true;
  cityList: City[];
  cityLoading = true;
  customerList: Customer[] = [];
  public isBusy = false;
  private unsubscriber$ = new Subject();

  @ViewChild('innInput') innInput: ElementRef;
  @ViewChild('auto') auto;
  @ViewChild('formEl') formEl: ElementRef;

  constructor(
    private fb: FormBuilder,
    private customerDataService: CustomerDataService,
    private regionService: RegionService,
    private cityService: CityService,
    private purchaseCreateService: PurchaseCreateService,
    private customerService: CustomerService,
    private purchaseStore: PurchaseStore,
    private purchaseService: PurchaseService,
    private toastsService: ToastsService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.setFormType();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eis && changes.eis.currentValue) {
      const eis: Eis = changes.eis.currentValue;
      const params = { inn: eis.purchaseCompanyINN };
      this.additionalInfoForm.patchValue({
        tenderDepartmentContact: {
          fullName: eis.responsibleUserFio,
          phone: eis.responsibleUserPhone,
          email: eis.responsibleUserEmail,
        },
        diffHours: eis.diffHours,
      });
      this.customerService.get(params).subscribe((customer) => {
        let typeEvent = 'post';
        this.customerData = this._getEmptyCustomer();

        if (customer && customer.data && customer.data[0]) {
          typeEvent = 'put';
          this.customerData = customer.data[0];
          this.additionalInfoForm.value.id = customer.data[0].id;
        }
        this.updateCustomerDataFromEis(eis);
        const data = {
          typeEvent,
          data: this.getCustomerUpdateModel(),
        };
        this.changeMode.emit(data);
      }, (err) => {
        console.dir(err);
      });
    }
  }

  updateCustomerDataFromEis(eis: Eis) {
    Observable.forkJoin(
      eis.purchaseCompanyRegion
        ? this.regionService.getList({ filter: eis.purchaseCompanyRegion }).map(response => response.data)
        : Observable.of([]),
      eis.purchaseCompanyCity
        ? this.cityService.getList({ filter: eis.purchaseCompanyCity }).map(response => response.data)
        : Observable.of([]),
    )
      .subscribe((data: [Region[], City[]]) => {
        this.regionList = data[0];
        this.cityList = data[1];
        const regionId = this.regionList && this.regionList[0] ? this.regionList[0].id : null;
        const cityId = this.cityList && this.cityList[0] ? this.cityList[0].id : null;
        this.additionalInfoForm.patchValue({
          company: {
            regionId,
            cityId,
            inn: eis.purchaseCompanyINN,
            name: eis.purchaseCompanyName,
            address: eis.purchaseCompanyAddress,
          },
        });
        this.customerData = Object.assign(this.customerData, {
          company: {
            regionId,
            cityId,
            inn: eis.purchaseCompanyINN,
            name: eis.purchaseCompanyName,
            address: eis.purchaseCompanyAddress,
          },
        });
        this.innInput.nativeElement.value = eis.purchaseCompanyINN;
      });
  }

  private setFormType() {
    switch (this.componentType) {
      case 'create':
        this.subscribeClick(false);
        break;
      case 'edit':
        this.subscribeClick(true);
        this.customerData = this.customerDataService.data;
        this.fillForm();
        break;
    }
  }

  private subscribeClick(isEdit: boolean) {
    const subj = this.purchaseCreateService.getSubject();
    subj.takeUntil(this.unsubscriber$).subscribe((_) => {
      if (isEdit) {
        return this.onSubmit(this.additionalInfoForm);
      }
      this.createCustomer();
    });
  }

  private fillForm() {
    const {
      company,
      director,
      tenderDepartmentContact,
      tsrDepartmentContact,
      diffHours,
      comment,
      warningText,
      isStacionar,
    } = this.customerData;

    if (company.region) {
      this.regionList = [company.region];
    }
    if (company.city) {
      this.cityList = [company.city];
    }

    this.additionalInfoForm.patchValue({
      director,
      tenderDepartmentContact,
      tsrDepartmentContact,
      diffHours,
      comment,
      warningText,
      isStacionar,
      company: {
        inn: company.inn,
        name: company.name,
        address: company.address,
        regionId: company.region ? company.region.id : null,
        cityId: company.city ? company.city.id : null,
      },
    });
    // хак, разобраться почему не устанавливается значение в инпут 'inn',
    // после this.form.patchValue (связано с nz-autocomplete)
    this.innInput.nativeElement.value = company.inn;
  }

  initForm() {
    this.additionalInfoForm = this.fb.group({
      company: this.fb.group({
        inn: [null, [InnCustomValidator.required]],
        name: [null, [Validators.required]],
        regionId: [null, [Validators.required]],
        cityId: [null],
        address: this.fb.control(null),
      }),
      director: this.fb.group({
        fullName: this.fb.control(null),
        phone: [null, [PhoneValidator.validValueOrEmpty]],
        email: [null, notRequiredEmailValidator],
      }),
      tenderDepartmentContact: this.fb.group({
        fullName: this.fb.control(null),
        phone: [null, [PhoneValidator.validValueOrEmpty]],
        email: [null, notRequiredEmailValidator],
      }),
      tsrDepartmentContact: this.fb.group({
        fullName: this.fb.control(null),
        phone: [null, [PhoneValidator.validValueOrEmpty]],
        email: [null, notRequiredEmailValidator],
      }),
      diffHours: [0, [Validators.required]],
      comment: this.fb.control(null),
      warningText: this.fb.control(null),
      isStacionar: this.fb.control(false),
    });
  }

  selectionChange() {
    const index = this.auto.activeItemIndex;
    this.customerData = this.customerList[index];
    this.fillForm();
  }

  onSearchInn(value: string): void {
    this.customerData = null;
    if (!value || value && value.length < 3) {
      this.customerList = null;
      return;
    }
    this.getCustomerList(value);
  }

  private getCustomerList(value) {
    const params = { inn: value };
    this.customerService.get(params)
      .subscribe((data) => {
        this.customerList = data.data;
      });
  }

  onSearch(value: string, type: string): void {
    if (!value || value && value.length < 3) {
      this[`${type}List`] = null;
      return;
    }
    this[`${type}Loading`] = true;
    this.getList(value, type);
  }

  private getList(value: string, type: string) {
    const params = { filter: value };
    this[`${type}Service`].getList(params)
      .subscribe((data) => {
        this[`${type}Loading`] = false;
        this[`${type}List`] = data.data;
      });
  }

  getCustomerUpdateModel() {
    const customer = this.customerData
      || this.customerList
        .find(
          _customer => _customer.company
            && _customer.company.inn === `${this.additionalInfoForm.value.company.inn}`,
        );
    const customerUpdateModel = { ...this.additionalInfoForm.value, id: customer ? customer.id : null };
    customerUpdateModel.company.id = extract(customer, 'company.id');
    customerUpdateModel.director.id = extract(customer, 'director.id');
    customerUpdateModel.tenderDepartmentContact.id = extract(customer, 'tenderDepartmentContact.id');
    customerUpdateModel.tsrDepartmentContact.id = extract(customer, 'tsrDepartmentContact.id');
    return customerUpdateModel;
  }

  private createCustomer() {
    if (this.additionalInfoForm.invalid) {
      this.updateFormState();
      return;
    }
    this.checkOnCustomer();
  }

  private updateFormState() {
    FormUtils.markAsDirty(this.additionalInfoForm);
    const event = new Event('purchaseCreateScroll');
    this.formEl.nativeElement.dispatchEvent(event);
  }

  private checkOnCustomer() {
    // проверка на существование заказчика с таким инн в базе
    const formValue = this.additionalInfoForm.value;
    const params = { inn: formValue.company.inn };

    this.customerService.get(params).subscribe((customer) => {
      let typeEvent = 'post';
      if (customer && customer.data && customer.data[0]) {
        typeEvent = 'put';
        formValue.id = customer.data[0].id;
      }
      const data = {
        typeEvent,
        data: this.getCustomerUpdateModel(),
      };
      this.changeMode.emit(data);
    }, (err) => {
      console.dir(err);
    });
  }

  saveData() {
    if (this.additionalInfoForm.invalid) {
      this.updateFormState();
      return;
    }
    const customerUpdateModel = this.getCustomerUpdateModel();
    this.isBusy = true;
    const request = customerUpdateModel.id
      ? this.customerDataService.update(customerUpdateModel.id, customerUpdateModel)
      : this.customerDataService.create(customerUpdateModel);
    forkJoin(
      this.purchaseStore.getState().take(1),
      request,
    )
      .switchMap(
        (response) => {
          const [purchase, customer] = response;
          if (!purchase.customer || purchase.customer.id !== customer.id) {
            return this.purchaseService.update(purchase.id, PurchaseHelper.getPurchaseModel({ ...purchase, customer }));
          }
          return of({ ...purchase, customer });
        },
      ).subscribe(
      (purchase: Purchase) => {
        this.purchaseStore.updateState(purchase);
        this.isBusy = false;
        this.toViewMode();
        this.toastsService.onSuccess('Информация о закупке обновлена');
      },
      error => this.onError(error),
    );
  }

  toViewMode() {
    this.changeMode.emit(false);
  }

  onSubmit(form) {
    this.saveData();
  }

  private onError(response: HttpErrorResponse) {
    let message = 'Произошла ошибка';
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      message = errors[0];
    }
    this.toastsService.error(message, { nzDuration: 3000 });
  }

  private _getEmptyCustomer() {
    return {
      id: null,
      company: null,
      director: null,
      tenderDepartmentContact: null,
      tsrDepartmentContact: null,
      diffHours: null,
      comment: null,
      warningText: null,
      isStacionar: null,
      isDeleted: false,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
    };
  }
}
