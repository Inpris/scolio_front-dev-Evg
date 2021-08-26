import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs/Observable';
import { Appointment, AppointmentCreate, AppointmentsService } from '@common/services/appointments';
import { DateUtils } from '@common/utils/date';
import { FormUtils } from '@common/utils/form';
import { LeadSourcesService } from '@common/services/lead-sources';
import { LeadSource } from '@common/interfaces/Lead-source';
import { notRequiredEmailValidator } from '@common/validators/email';
import { Contact, ContactsService } from '@common/services/contacts';
import { Room } from '@common/models/room';
import { Service } from '@common/models/service';
import { VisitReason } from '@common/models/visit-reason';
import { HttpErrorResponse } from '@angular/common/http';
import { Doctor } from '@common/models/doctor';
import { VisitsService } from '@common/services/visits';
import { ContactCreate } from '@common/models/contact';
import { ContactTypeSysNames } from '@common/models/contact-types';
import { ContactSearchComponent } from '@common/modules/contact-search/contact-search.component';
import { ConsentToTreatmentService } from '@common/services/consent-to-treatment.service';
import { FilesService } from '@common/services/file.service';
import { AddAccessComponent } from "@modules/shedule/appointment-form/components/add-access/add-access.component";
import {Subject} from "rxjs";
import {EmailCreate} from "@common/interfaces/Email-create";
import {SmsCreate} from "@common/interfaces/Sms-create";
import {MsgService} from "@common/services/msg.service";
import {AuthService} from "@common/services/auth";
import {AccessesService} from "@common/services/accesses-service.service";
import {takeUntil} from "rxjs/operators";
import {AccessesDataService} from "@common/services/accesses-data.service";
import {MAIN_BRANCH} from "@common/constants/access-roles-to-the-path.constant";
import {UsersService} from "@common/services/users";

const APPOINTMENT_CREATED = 'Пациент записан на прием.';
const APPOINTMENT_CHANGED = 'Запись на прием изменена.';
const APPOINTMENT_DELETED = 'Запись на прием удалена.';
const VISIT_CREATED = 'Для пациента создано посещение.';

@Component({
  selector: 'sl-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.less'],
  providers: [MsgService]
})
export class AppointmentFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  appointment: Appointment;

  @Input()
  date: Date;

  @Input()
  branchId: string;

  @Input()
  room: Room;

  @Input()
  doctor: Doctor;

  @Input()
  service: Service;

  @Input()
  visitReason: VisitReason;

  @Input()
  purchaseId: string;

  private _contact: Contact;
  private $isKilled = new Subject();

  readonly patientComeStatus = 'PatientCome';
  readonly firstReceptionStatus = 'FirstReception';

  public isPatient: boolean;
  public templates: { template: string; name: string; }[];
  public access: boolean;
  public addFormPatient: Contact = null;

  @Input()
  get contact() {
    return this._contact;
  }

  set contact(contact: Contact) {
    this._contact = contact;

    if (contact == null) {
      this.clearForm();
    } else {
      this.fillForm();
      this.form.patchValue({
        comment: this.appointment !== null ? this.appointment.comment : '',
        hasCome: this.appointment !== null ? this.appointment.status === this.patientComeStatus : false,
      });
      if (this.isNewVisit) {
        this.form.markAsDirty();
      }
      this.isPatient = Array.isArray(this.contact.contactTypes)
        && this.contact.contactTypes.some(
          contactType => contactType.sysName === ContactTypeSysNames.PATIENT,
        );
      this.togleDisableFields(!this.isPatient);
    }

    if (contact) {
      this.visitsService
        .getList(this._contact.id, { pageSize: 500 })
        .subscribe(response => this._contactVisitCount = (response.data) ? response.data.length : 0,
          () => this.messageService.error('Не удалось загрузить посещения, попробуйте позднее', { nzDuration: 4000 }));
    } else {
      this.togleDisableFields(this.isNewVisit);
    }
  }

  @Output()
  appointmentCreated = new EventEmitter<Appointment>();

  @Output()
  selectContact = new EventEmitter<Contact>();

  @Output()
  come = new EventEmitter<boolean>();

  appointmentLoading = false;

  form: FormGroup;

  leadSources: LeadSource[] = [];

  @ViewChild(ContactSearchComponent)
  search: ContactSearchComponent;

  @ViewChild('contactCard')
  private contactCard;

  get isNewContact() {
    return this._contact == null || this._contact.isVirtual;
  }

  get canEdited() {
    return this.doctor && (this.appointment == null || this.appointment.dateTimeStart > DateUtils.nowDate());
  }

  get canCome() {
    if (this.appointment) {
      let date = new Date(this.appointment.dateTimeStart);
      date = new Date(date.setHours(0, 0, 0, 0));
      return date < new Date();
    } else {
      return false;
    }
  }

  get canCanceled() {
    return this.appointment != null && this.appointment.status !== 'PatientCome';
  }

  get isMainBranch() {
    return this.branchId === MAIN_BRANCH;
  }

  get canConfirm() {
    return this.appointment != null && this.appointment.status !== 'PatientCome' && !this.isMainBranch && !this.access;
  }

  private leadId: string = null;
  private _contactVisitCount: number;
  public isNewVisit = false;

  constructor(
    private appointmentsService: AppointmentsService,
    private formBuilder: FormBuilder,
    private leadSourcesService: LeadSourcesService,
    private message: NzMessageService,
    private contactsService: ContactsService,
    private modalService: NzModalService,
    private visitsService: VisitsService,
    private messageService: NzMessageService,
    private templateService: ConsentToTreatmentService,
    private filesService: FilesService,
    private msgService: MsgService,
    private authService: AuthService,
    private accessesService: AccessesService,
    private accessesDataService: AccessesDataService,
    private userService: UsersService,
  ) {
    this.form = this.formBuilder.group({
      hasCome: false,
      lastName: [null, Validators.required],
      firstName: [null, Validators.required],
      secondName: [null],
      birthDate: [null],
      phone: [null, Validators.required],
      email: [null, notRequiredEmailValidator],
      leadSourceId: [null, Validators.required],
      comment: [null],
      acceptDataProcessing: null,
      acceptOrthoses: null,
      acceptSms: null,
      newPhone: null,
      newEmail: null,
      nextAppointments: '',
      offerAppointments: '',
    });
  }

  public addAccess() {
    const modal = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: AddAccessComponent,
      nzFooter: null,
      nzWidth: '660px',
      nzComponentParams: {
        branchId: this.branchId,
        contact: this.contact,
      },
    });

    modal.afterClose
      .subscribe(_ => {
        if (!this.isMainBranch) {
          this.getAccess();
        }
      });
  }

  public getAccess() {
    this.accessesService.isAccess(this.branchId, this.contact.id)
      .subscribe((isAccess: boolean) => {
        this.accessesDataService.isAccess.next(isAccess);
      });
  }

  togleDisableFields (value: boolean) {
    if (!this.form) { return; }
    this.setControlsState([
      'lastName', 'firstName', 'secondName', 'birthDate', 'phone', 'email',
      'leadSourceId',
    ], value ? 'enable' : 'disable');
  }

  ngOnInit() {
    this.accessesDataService.isAccess
      .pipe(
        takeUntil(this.$isKilled)
      )
      .subscribe((value: boolean) => {
        this.access = value;
      });

    if (this.contact && this.contact.leadId) {
      this.leadId = this.contact.leadId;
    }

    this.form.get('hasCome').valueChanges
      .pipe(takeUntil(this.$isKilled))
      .subscribe((comeValue: boolean) => this.come.emit(comeValue));

    this.leadSourcesService.getList().subscribe((leadSources) => { this.leadSources = leadSources; });

    this.templateService.getList()
      .subscribe(templates => this.templates = templates);
  }

  ngOnDestroy(): void {
    this.$isKilled.next();
    this.$isKilled.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appointment != null && !changes.appointment.firstChange && changes.appointment.currentValue) {
      this.purchaseId = changes.appointment.currentValue.purchaseId;
    }
    if (changes.branchId && !changes.branchId.firstChange) {
      this.form.reset();
    }
    if (changes.appointment != null && !changes.appointment.firstChange && changes.contact == null) {
      this.search.reset();
      const appointment = changes.appointment.currentValue;
      if (appointment == null) {
        if (changes.appointment.previousValue != null) {
          this.contact = null;
          this.clearForm();
        }
      } else {
        this.contact = appointment.contact;
        this.fillForm();
        this.form.patchValue({
          comment: appointment.comment,
          hasCome: appointment.status === 'PatientCome',
          newPhone: appointment.phone,
          newEmail: appointment.email,
        });
        this.form.markAsPristine();
        this.form.markAsUntouched();
      }
    }
    if (changes.date != null && (!this.contact || (changes.contact && changes.contact.currentValue === null))) {
      this.togleDisableFields(true);
    }
  }

  onSelectContact(contact: Contact) {
    this.isNewVisit = true;
    this.selectContact.emit(contact);
    this.form.markAsDirty();
  }

  isPristine() {
    return this.form.pristine;
  }

  openContactCard() {
    this.modalService.create({
      nzTitle: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzContent: this.contactCard,
      nzFooter: null,
      nzWidth: 640,
    });
  }

  private sendEmail(dataMail: EmailCreate) {
    return this.msgService.sendEmail(dataMail);
  }

  private sendSms(dataSms: SmsCreate) {
    return this.msgService.sendSms(dataSms);
  }

  public get isSave() {
    return this.appointment && this.appointment.id && this.appointment.status !== 'NotConfirmed';
  }

  onSubmit(form: FormGroup) {
    const new_email = this.form.get('newEmail').value;
    const new_phone = this.form.get('newPhone').value;
    const isSave = this.isSave;

    if (!this.isMainBranch && (!new_phone || !new_email) && !this.isSave) {
      this.message.error('Необходимо уточнить контакты для отправки кода.', { nzDuration: 3000 });
      return;
    }

    if (form.invalid) {
      FormUtils.markAsDirty(form);
      return;
    }

    if (this.date == null) {
      this.message.error('Выберите время записи на прием', { nzDuration: 3000 });
      return;
    }

    if (this._isProhibitFirstReception()) {
      this.message.error('Выберите другой тип посещения. Пациент уже проходил первичный прием', { nzDuration: 3000 });
      return;
    }

    this.appointmentLoading = true;
    const updateContactObserver =  this._isNeedContactUpdate() ?
      this.updateContact() : Observable.of(this._contact);
    (this.isNewContact ? this.createContact() : updateContactObserver)
      .switchMap((contact) => {
        const appointmentModel = this.getAppointmentModel(contact);
        if (this.appointment == null) {
          return this.appointmentsService.create(appointmentModel);
        }

        return this.appointmentsService.update(appointmentModel);
      })
      .finally(() => { this.appointmentLoading = false; })
      .subscribe((appointment) => {
        if (!isSave) {
          this.sendNumCode(new_email, new_phone);
        }

        this.onSuccess();
        this.appointmentCreated.emit(appointment);
      }, (response) => {
        this.onError(response);
      });
  }

  private sendNumCode(email: string, phone: string) {
    if (!this.isMainBranch) {
      this.accessesService.getAccessNumCode(this.branchId, this.contact.id)
        .subscribe(
          (data: any) => {
            const emailConfig: EmailCreate = {
              to: email,
              htmlBody: `<div>${data.numCode}</div><div>Данный код вам будет необходимо предоставить сотруднику отделения при посещении.</div>`,
              subject: 'Ваш индивидуальный код.',
              entityId: this.contact.id,
              entityType: 'contact',
              from: 'testscol@yandex.ru',
              inReplyToMessageId: null,
            };

            const smsConfig: SmsCreate = {
              phone: phone,
              message: `Ваш индивидуальный код - ${data.numCode}. Данный код вам будет необходимо предоставить сотруднику отделения при посещении.`,
              entityType: 'contact',
              entityId: this.contact.id,
            };

            this.sendEmail(emailConfig)
              .subscribe(result => {
                console.log(result);
              }, err => {
                this.onError(err);
              });

            this.sendSms(smsConfig)
              .subscribe(result => {
                console.log(result);
              }, err => {
                this.onError(err);
              });
          },
          (err) => {
            this.onError(err);
          }
        );
    }
  }

  private _isProhibitFirstReception() {
    return this._contactVisitCount > 0  &&
      this.visitReason.sysName === this.firstReceptionStatus &&
      (this.isNewVisit ||
        (!this.isNewVisit &&
          this.form.get('hasCome').dirty &&
          this.form.get('hasCome').value));
  }

  private _isNeedContactUpdate() {
    return !this.isNewContact && (
      (!this.isPatient && this.form.dirty) ||
      (this.form.get('acceptDataProcessing').dirty ||
        this.form.get('acceptOrthoses').dirty ||
        this.form.get('acceptSms').dirty)
    );
  }

  cancelAppointment() {
    this.modalService.warning({
      nzTitle: 'Вы уверены, что хотите отменить запись на приём?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzZIndex: 1200,
      nzOnOk: () => {
        this.appointmentLoading = true;
        this.appointmentsService.remove(this.appointment.id)
          .finally(() => { this.appointmentLoading = false; })
          .subscribe(() => { this.message.info(APPOINTMENT_DELETED, { nzDuration: 3000 }); });
      },
    });
  }

  public markAsPristine() {
    this.form.markAsPristine();
    FormUtils.markAsPristine(this.form);
  }

  public markAsUntouched() {
    this.form.markAsUntouched();
  }

  public clearForm() {
    this.form.reset();
  }

  private fillForm() {
    const contact = this._contact;
    this.form.patchValue({
      lastName: contact.lastName,
      firstName: contact.firstName,
      secondName: contact.secondName,
      birthDate: contact.birthDate,
      phone: contact.phone,
      email: contact.email,
      leadSourceId: contact.leadSource && contact.leadSource.id,
      acceptDataProcessing: contact.acceptDataProcessing,
      acceptOrthoses: contact.acceptOrthoses,
      acceptSms: contact.acceptSms,
      newPhone: contact.phone,
      newEmail: contact.email,
      nextAppointments: contact.nextAppointments,
      offerAppointments: contact.offerAppointments,
    });
  }

  private createContact() {
    const data = this.form.getRawValue();
    return this.contactsService.create(this.getContactModel())
      .do((contact) => { this._contact = contact; });
  }

  private updateContact() {
    const contactModel: ContactCreate =  this.getContactModel();
    contactModel.communications = [];
    return this.contactsService.update(this.contact.id, contactModel)
      .do((contact) => { this._contact = contact; });
  }

  private getContactModel(): ContactCreate {
    const data = this.form.getRawValue();
    return {
      lastName: data.lastName,
      firstName: data.firstName,
      secondName: data.secondName != null ? data.secondName : void 0,
      birthDate: data.birthDate != null ? DateUtils.toISODateTimeString(data.birthDate) : void 0,
      phone: data.phone,
      email: data.email != null ? data.email : void 0,
      passport: null,
      address: '',
      leadSourceId: data.leadSourceId,
      acceptDataProcessing: data.acceptDataProcessing || false,
      acceptOrthoses: data.acceptOrthoses || false,
      acceptSms: data.acceptSms || false,
      leadId: this.leadId,
    };
  }

  private getAppointmentModel(contact: Contact): AppointmentCreate {
    const newAppointment = this.appointment == null;
    const { comment, hasCome, leadSourceId } = this.form.getRawValue();
    const dateTime = DateUtils.toISODateTimeString(this.date);
    const status = hasCome ? 'PatientCome' : 'Confirmed';
    const { service, visitReason, room } = newAppointment ? this : this.appointment;
    return {
      dateTime,
      leadSourceId,
      status,
      comment,
      doctorId: this.doctor ? this.doctor.id : null,
      dealId: null,
      leadId: this.leadId,
      contactId: contact.id,
      medicalServiceId: service.id,
      visitReasonId: visitReason != null ? this.visitReason.id : void 0,
      roomId: room.id,
      id: newAppointment ? void 0 : this.appointment.id,
      purchaseId: this.purchaseId,
    };
  }

  private onSuccess() {
    const { hasCome } = this.form.getRawValue();
    const content = hasCome ? VISIT_CREATED : this.appointment == null ? APPOINTMENT_CREATED : APPOINTMENT_CHANGED;
    this.message.info(content, { nzDuration: 3000 });
    this.isNewVisit = false;

    this.userService.savedAppointment({
      id: this.authService.user.id,
      roomId: this.room.id,
    }).subscribe();
  }

  private onError(response: HttpErrorResponse) {
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.message.error(errors[0], { nzDuration: 3000 });
    }
  }

  private setControlsState(controlNames: string[], state: string) {
    for (const controlName of controlNames) {
      this.form.controls[controlName][state]();
    }
  }

  public downloadTemplate(templateName: string, fileName: string) {
    this.appointmentLoading = true;
    this.templateService.getTemplate(this._contact.id, templateName)
      .subscribe((response) => {
          const name = `${fileName}.docx`;
          this.filesService.saveFile(name, response, response.type);
        },
        error => this.onError(error),
        () => this.appointmentLoading = false);
  }
}
