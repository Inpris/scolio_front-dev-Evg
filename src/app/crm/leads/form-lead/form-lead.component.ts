import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  OnDestroy,
  HostListener,
  ViewChild,
} from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { notRequiredEmailValidator } from '@common/validators/email';
import { phoneCustomValid } from '@common/validators/phone-custom-valid';
import { emailCustomValid } from '@common/validators/email-custom-valid';
import { FormUtils } from '@common/utils/form';
import { LeadSourcesService } from '@common/services/lead-sources';
import { LeadSource } from '@common/interfaces/Lead-source';

import { Service, ServicesService } from '@common/services/services';
import { LeadService } from '@common/services/lead.service';
import { LeadDataService } from '@common/helpers/lead-data';
import { LeadCreate } from '@common/interfaces/Lead-create';
import { UsersService } from '@common/services/users';
import { User } from '@common/models/user';
import { ContactsService } from '@common/services/contacts';
import { Contact } from '@common/models/contact';
import { DateUtils } from '@common/utils/date';
import { AuthService } from '@common/services/auth';

@Component({
  selector: 'sl-form-lead',
  templateUrl: './form-lead.component.html',
  styleUrls: ['./form-lead.component.less'],
})
export class FormLeadComponent implements OnInit, OnDestroy {
  @Input() formType: string; // edit or create
  @Input() data: any;
  @Output() closeModal = new EventEmitter<string>();

  modalContacts: NzModalRef;
  @ViewChild('contactsModalContent')
  private contactsModalContent: any;

  modalReject: NzModalRef;
  @ViewChild('rejectModalContent')
  private rejectModalContent: any;

  users: User[] = null;
  form: FormGroup;
  leadSources: LeadSource[] = [];
  services: Service[];
  statusSysName: string;

  phoneVisible: boolean;
  emailVisible: boolean;
  lastNameVisible: boolean;

  contacts: Contact[];
  selectedContact: Contact;
  contactCount: number;


  private tempDataForCreateUpdat: any = {
    id: null,
    leadStatusId: null,
    assignedUserId: null,
    roistatInfo: {
      roistatId: 0,
      gClientId: 0,
      yClientId: 0,
    },
    utmTags: {
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_content: null,
      utm_term: null,
    },
    address: null,
  };
  showUtmTags: boolean;
  leadFormLoading = false;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.closeAllPopap();
  }

  constructor(
    private usersService: UsersService,
    private modalService: NzModalService,
    private formBuilder: FormBuilder,
    private leadSourcesService: LeadSourcesService,
    private servicesService: ServicesService,
    private leadService: LeadService,
    private leadDataService: LeadDataService,
    private contactsService: ContactsService,
    private message: NzMessageService,
    private authService: AuthService,
  ) {
    this.form = this.formBuilder.group({
      title: ['Новая заявка', Validators.required],
      lastName: [null],
      firstName: [null, Validators.required],
      secondName: [null],
      birthDate: [null],
      email: [null, [emailCustomValid]],
      phone: [null, [phoneCustomValid]],
      comment: [null, Validators.required],
      leadSourceId: [null, Validators.required],
      medicalServiceId: [null],
      assignedUserId: [null, Validators.required], // если null то ответственный будет текущий user
    });
  }

  ngOnInit() {
    // переделать
    document.getElementsByTagName('nz-layout')[1]
      .addEventListener('scroll', (e) => {
        this.closeAllPopap();
      });
    const pageParam = {
      page: 1,
      pageSize: 500,
    };
    this.usersService.getList(pageParam).subscribe((users) => {
      this.users = users.data;
    });

    this.leadSourcesService.getList().subscribe((leadSources) => { this.leadSources = leadSources; });
    this.servicesService.getList().subscribe((services) => { this.services = services; });
    if (this.formType === 'create') {
      this.tempDataForCreateUpdat.leadStatusId = this.data.leadStatusId;
    } else if (this.formType === 'edit') {
      this.statusSysName = this.data.leadStatus.sysName;
      this.showUtmTags = Object.keys(this.data.utmTags).some(key => this.data.utmTags[key] !== null);

      if (this.data.contactInfo && this.data.contactInfo.contactId) {
        this.contactsService.getList(null, { id: this.data.contactInfo.contactId })
          .map(response => response.data)
          .subscribe((contact) => {
            this.selectedContact = contact[0];
          });
      }
      this.tempDataForCreateUpdat = this.fillDataForUpdate();
    }
    this.addedLeadValueInForm();

    this.form.get('firstName').valueChanges
      .debounceTime(500)
      // .filter(value => value != null)
      .distinctUntilChanged()
      .subscribe((value) => {
        if (!value || value.length < 3) {
          return;
        }
        this.showEqualUsers('lastName', value);
      });

    this.form.get('lastName').valueChanges
      .debounceTime(500)
      // .filter(value => value != null)
      .distinctUntilChanged()
      .subscribe((value) => {
        this.showEqualUsers('lastName', value);
      });

    this.form.get('phone').valueChanges
      .debounceTime(500)
      // .filter(value => value != null)
      .distinctUntilChanged()
      .subscribe((value) => {
        this.showEqualUsers('phone', value);
        this.form.get('email').updateValueAndValidity({ emitEvent: false });
      });

    this.form.get('email').valueChanges
      .debounceTime(500)
      // .filter(value => value != null)
      .distinctUntilChanged()
      .subscribe((value) => {
        this.showEqualUsers('email', value);
        this.form.get('phone').updateValueAndValidity({ emitEvent: false });
      });
  }

  // private togleValidation(field, value, self) {
  //   if (value) {
  //     this.form.controls[field].clearValidators();
  //     this.form.controls[field].setValidators([Validators.email]);
  //     this.form.controls[field].setErrors(null);
  //   } else {
  //     this.form.controls[field].setValidators([Validators.email]);
  //     this.form.controls[field].setValidators(Validators.required);
  //     if (!this.form.get(field).value) {
  //       this.form.controls[field].setErrors({ required: true });
  //     } else {
  //       this.form.controls[self].clearValidators();
  //     }
  //     this.form.controls[self].reset();
  //   }
  // }

  private showEqualUsers(type, value) {
    if (!value || value.length < 3) {
      this.closeAllPopap();
      return;
    }
    let params = { [type]: value };

    let paginParams = null;
    if (type === 'lastName') {
      paginParams = this.getFullName();
      params = null;
    }

    this.contactsService.getDuplicates(paginParams, params)
      .subscribe((contacts) => {
        if (contacts.length > 0) {
          this[`${type}Visible`] = true;
          this.contacts = contacts;
          this.contactCount = contacts.length;
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

  private fillDataForUpdate() {
    const {
      id,
      address,
      utmTags,
      roistatInfo,
    } = this.data;
    return {
      id,
      address,
      utmTags,
      roistatInfo,
      leadStatusId: this.data.leadStatus.id,
      assignedUserId: this.data.assignedUser.id,
    };
  }
  ngOnDestroy() {

  }

  private addedLeadValueInForm() {
    if (this.formType === 'create') {
      this.fillFormCreate();
    } else if (this.formType === 'edit') {
      this.fillFormEdit();
    }

  }

  private fillFormCreate() {
    this.form.patchValue({
      assignedUserId: this.authService.user.id,
    });
  }

  private fillFormEdit() {
    this.form.patchValue({
      title: this.data.title,
      lastName: this.data.leadInfo.lastName,
      firstName: this.data.leadInfo.firstName,
      secondName: this.data.leadInfo.secondName,
      birthDate: this.data.leadInfo.birthday,
      email: this.data.leadInfo.email,
      phone: this.data.leadInfo.phone,
      comment: this.data.comment,
      leadSourceId: this.data.leadSource.id,
      medicalServiceId: this.data.medicalService ? this.data.medicalService.id : null,
      assignedUserId: this.data.assignedUser.id,
    });
  }

  private getLeadModel(): LeadCreate {
    const {
      title,
      lastName,
      firstName,
      secondName,
      birthDate,
      phone,
      email,
      comment,
      leadSourceId,
      medicalServiceId,
      assignedUserId,
    } = this.form.value;

    return {
      title,
      firstName,
      lastName,
      secondName,
      phone,
      email,
      comment,
      leadSourceId,
      medicalServiceId,
      assignedUserId,
      birthday: birthDate ? DateUtils.toISODateTimeString(birthDate) : null,
      id: this.tempDataForCreateUpdat.id,
      leadStatusId: this.tempDataForCreateUpdat.leadStatusId,
      roistatInfo: this.tempDataForCreateUpdat.roistatInfo,
      utmTags: this.tempDataForCreateUpdat.utmTags,
      address: this.tempDataForCreateUpdat.address,
      contactId: this.selectedContact ? this.selectedContact.id : null,
    };
  }

  public onSubmit(form: FormGroup) {
    if (form.invalid) {
      FormUtils.markAsDirty(form);
      return;
    }
    this.leadFormLoading = true;
    const leadModel = this.getLeadModel();
    (this.formType === 'create' ? this.createLead(leadModel) : this.editLead(leadModel))
      .finally(() => { this.leadFormLoading = false; })
      .subscribe((response) => {
        this.closeForm();
      }, (err) => {
        if (err.error.errors) {
          err.error.errors.forEach(message => this.message.error(message, { nzDuration: 3000 }));
        }
      });
  }

  private createLead(leadModel: LeadCreate) {
    return this.leadService.create(leadModel);
  }

  private editLead(leadModel: LeadCreate) {
    return this.leadService.update(leadModel);
  }

  public closeForm() {
    this.closeModal.emit(this.formType);
  }

  private clearForm() {
    this.form.reset();
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
    if (contactId) {
      this.contacts.some((item: Contact) => {
        if (contactId === item.id) {
          this.selectedContact = item;
          return true;
        }
      });
    }
    this.modalContacts.close();
  }
  // end contact modal
  openRejectForm() {
    this.modalReject = this.modalService.create({
      nzTitle: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzContent: this.rejectModalContent,
      nzFooter: null,
      nzWidth: '800px',
    });
  }
  closeModalReject(contactId) {
    this.modalReject.close();
  }

  removeSelectedContact() {
    this.selectedContact = null;
  }
}
