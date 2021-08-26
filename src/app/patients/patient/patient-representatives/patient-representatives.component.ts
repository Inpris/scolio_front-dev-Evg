import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { ToastsService } from '@common/services/toasts.service';
import { PatientService } from '@common/services/patient.service';
import { PatientRepresentative } from '@common/models/patient-representative';
import { FormPatientRepresentativeComponent } from './form-patient-representative/form-patient-representative.component';

@Component({
  selector: 'sl-patient-representatives',
  templateUrl: './patient-representatives.component.html',
  styleUrls: ['./patient-representatives.component.less'],
})
export class PatientRepresentativesComponent implements OnInit {

  public data: PatientRepresentative[];
  public patientId: string;

  constructor(
    private route: ActivatedRoute,
    private modalService: NzModalService,
    private messageService: ToastsService,
    private patientService: PatientService,
  ) {}

  ngOnInit() {
    this.patientId = this.route.snapshot.parent.params.id;
    this.getRepresentatives(this.patientId);
  }

  private getRepresentatives(patientId) {
    this.patientService.getRepresentativesByPatient(patientId)
      .subscribe(
        response => this.data = response,
        err => this.messageService.onError(err),
      );
  }

  public openModalRepresentativeForm(data?) {
    const isEditMode = !!data;
    const modalRef = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: FormPatientRepresentativeComponent,
      nzComponentParams: {
        data,
        patientId: this.patientId,
        formType: isEditMode ? 'edit' : 'create',
      },
      nzFooter: null,
      nzWidth: '660px',
    });
    modalRef.afterClose
      .subscribe((representative) => {
        if (representative) {
          this.getRepresentatives(this.patientId);
        }
      });
  }

  public confirmRemove(id: string) {
    this.modalService.warning({
      nzTitle: 'Вы уверены что хотите удалить представителя из карты пациента?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => { this.deleteRepresentative(id); },
      nzZIndex: 1200,
    });
  }

  public deleteRepresentative(id: string) {
    this.patientService.deleteRepresentative(id).subscribe((response) => {
      this.getRepresentatives(this.patientId);
      this.data = [...this.data];
      const message = 'Представитель успешно удален';
      this.messageService.info(message, { nzDuration: 3000 });
    }, (err) => {
      const message = 'Возникла непредвиденная ошибка во время удаления представителя';
      this.messageService.error(message, { nzDuration: 3000 });
    });
  }
}
