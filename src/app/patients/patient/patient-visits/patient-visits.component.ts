import { Component, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { FormUtils } from '@common/utils/form';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { Visit, VisitsService } from '@common/services/visits';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CreateVisitComponent } from '@modules/patients/patient/patient-visits/create-visit/create-visit.component';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { Subject } from 'rxjs/Subject';
import { VisitsFormData } from '@modules/patients/patient/patient-visits/helpers/visits-form-data';
import { VisitCreate } from '@common/interfaces/Visit-create';
import { CanDeactivateComponent } from '@modules/patients/patient/guards/can-deactivate-guard.service';
import { Observable } from 'rxjs/Observable';
import { FilesService } from '@common/services/file.service';
import { VisitPhotoCompareComponent } from '@modules/patients/patient/patient-visits/visit-photo-video/visit-photo-compare/visit-photo-compare.component';
import { CreateMtkTemplateComponent } from '@modules/patients/patient/patient-visits/visit-documents/create-mtk-template/create-mtk-template.component';
import { RolesUsers } from '@common/constants/roles-users.constant';
import { extract } from '@common/utils/object';
import { Appointment } from '@common/models/appointment';
import { CreateContractComponent } from '@modules/deals/create-contract/create-contract.component';
import { Contact } from '@common/models/contact';
import { Contract } from '@common/models/contract';
import {MarloModalComponent} from '@modules/patients/patient/patient-visits/marlo-modal/marlo-modal.component';
import {ContractsService} from '@common/services/contracts.service';

@Component({
  selector: 'sl-patient-visits',
  templateUrl: './patient-visits.component.html',
  styleUrls: ['./patient-visits.component.less'],
  providers: [VisitsService],
})
export class PatientVisitsComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  readonly ROLES_USERS = RolesUsers;
  @ViewChildren(FormControlName) controls: QueryList<FormControlName>;
  public scrollContainer;
  public form: FormGroup;
  public selectedMeasurements = [];
  public selectedOrders = [];
  public loading = true;
  public unsubscribe$ = new Subject();
  public visitsManager: VisitsManager;
  public visitId: string;
  readonly contactId: string;
  readonly contact: Contact;
  public corsetData = {};
  public selectedAttachments = [];
  public nzOffsetTopValue;
  public isAttachmentsEmpty = (visit: Visit) => !Boolean(visit.attachments.length);
  get sysName() { return this.visitsManager.selected.medicalService.sysName; }
  get visitReasonSysName() {
    const appointment: Appointment = this.form.value.appointment;
    return appointment.visitReason && appointment.visitReason.sysName;
  }

  constructor(
    private fb: FormBuilder,
    private visitsService: VisitsService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private filesService: FilesService,
    private contractsService: ContractsService,
  ) {
    this.contactId = this.route.parent.snapshot.params.id;
    this.contact = this.route.parent.snapshot.data.contact;
    this.visitId = this.route.snapshot.queryParams.id;
    this.visitsManager = new VisitsManager(this.contactId);
    this.form = fb.group(VisitsFormData.formSchema);
    this.visitsService
      .getList(this.contactId, { pageSize: 500 })
      .subscribe(
        response => this.visitsManager.setVisits(response.data),
        () => this.messageService.error('Не удалось загрузить посещения, попробуйте позднее', { nzDuration: 4000 }),
        () => this.loading = false,
      );
  }

  ngOnInit() {
    this.scrollContainer = document.querySelector('.sl-root-layout .sl-root-container');
    this.visitsManager
      .selectionChanges
      .takeUntil(this.unsubscribe$)
      .subscribe(visit => this.onVisitSelected(visit));
    this.setNzOffsetTop(100);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  private setNzOffsetTop(offset: number) {
    setTimeout(() => {
      this.nzOffsetTopValue = offset;
    }, 10);
  }

  canDeactivate() {
    const canDeactivate = new Subject<boolean>();
    if (this.form.untouched) {
      return Observable.of(true);
    }
    this.modalService.warning({
      nzTitle: 'Все несохраненные изменения будут удалены, продолжить?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => canDeactivate.next(true),
      nzOnCancel: () => canDeactivate.next(false),
    });
    return canDeactivate.asObservable();
  }

  hideSelection(index, target) {
    switch (target) {
      case 'selectedAttachments':
        this.visitsManager.removePhotosSelection(this.selectedAttachments[index].attachments);
        this.selectedAttachments = [
          ...this.selectedAttachments.slice(0, index),
          ...this.selectedAttachments.slice(index + 1),
        ];
        break;
      case 'selectedMeasurements':
        this.selectedMeasurements = [
          ...this.selectedMeasurements.slice(0, index),
          ...this.selectedMeasurements.slice(index + 1),
        ];
    }
  }

  updateAttachmentsSelection(visits = []) {
    const selectedVisitAttachments = (this.form.value.attachments || []).filter(attachment => attachment.selected);
    const historyAttachments = [];
    for (const visit of visits) {
      historyAttachments.push(...visit.attachments.filter(attachment => attachment.selected));
    }
    const newSelection = [...selectedVisitAttachments, ...historyAttachments];
    for (const photo of this.visitsManager.selectedPhotos) {
      if (newSelection.indexOf(photo) === -1) { photo.selected = false; }
    }
    this.visitsManager.selectedPhotos = newSelection;
  }

  onVisitSelected(visit: Visit) {
    if (!visit) {
      return;
    }

    this.form.patchValue(VisitsFormData.fromVisit(visit));
    console.log(this.form.value)
    this.controls.forEach((control) => {
      if (control.valueAccessor instanceof FormValueAccessor) {
        (<FormValueAccessor>control.valueAccessor).markAsPristine();
      }
    });
    FormUtils.markAsPristine(this.form);
    this.selectedMeasurements.splice(0);
    this.selectedAttachments.splice(0);
    this.form.markAsUntouched();
  }

  selectVisit(visit: Visit) {
    const select = () => this.visitsManager.select(visit);
    this.canDeactivate()
      .subscribe(result => result ? select() : void 0);
  }

  onSubmit(form) {
    this.controls.forEach((control) => {
      if (control.valueAccessor instanceof FormValueAccessor) {
        (<FormValueAccessor>control.valueAccessor).markAsDirty();
      }
    });
    FormUtils.markAsDirty(form);
    if (form.valid) {
      this.updateVisit(
        VisitsFormData.toVisitCreate(form),
      );
    }
  }

  resetForm() {
    this.modalService.warning({
      nzTitle: 'Вы действительно хотите отменить все изменения?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.onVisitSelected(this.visitsManager.selected);
        this.visitsManager.selectedPhotos
          .splice(0)
          .forEach(
            media => media.selected = false,
          );
      },
    });
  }

  updateVisit(visit: VisitCreate) {
    this.loading = true;

    this.visitsService.update(this.visitsManager.selected.id, {
      ...visit,
      contactId: this.contactId,
      appointmentId: this.visitsManager.selected.appointmentId,
      dateTime: this.visitsManager.selected.dateTime,
      dealId: extract(this.visitsManager.selected, 'deal.id'),
      nextVisitDate: this.form.value && this.form.value.appointment && this.form.value.appointment.nextVisitDate || null,
    }).subscribe(
      (response: Visit) => {
        this.visitsManager.updateVisit(response);
        this.form.patchValue({
          attachments: response.attachments,
          otherFiles: response.otherFiles,
        } as any);
        this.messageService.success('Посещение успешно сохранено!', { nzDuration: 3000 });
      },
      () => {
        this.loading = false;
        this.messageService.error('Не удалось сохранить посещение. Попробуйте позднее.', { nzDuration: 3000 });
      },
      () => {
        this.visitsManager.selectedPhotos
          .splice(0)
          .forEach(
            media => media.selected = false,
          );
        this.loading = false;
        this.form.markAsUntouched();
      },
    );
  }

  public downloadCertificate(): void {
    this.contractsService.getCertificate(this.contactId).subscribe((response: Blob) => {
      this.filesService.saveFile('Справка', response, response.type);
    });
  }

  public showMarloModal(): void {
    const modal = this.modalService.create({
      nzTitle: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzContent: MarloModalComponent,
      nzComponentParams: {
        visitId: this.visitsManager.selected.id,
        contact: this.contact,
      },
      nzFooter: null,
      nzWidth: '700px',
    });
    modal.afterClose
      .filter(data => !!data)
      .subscribe((contract: Contract) => {
        this.visitsManager.selected.deal.contractId = contract.id;
      });
  }

  showContractModal(contractId?) {
    const modal = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: CreateContractComponent,
      nzComponentParams: {
        contractId,
        contactId: this.contactId,
        contact: this.contact,
        visitsManager: this.visitsManager,
      },
      nzFooter: null,
      nzWidth: '1000px',
    });
    modal.afterClose
      .filter(data => !!data)
      .subscribe((contract: Contract) => {
        this.visitsManager.selected.deal.contractId = contract.id;
      });
  }

  createVisit() {
    const modal = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: CreateVisitComponent,
      nzComponentParams: {
        contactId: this.contactId,
        visitsManager: this.visitsManager,
      },
      nzFooter: null,
      nzWidth: '800px',
    });
    modal.afterClose
      .subscribe((visit: Visit) => {
        if (!visit) {
          return;
        }
        this.visitsManager.append(visit);
        this.messageService.success('Посещение успешно создано', { nzDuration: 3000 });
      });
  }

  deleteVisit(visit: Visit) {
    this.modalService.warning({
      nzTitle: 'Вы действительно хотите удалить посещение?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.loading = true;
        this.visitsService.delete(visit.id)
          .subscribe(
            () => {
              this.visitsManager.delete(visit);
              this.messageService.success('Посещение успешно удалено', { nzDuration: 3000 });
              this.loading = false;
            },
            () => {
              this.messageService.error('Данное посещение не может быть удалено!', { nzDuration: 3000 });
              this.loading = false;
            },
            () => {
              this.visitsManager.selectedPhotos
                .splice(0)
                .forEach(
                  media => media.selected = false,
                );
            },
          );
      },
    });
  }

  comparePhotos() {
    this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: VisitPhotoCompareComponent,
      nzFooter: null,
      nzComponentParams: {
        photos: this.visitsManager.selectedPhotos,
      },
      nzWidth: '100%',
      nzBodyStyle: {
        background: 'none',
        height: '100vh',
        width: '100vw',
      },
      nzStyle: {
        top: '0',
        padding: '0',
        height: '100%',
      },
    });
  }

  mtkTemplates() {
    this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: CreateMtkTemplateComponent,
      nzFooter: null,
      nzWidth: '1024px',
      nzStyle: {
        top: '24px',
      },
    });
  }

  hasVisitMeasurement(medicalServiceName: string, visitReasonName: string) {
    return !(visitReasonName === 'RemoteConsultation' || visitReasonName === 'Consultation') &&
           (medicalServiceName ===  'Corset' ||
           medicalServiceName === 'Apparatus');
  }

  hasVisitDeviceMeasurement(medicalServiceName, visitReasonName: string) {
    return !(visitReasonName === 'RemoteConsultation' || visitReasonName === 'Consultation') &&
           (medicalServiceName === 'Corset' ||
           medicalServiceName === 'ProtezVK' ||
           medicalServiceName === 'ProtezNK' ||
           medicalServiceName === 'Apparatus');

  }
  hasDevices(medicalServiceName: string, visitReasonName: string) {
    return !(medicalServiceName === 'Psychologist') && !(visitReasonName === 'RemoteConsultation' || visitReasonName === 'Consultation');
  }
  hasDeviceWearing(medicalServiceName, visitReasonName: string) {
    return !(medicalServiceName === 'Psychologist') && !(visitReasonName === 'RemoteConsultation' || visitReasonName === 'Consultation');
  }
}
