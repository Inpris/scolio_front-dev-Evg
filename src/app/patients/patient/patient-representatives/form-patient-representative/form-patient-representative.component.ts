import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';
import { CommunicationTypesService } from '@common/services/communication-types';
import { PatientService } from '@common/services/patient.service';
import { ToastsService } from '@common/services/toasts.service';
import { FormUtils } from '@common/utils/form';
import { DateUtils } from '@common/utils/date';
import { extract } from '@common/utils/object';
import { HttpErrorResponse } from '@angular/common/http';
import { PatientRepresentative } from '@common/models/patient-representative';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import * as moment from 'moment';

export const DEFAULT_PASSPORT = {
  serialNumber: null,
  issueDate: '0001-01-01T00:00:00',
  issueBy: null,
};

@Component({
  selector: 'sl-form-patient-representative',
  templateUrl: './form-patient-representative.component.html',
  styleUrls: ['./form-patient-representative.component.less'],
  providers: [CommunicationTypesService],
})
export class FormPatientRepresentativeComponent implements OnInit {

  @Input() formType: string;
  @Input() patientId: string;
  @Input() data: PatientRepresentative;
  @ViewChildren(FormControlName) controls: QueryList<FormControlName>;

  public selectedRepresentative: PatientRepresentative;

  public form: FormGroup;
  loading = true;

  get contragentForm() {
    return this.form.controls.contactConragent;
  }

  get isEditMode() {
    return this.formType === 'edit';
  }

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder,
    private modal: NzModalRef,
    private messageService: ToastsService,
  ) {
    this.form = fb.group({
      contactConragent: [{}],
    });
  }

  ngOnInit() {
    if (this.formType === 'edit') {
      this.fillForm(this.data);
    }
  }

  fillForm(data) {
    const {
      firstName,
      secondName,
      lastName,
      birthDate,
      gender,
      phone,
      email,
      communications,
      address,
      passport,
      comment,
      patientAffiliation,
      defaultAgent,
    } = data;
    this.form.patchValue({
      contactConragent: {
        firstName,
        secondName,
        lastName,
        birthDate,
        gender,
        phone,
        email,
        address,
        passport,
        comment,
        patientAffiliation,
        defaultAgent,
        communications,
      }} as any);
  }

  selectedRepresentativeChange(selectedRepresentative) {
    this.selectedRepresentative = selectedRepresentative;
  }

  public onSubmit() {
    const data = this.form.value.contactConragent;

    this.controls.forEach((control) => {
      if (control.valueAccessor instanceof FormValueAccessor) {
        (<FormValueAccessor>control.valueAccessor).markAsDirty();
      }
    });
    if (this.form.invalid) {
      FormUtils.markAsDirty(this.form);
      return;
    }
    this.loading = true;
    this.operateRepresentative(data);
  }

  operateRepresentative(representative) {
    this.loading = true;

    const method = this.isEditMode ?
      this.patientService.updateRepresentative.bind(this.patientService, this.data.representativeId) :
      this.patientService.createRepresentative.bind(this.patientService);

    const addedRepresentativeId = this.selectedRepresentative ? this.selectedRepresentative.representativeId : null;
    const { serialNumber, issueDate, issueBy } = representative.passport;
    const validPassport = serialNumber && issueDate && issueBy;
    const passport = validPassport ?
      {
        ...representative.passport,
        issueDate: moment(representative.passport.issueDate).format('YYYY-MM-DDTHH:mm:ss[Z]')
      } :
      DEFAULT_PASSPORT;

    method({
      ...representative,
      id: this.data ? this.data.id : null,
      representativeId: this.data ? this.data.representativeId : addedRepresentativeId,
      patientId: this.patientId,
      birthDate: representative.birthDate ? DateUtils.toISODateTimeString(representative.birthDate) : null,
      address: representative.address && {
        regionId: extract(representative, 'address.region.id'),
        cityId: extract(representative, 'address.city.id'),
        street: extract(representative, 'address.street'),
        house: extract(representative, 'address.house'),
        flat: extract(representative, 'address.flat'),
      },
      passport
    })
      .subscribe(
        (response) => {
          const message = this.isEditMode ? 'Данные успешно обновлены' : 'Представитель успешно добавлен';
          this.messageService.info(message, { nzDuration: 3000 });
          this.closeForm(response);
        },
        err => this.onError(err),
        () => this.loading = false,
      );
  }

  closeForm(data?) {
    this.modal.destroy(data);
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
}
