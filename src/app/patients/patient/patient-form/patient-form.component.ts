import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '@common/utils/form';
import { ContactsService } from '@common/services/contacts';
import { Contact, ContactCreate } from '@common/models/contact';
import { Subject } from 'rxjs/Subject';
import { LeadSourcesService } from '@common/services/lead-sources';
import { Service } from '@common/models/service';
import { LeadSource, LeadSourceSysName } from '@common/interfaces/Lead-source';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { extract } from '@common/utils/object';
import { ContactTypeSysNames } from '@common/models/contact-types';
import { HttpErrorResponse } from '@angular/common/http';
import { UsersService } from '@common/services/users';
import { User } from '@common/interfaces/User';
import { CommunicationTypesService } from '@common/services/communication-types';
import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AuthService } from '@common/services/auth';
import { StringCustomValidators } from '@common/validators/string-custom-valid';
import { notRequiredEmailValidator } from '@common/validators/email';
import { ToastsService } from '@common/services/toasts.service';
import { DateUtils } from '@common/utils/date';
import { ConsentToTreatmentService } from '@common/services/consent-to-treatment.service';
import { FilesService } from '@common/services/file.service';
import {Router} from "@angular/router";
import {AccessesDataService} from "@common/services/accesses-data.service";

@Component({
  selector: 'sl-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.less'],
  providers: [CommunicationTypesService],
})
export class PatientFormComponent implements OnInit {
  @Input() formType: string; // edit or create
  @Input() fromPurchase: boolean;
  @Input() data: any;
  @Output() actionCallback = new EventEmitter();

  modalContacts: NzModalRef;
  @ViewChild('contactsModalContent')
  private contactsModalContent: any;

  form: FormGroup;
  contactData: Contact;
  templates: { template: string, name: string }[];

  phoneVisible = false;
  emailVisible = false;
  lastNameVisible = false;
  contacts: Contact[];
  contactCount: number;
  $contractSearch = new Subject<any>();
  leadSources: LeadSource[];
  communicationTypes: { [key: string]: string } = {};
  communicationValidators: { [key: string]: ValidatorFn | ValidatorFn[] } = {
    email: [notRequiredEmailValidator],
    phone: [Validators.required],
  };
  services: Service[];
  users;
  loading = true;
  public selectedContact: Contact;

  get isEditMode() {
    return this.formType === 'edit';
  }

  genderDictionary = [{ id: 0, name: 'Мужской' }, { id: 1, name: 'Женский' }];

  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.closeAllPopap();
  }

  constructor(
    private modalService: NzModalService,
    private formBuilder: FormBuilder,
    private contactsService: ContactsService,
    public leadSourcesService: LeadSourcesService,
    private messageService: ToastsService,
    public userService: UsersService,
    private authService: AuthService,
    private communicationTypesService: CommunicationTypesService,
    private templateService: ConsentToTreatmentService,
    private filesService: FilesService,
    private router: Router,
    private accessesDataService: AccessesDataService,
  ) {
    this.form = this.formBuilder.group({
      address: this.formBuilder.group({
        region: [null],
        city: [null],
        street: [null],
        house: [null],
        flat: [null],
      }),
      firstName: [null, StringCustomValidators.required],
      secondName: [null],
      lastName: [null, StringCustomValidators.required],
      phone: [null, Validators.required],
      email: [null, notRequiredEmailValidator],
      comment: [null],
      birthDate: [null],
      leadSource: [null, Validators.required],
      gender: [null, Validators.required],
      communications: this.formBuilder.array([]),
      acceptDataProcessing: [false],
      hasInvalidGroup: [null, Validators.required],
      acceptSms: [false],
      acceptOrthoses: [false],
      problemPatient: [false],
      assignedUser: [{ ...this.authService.user, name: this.authService.user.abbreviatedName }],
      registryDate: [null],
    });
    forkJoin(
      this.leadSourcesService.getList(),
      this.communicationTypesService.getList(),
      this.userService.getList({ pageSize: 500 }),
    ).subscribe((responses) => {
      let communicationTypes;
      let users;
      [this.leadSources, communicationTypes, users] = responses;
      this.users = this.userFromPaginationChunk(users);
      this.communicationTypes = communicationTypes
        .reduce((types, type) => {
          types[type.sysName.toLowerCase()] = type.id;
          return types;
        }, {});
      if (this.fromPurchase && !this.isEditMode) {
        this.form.patchValue({
          leadSource: this.leadSources.find(source => source.sysName === LeadSourceSysName.PURCHASE),
        });
      }
      this.loading = false;
    });
  }

  ngOnInit() {
    if (this.fromPurchase && this.data) {
      this.contactData = { ...this.data.contact } as Contact;
      this.form.patchValue({ registryDate: this.data.registryDate } as { [key: string]: string });
    } else {
      this.contactData = { ...this.data } as Contact;
    }
    // this.$contractSearch
    //   .debounceTime(500)
    //   .filter(data => data.value && data.value.length >= 3)
    //   .subscribe(({ value, field }) => {
    //     this.showEqualUsers(field, value);
    //   });
    if (this.formType === 'edit') {
      this.fillForm(this.contactData);
    }
    this.templateService.getList()
        .subscribe(templates => this.templates = templates);
  }

  onSelectContact(patient: any) {
    if (this.fromPurchase) {
      this.closeForm({
        data: patient,
        type: 'close'
      });

      return;
    }

    this.accessesDataService.addFormPatient.next(patient);
    this.closeForm();
    this.router.navigate(['/shedule']);
  }

  fillForm(data) {
    const {
      address,
      firstName,
      secondName,
      lastName,
      phone,
      email,
      comment,
      birthDate,
      leadSource,
      gender,
      communications = [],
      acceptDataProcessing = false,
      acceptSms = false,
      acceptOrthoses = false,
      problemPatient = false,
      assignedUser = { ...this.authService.user, name: this.authService.user.abbreviatedName },
      hasInvalidGroup,
    } = data;
    this.form.patchValue({
      address,
      firstName,
      secondName,
      lastName,
      phone,
      email,
      comment,
      birthDate,
      leadSource,
      gender,
      acceptDataProcessing,
      acceptSms,
      acceptOrthoses,
      problemPatient,
      assignedUser,
      hasInvalidGroup,
    } as any);
    communications.forEach(communication => (<FormArray>this.form.get('communications')).push(
      this.formBuilder.group({
        name: [communication.name, [Validators.required]],
        communicationTypeId: [communication.communicationType.id],
        value: [communication.value, this.communicationValidators[communication.communicationType.sysName.toLowerCase()]],
        comment: [communication.comment],
      } as any)));
  }

  public userFromPaginationChunk = response => (<User[]>response.data).map(user => ({
    id: user.id,
    name: user.abbreviatedName,
  }))

  searchContact(field, event) {
    if (this.isEditMode) {
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
      .subscribe((contacts) => {
        if (contacts.data.length > 0) {
          this[`${type}Visible`] = true;
          this.contacts = contacts.data;
          this.contactCount = contacts.data.length;
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
    this.phoneVisible = false;
    this.emailVisible = false;
    this.lastNameVisible = false;
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      FormUtils.markAsDirty(form);
      return;
    }
    this.operatePatient(form.value, form['action'] === 'next');
  }

  operatePatient(patient, nextOnSave?) {
    const contactData = { ...this.contactData, ...this.selectedContact };
    const shouldUpdateContact = this.isEditMode || this.selectedContact;
    const method = shouldUpdateContact
      ?
      this.contactsService.update.bind(this.contactsService, contactData.id)
      :
      this.contactsService.create.bind(this.contactsService);
    this.loading = true;
    method({
      ...patient,
      birthDate: patient.birthDate ? DateUtils.toISODateTimeString(patient.birthDate) : null,
      contactTypeSysNames: [ContactTypeSysNames.PATIENT],
      address: patient.address && {
        ...patient.address,
        regionId: extract(patient, 'address.region.id'),
        cityId: extract(patient, 'address.city.id'),
      },
      assignedUserId: extract(patient, 'assignedUser.id'),
      leadSourceId: extract(patient, 'leadSource.id'),
      ...shouldUpdateContact && { id: contactData.id },
    } as ContactCreate)
      .subscribe(
        (contact) => {
          const message = this.isEditMode ? 'Данные успешно обновлены' : 'Пациент успешно добавлен';
          this.messageService.info(message, { nzDuration: 3000 });
          const data = {
            data: contact,
            type: 'close',
          };
          if (nextOnSave) {
            data.type = 'nextOnSave';
            this.selectedContact = null;
            this.clearForm();
          }
          this.closeForm(data);
        },
        err => this.onError(err),
        () => this.loading = false,
      );
  }

  private onError(response: HttpErrorResponse) {
    let message = 'Произошла ошибка';
    this.loading = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      message = errors[0];
    }
    this.messageService.error(message, { nzDuration: 3000 });
  }

  public closeForm(data?) {
    const result = {
      ...data,
    } as { data, type };

    if (result.data && this.fromPurchase) {
      result.data = { ...this.data, contact: data.data };
      result.data['registryDate'] = this.form.get('registryDate').value;
    }
    this.actionCallback.emit(data && result);
  }

  private clearForm() {
    this.form.reset({
      communications: this.formBuilder.array([]),
      acceptDataProcessing: false,
      acceptSms: false,
      acceptOrthoses: false,
      problemPatient: false,
      assignedUser: {
        ...this.authService.user,
        name: this.authService.user.abbreviatedName,
      },
      ...this.fromPurchase && {
        leadSource: this.leadSources.find(source => source.sysName === LeadSourceSysName.PURCHASE),
      },
    });
  }

  // contact modal
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
          if (contact.contactTypes && contact.contactTypes.some(_contact => _contact.sysName === ContactTypeSysNames.PATIENT)) {
            const data = {
              data: contact,
              type: 'close',
            };
            this.closeForm(data);
            return true;
          }
          this.selectedContact = contact;
          this.fillForm(contact);
        }
      });
    }
  }

  removeSelectedContact() {
    this.selectedContact = null;
  }

  addContactRow(communicationType: string) {
    (<FormArray>this.form.get('communications'))
      .push(this.formBuilder.group({
        name: [null, Validators.required],
        communicationTypeId: [this.communicationTypes[communicationType]],
        value: [null, this.communicationValidators[communicationType]],
        comment: [null],
      }));
  }

  public downloadTemplate(templateName: string, fileName: string) {
    this.loading = true;
    this.templateService.getTemplate(this.contactData.id, templateName)
      .subscribe((response) => {
        const name = `${fileName}.docx`;
        this.filesService.saveFile(name, response, response.type);
      },
      error => this.onError(error),
      () => this.loading = false);
  }
}
