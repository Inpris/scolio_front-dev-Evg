import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { Contact, ContactsService } from '@common/services/contacts';
import { PatientService } from '@common/services/patient.service';
import { CompanyService } from '@common/services/company.service';
import { ContractsService } from '@common/services/contracts.service';
import { ContractTypesService } from '@common/services/dictionaries/contract-types.service';
import { ToastsService } from '@common/services/toasts.service';
import { ContactCreate, ContactResponse } from '@common/models/contact';
import { PatientRepresentative } from '@common/models/patient-representative';
import { Company, CompanyCreate } from '@common/models/company';
import { Contract } from '@common/models/contract';
import { FormUtils } from '@common/utils/form';
import { extract } from '@common/utils/object';
import { Observable } from 'rxjs/Observable';
import {LegalEntitiesService} from "@common/services/dictionaries/legal-entities.service";
import {AuthService} from "@common/services/auth";

export interface IProductKind {
  id: string;
  productKindName: string;
}

export interface ISavedProduct {
  id: string;
  contractId: string;
  productKind: IProductKind;
  price: number;
  quantity: number;
}

@Component({
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.less'],
  providers: [ContractTypesService, LegalEntitiesService],
})
export class CreateContractComponent implements OnInit {
  @Input()
  public visitsManager: VisitsManager;
  @ViewChildren(FormControlName) controls: QueryList<FormControlName>;
  public form: FormGroup;
  public productForm: FormGroup;
  public contractId: string;
  public contact: Contact;
  public legalEntities: any[] = [];
  public legalEntity: string = '';
  public contractsTypes: any[] = [];
  public selectedRepresentative: PatientRepresentative;
  public isBusy = false;
  public fromPaginationChunk = response => response.data;
  public productKinds: IProductKind[] = [];
  public savedProducts: ISavedProduct[] = [];
  public showAddProduct: boolean = false;
  public productEdit: ISavedProduct = null;
  public formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  });
  private _legalEntities: any[] = [];

  get contragentForm() {
    const controls = this.form.controls;
    const { contragentType } = this.form.value;
    return contragentType === 'person' ? controls.contactConragent : controls.companyContragent;
  }

  get disabledContragentForm() {
    const controls = this.form.controls;
    const { contragentType } = this.form.value;
    return contragentType === 'person' ? controls.companyContragent : controls.contactConragent;
  }

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    public contractTypes: ContractTypesService,
    public legalEntitiesService: LegalEntitiesService,
    private contractsService: ContractsService,
    private contactsService: ContactsService,
    private companyService: CompanyService,
    private toastsService: ToastsService,
    private patientService: PatientService,
    private _authService: AuthService,
  ) {
    this.form = fb.group({
      contractTypeId: [null, Validators.required],
      contragentType: ['person'],
      note: [null],
      contractNumber: [null],
      contractDate: [null, Validators.required],
      expirationDate: [null],
      contactConragent: [{}],
      companyContragent: [{}],
    });

    this.productForm = fb.group({
      productKind: [null],
      price: [null],
      quantity: [1],
    });

    this.form.get('contractTypeId')
      .valueChanges
      .subscribe(v => {
        const type = this.contractsTypes.find(i => i.id === v);

        this.legalEntities = [...this._legalEntities].filter(item => type && item.id === type.legalEntityId);
        this.legalEntity = (this.legalEntities[0] && this.legalEntities[0].entityName) || '';
      });

    this.form.get('contragentType')
      .valueChanges
      .subscribe((type) => {
        if (!type) {
          this.contragentForm.disable();
          this.disabledContragentForm.disable();
        } else {
          this.contragentForm.enable();
          this.disabledContragentForm.disable();
        }
        this.form.updateValueAndValidity({ emitEvent: false });
      });
  }

  ngOnInit() {
    this.contractsService.getProducts()
      .subscribe((products: IProductKind[]) => {
        this.productKinds = products;
        this.savedProducts = this.savedProducts.map((product: any) => {
          return {
            ...product,
            productKind: products.find(p => p.id === product.productKind)
          };
        })
      });

    this.legalEntitiesService.getList(null, { pageSize: 500 })
      .subscribe((value: any) => {
        if (this.form.get('contractTypeId').value) {
          const type = this.contractsTypes.find(i => i.id === this.form.get('contractTypeId').value);

          this.legalEntities = value.data.filter(item => item.id === type.legalEntityId)[0].entityName;
          this._legalEntities = value.data;
        } else {
          this.legalEntity = '';
          this._legalEntities = value.data;
        }
      });

    this.contractTypes.getList(null, { pageSize: 500 })
      .subscribe((value: any) => {
        this.contractsTypes = value.data.filter(item => this._authService.user.branchId === item.branchId);
      });

    if (this.contractId) {
      this.isBusy = true;
      this.contractsService.get(this.contractId)
        .subscribe(
          (contract) => {
            const contragentType = extract(contract, 'contactContragent.id') === this.contact.id ?
              null
              : contract.contactContragent ? 'person' : 'company';
            this.form.patchValue({
              ...contract,
              contragentType,
              contactConragent: {
                ...contract.contactContragent,
                selected: contract.contactContragent,
                passport: (contract.contactContragent || {} as Contact).passport || {},
                address: (contract.contactContragent || {} as Contact).address || {},
              },
              companyContragent: {
                ...contract.companyContragent,
                selected: contract.companyContragent,
                proxy: (contract.companyContragent || {} as Company).proxy || {},
              },
            });
            this.isBusy = false;
            this.selectedRepresentative = this.patientService.toUpdateRequestRepresentative(contract.contactContragent);

            this.savedProducts = contract.products.map((product: any) => {
              return {
                ...product,
                productKind: this.productKinds.find(p => p.id === product.productKind)
              };
            });
          },
          (err) => {
            this.toastsService.onError(err);
            this.isBusy = false;
          },
        );
    }
  }

  public closeForm() {
    this.modal.destroy();
  }

  public addProduct(): void {
    this.showAddProduct = true;
  }

  public saveProduct(): void {
    if (this.productEdit) {
      const index = this.savedProducts.indexOf(this.productEdit);
      this.savedProducts[index] = {
        ...this.savedProducts[index],
        ...this.productForm.value,
        price: +parseFloat(this.productForm.value.price.split(' ').join('').replace(',','.')).toFixed(2)
      };
    } else {
      this.savedProducts.push({
        ...this.productForm.value,
        price: +parseFloat(this.productForm.value.price.split(' ').join('').replace(',','.')).toFixed(2)
      });
    }

    this.productForm.patchValue({
      productKind: null,
      price: null,
      quantity: 1,
    });

    this.productEdit = null;
    this.showAddProduct = false;
  }

  public cancelProduct(): void {
    this.showAddProduct = false;
    this.productForm.patchValue({
      productKind: null,
      price: null,
      quantity: 1,
    });
    this.productEdit = null;
  }

  public editProduct(item: any): void {
    this.showAddProduct = true;
    this.productForm.patchValue({
      ...item,
      price: this.formatter.format(item.price),
    });
    this.productEdit = item;
  }

  public deleteProduct(i: number): void {
    this.savedProducts.splice(i, 1);
  }

  selectedRepresentativeChange(selectedRepresentative) {
    this.selectedRepresentative = selectedRepresentative;
  }

  public onSubmit() {
    const data = {
      ...this.form.value,
      products: this.savedProducts.map((product: any) => ({
        ...product,
        productKind: product.productKind.id,
      })),
    };

    this.controls.forEach((control) => {
      if (control.valueAccessor instanceof FormValueAccessor) {
        (<FormValueAccessor>control.valueAccessor).markAsDirty();
      }
    });
    if (this.form.invalid) {
      FormUtils.markAsDirty(this.form);
      return;
    }
    this.isBusy = true;

    this.createOrUpdateContract(data).subscribe(
        (contract: Contract) => {
          this.toastsService.onSuccess(`Договор успешно ${this.contractId ? 'обновлен' : 'создан' }`);
          this.isBusy = false;
          this.modal.destroy(contract);
        },
        (err) => {
          console.error(err);
          this.isBusy = false;
        },
      );
  }

  private createOrUpdateContract(data) {
    const contragentData = {
      ...this.contragentForm.value.selected,
      ...this.contragentForm.value,
    };
    const contractAction = this.contractId ?
      this.contractsService.update.bind(this.contractsService)
      : this.contractsService.create.bind(this.contractsService);
    // Если представителя нет - то контрагент сам пациент

    if (!data.contragentType) {
      const contract = new Contract({
        ...data,
        id: this.contractId,
        contactContragent: { id: this.contact.id },
        dealId: extract(this, 'contract.dealId') || extract(this.visitsManager, 'selected.deal.id'),
      });
      return contractAction({
        ...contract.toUpdateRequest(),
        products: data.products,
      });
    }
    // Если представитель выбран из списка
    if (this.selectedRepresentative && !this.contractId) {
      return this.createOrUpdateRepresentative(new PatientRepresentative({
        ...contragentData,
      })).switchMap((representative) => {
        const contract = new Contract({
          ...data,
          id: this.contractId,
          contactContragent: { id: this.selectedRepresentative.representativeId },
          dealId: extract(this, 'contract.dealId') || extract(this.visitsManager, 'selected.deal.id'),
        });
        return contractAction({
          ...contract.toUpdateRequest(),
          products: data.products,
        });
      });
    }
    const contragentUpdate: Observable<any> = data.contragentType === 'person' ?
      this.createOrUpdateRepresentative(new PatientRepresentative({
        ...contragentData,
      }))
      : this.createOrUpdateCompany(new Company(contragentData));

    return contragentUpdate
      .flatMap(
        (contragent) => {
          const contract = new Contract({
            ...data,
            id: this.contractId,
            ...data.contragentType === 'person' ?
              { contactContragent: contragent }
              : { companyContragent: contragent },
            dealId: extract(this, 'contract.dealId') || extract(this.visitsManager, 'selected.deal.id'),
          });
          return contractAction(this.selectedRepresentative ? {
            ...contract.toUpdateRequest(true),
            products: data.products,
          } : {
            ...contract.toUpdateRequest(),
            products: data.products,
          });
        });
  }

  public createOrUpdateRepresentative(representative) {
    const selectedRepresentativeId = this.selectedRepresentative ? this.selectedRepresentative.id : null;
    const action: (representative) => Observable<PatientRepresentative> = selectedRepresentativeId ?
    this.patientService.updateRepresentative.bind(this.patientService, this.selectedRepresentative.representativeId)
    : this.patientService.createRepresentative.bind(this.patientService);
    return action({
      ...representative,
      id: this.selectedRepresentative ? this.selectedRepresentative.id : null,
      representativeId: this.selectedRepresentative ? this.selectedRepresentative.representativeId : null,
      patientId: this.contact.id,
      address: representative.address && {
        regionId: extract(representative, 'address.region.id'),
        cityId: extract(representative, 'address.city.id'),
        street: extract(representative, 'address.street'),
        house: extract(representative, 'address.house'),
        flat: extract(representative, 'address.flat'),
      },
      passport: representative.passport.serialNumber && representative.passport.issueDate && representative.passport.issueBy
      ? { ...representative.passport }
      : { serialNumber: null, issueDate: '0001-01-01T00:00:00', issueBy: null },
    });
  }

  public createOrUpdateCompany(company: Company) {
    const action: (company: CompanyCreate) => Observable<Company> = company.id ?
      this.companyService.update.bind(this.companyService)
      : this.companyService.create.bind(this.companyService);

    // Представитель компании это контакт. Требуется обновление данных контакта перед сохранением
    // Проверяем есть ли в форме id - если нет, значит создаем контакт снуля
    return (company.proxy.id ?
      this.contactsService.getById(company.proxy.id)
      : Observable.of(
        new Contact({
          ...company.proxy as ContactResponse,
          phone: company.phone,
          leadSource: this.contact.leadSource,
        })))
      .switchMap((contact) => {
        const { firstName, secondName, lastName } = company.proxy;
        return this.createOrUpdateContact(
          new Contact(
            {
              ...contact as ContactResponse,
              firstName,
              secondName,
              lastName,
            },
          ));
      })
      .switchMap(
        proxy => action(
          (new Company({ ...company, proxy } as Company)).toUpdateRequest()),
      );
  }

  public createOrUpdateContact(contact: Contact) {
    const action: (contact: ContactCreate) => Observable<Contact> = contact.id ?
      this.contactsService.update.bind(this.contactsService, contact.id)
      : this.contactsService.create.bind(this.contactsService);
    return action(contact.toUpdateRequest());
  }

}
