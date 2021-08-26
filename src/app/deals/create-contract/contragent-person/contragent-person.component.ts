import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { ContactsService, Contact } from '@common/services/contacts';
import { PatientService } from '@common/services/patient.service';
import { CommunicationTypesService } from '@common/services/communication-types';
import { StringCustomValidators } from '@common/validators/string-custom-valid';
import { notRequiredEmailValidator } from '@common/validators/email';
import { Subject } from 'rxjs/Subject';
import { PassportValidator } from '@common/validators/passport-validator';

@Component({
  selector: 'sl-contragent-person',
  templateUrl: './contragent-person.component.html',
  styleUrls: ['./contragent-person.component.less'],
  providers: [
    ...FormValueAccessor.getAccessorProviders(ContragentPersonComponent),
    CommunicationTypesService,
  ],
})
export class ContragentPersonComponent extends FormValueAccessor implements OnInit {

  genderDictionary = [{ id: 0, name: 'Мужской' }, { id: 1, name: 'Женский' }];
  communicationTypes: { [key: string]: string } = {};
  communicationValidators: { [key: string]: ValidatorFn | ValidatorFn[] } = {
    email: [notRequiredEmailValidator],
    phone: [Validators.required],
  };

  @Input() isEditMode: boolean;
  @Input() isContract: boolean;
  @Input() patientId: string;
  @Output() selectedRepresentative = new EventEmitter<any>();

  lastNameVisible = false;
  $contractSearch = new Subject<any>();
  @ViewChild('contactsModalContent')
  private contactsModalContent: any;
  contacts: Contact[];
  contactCount: number;
  modalContacts: NzModalRef;
  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.closeAllPopap();
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private communicationTypesService: CommunicationTypesService,
    private contactsService: ContactsService,
    private patientService: PatientService,
    private modalService: NzModalService,
  ) {
    super();
    this.form = fb.group({
      address: this.fb.group({
        region: [null],
        city: [null],
        street: [null],
        house: [null],
        flat: [null],
      }),
      passport: fb.group({
        serialNumber: [null],
        issueDate: [null],
        issueBy: [null],
      }, { validator: PassportValidator.required }),
      firstName: [null, StringCustomValidators.required],
      secondName: [null],
      lastName: [null, StringCustomValidators.required],
      birthDate: [null],
      gender: [null, Validators.required],
      phone: [null],
      email: [null, notRequiredEmailValidator],
      communications: fb.array([]),
      comment: [null],
      patientAffiliation: [null],
      defaultAgent: [false],
    });
    this.communicationTypesService.getList()
      .subscribe((responses) => {
        this.communicationTypes = responses
          .reduce((types, type) => {
            types[type.sysName.toLowerCase()] = type.id;
            return types;
          }, {});
      });
  }

  ngOnInit() {
    super.ngOnInit();
    this.$contractSearch
      .debounceTime(500)
      .filter(data => data.value && data.value.length >= 3)
      .subscribe(({ value, field }) => {
        this.showEqualUsers(field, value);
      });
  }

  public writeValue(obj) {
    let formData;
    if (!obj) {
      formData = {
        ...Object.keys(this.form.controls)
          .reduce((form, key) => Object.assign(form, { [key]: null }), {}),
      };
    } else {
      formData = { ...obj, communications: [] };
    }
    this.form.patchValue(formData);
    ((obj || {}).communications || []).forEach(communication =>
      (<FormArray>this.form.get('communications')).push(
      this.fb.group({
        name: [communication.name, [Validators.required]],
        communicationTypeId: [communication.communicationType.id],
        value: [communication.value, this.communicationValidators[communication.communicationType.sysName.toLowerCase()]],
        comment: [communication.comment],
      } as any)));
    this.markForCheck();
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  addContactRow(communicationType: string) {
    (<FormArray>this.form.get('communications'))
      .push(this.fb.group({
        name: [null, Validators.required],
        communicationTypeId: [this.communicationTypes[communicationType]],
        value: [null, this.communicationValidators[communicationType]],
        comment: [null],
      }));
  }

  searchContacts(field, event) {
    if (this.isEditMode || this.isContract) {
      return;
    }
    this.closeAllPopap();
    const value = event.target.value;
    this.$contractSearch.next({ value, field });
  }

  private showEqualUsers(type, value) {
    let params = { [type]: value };
    if (value.length < 3) {
      this.closeAllPopap();
      return;
    }

    let paginParams = null;
    if (type === 'lastName') {
      paginParams = this.getFullName();
      params = null;
    }

    this.contactsService.getList(
      { ...paginParams, pageSize: 500 },
      { ...params },
    )
      .subscribe((response) => {
        if (response.data.length > 0) {
          this[`${type}Visible`] = true;
          this.contacts = response.data;
          this.contactCount = response.data.length;
        }
      }, (err) => {
        console.dir(err);
      });
  }

  getFullName() {
    const lastName = this.form.get('lastName').value;
    const firstName = this.form.get('firstName').value;
    const searchTerm = `${lastName ? lastName : ''} ${firstName ? firstName : ''}`;
    return { searchTerm, pageSize: 5 };
  }

  closeAllPopap() {
    this.lastNameVisible = false;
  }

  openModalContacts() {
    this.modalContacts = this.modalService.create({
      nzTitle: null,
      nzZIndex: 1220,
      nzMaskClosable: false,
      nzContent: this.contactsModalContent,
      nzFooter: null,
      nzWidth: '800px',
    });
  }

  closeModalContacts(contactId) {
    this.modalContacts.close();
    if (contactId) {
      this.contacts.some((contact: Contact) => {
        if (contactId === contact.id) {
          const data = this.patientService.toUpdateRequestRepresentative(contact);
          this.writeValue(data);
          this.selectedRepresentative.emit(data);
          return true;
        }
      });
    }
  }

  onContactChange(contact) {
    if (contact) {
      this.form.patchValue({
        ...contact,
        passport: contact.passport || {
          serialNumber: null,
          issueDate: null,
          issueBy: null,
        }, selected: contact,
      });
      this.selectedRepresentative.emit(contact);
    } else {
      this.form.reset();
    }
  }
}
