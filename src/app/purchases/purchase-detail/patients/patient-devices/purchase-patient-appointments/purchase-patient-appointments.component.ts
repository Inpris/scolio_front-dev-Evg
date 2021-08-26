import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AppointmentsService, Appointment } from '@common/services/appointments';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { Contact } from '@common/models/contact';
import { Service } from '@common/models/service';
import { ToastsService } from '@common/services/toasts.service';
import { Product } from '@common/models/product';

@Component({
  selector: 'sl-purchase-patient-appointments',
  templateUrl: './purchase-patient-appointments.component.html',
  styleUrls: ['./purchase-patient-appointments.component.less'],
})
export class PurchasePatientAppointmentsComponent implements OnInit {
  @Input()
  purchaseId: string;
  @Input()
  contact: Contact;
  @Input()
  availableServices: Service[];
  @Input()
  appointments;
  @Input()
  deviceCount: number;

  @ViewChild('sheduleModalContent')
  private sheduleModalContent: any;

  public currentAppointment: Appointment;
  public sheduleForm: NzModalRef;
  private isEdit: boolean;

  constructor(
    private appointmentsService: AppointmentsService,
    private modalService: NzModalService,
    private toastService: ToastsService,
  ) {}

  ngOnInit() {
  }

  public openModalSheduleForm(appointment: Appointment, isEdit?: boolean) {
    if (this.deviceCount > 0) {
      this.currentAppointment = appointment;
      this.isEdit = isEdit;
      this.sheduleForm = this.modalService.create({
        nzTitle: null,
        nzMaskClosable: false,
        nzContent: this.sheduleModalContent,
        nzFooter: null,
        nzWidth: '100%',
      });
    } else {
      this.toastService.error('Нельзя создать запись на прием для пациента, у которого нет изделий. Пожалуйста, добавьте изделие пациенту',  { nzDuration: 3000 });
    }
  }
  public loadAppointments() {
    this.appointmentsService.getListForPurchasePatient(this.purchaseId, this.contact.id)
    .subscribe(appointments => this.appointments = appointments);
  }

  public onAppointmentCreated(appointment: Appointment) {
    this.sheduleForm.close();
    this.loadAppointments();
  }

  public deleteAppointment(appointment: Appointment) {
    this.appointmentsService.remove(appointment.id)
        .subscribe(
          () => this.loadAppointments(),
          error => this.toastService.error(error.error.errors[0], { nzDuration: 3000 }),
        );
  }

  canDelete(appointment: Appointment) {
    return appointment.dateTime.getTime() >= new Date().getTime();
  }
}
