import {
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
  Input,
  Output,
  ChangeDetectorRef,
  OnDestroy,
  HostListener
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { Observable } from 'rxjs/Observable';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { Appointment, AppointmentsService } from '@common/services/appointments';
import { Contact } from '@common/models/contact';
import { DateUtils } from '@common/utils/date';
import { Doctor, DoctorsService } from '@common/services/doctors';
import { Room, RoomsService } from '@common/services/rooms';
import { Service, ServicesService } from '@common/services/services';
import { SignalR } from '@common/services/signalR';
import { VisitReason, VisitReasonsService } from '@common/services/visit-reasons';
import { Shedule } from '@common/models/shedule';
import { AuthService } from '@common/services/auth';
import { BranchesService } from '@common/services/dictionaries/branches.service';
import {MAIN_BRANCH} from "@common/constants/access-roles-to-the-path.constant";
import {Subject} from "rxjs";
import {filter, switchMap, takeUntil} from "rxjs/operators";
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
import {UsersService} from "@common/services/users";
import {WorkedTimeRange} from '@common/models/worked-time';

@Component({
  selector: 'sl-shedule',
  templateUrl: './shedule.component.html',
  styleUrls: ['./shedule.component.less'],
  providers: [
    BranchesService,
  ],
})
export class SheduleComponent implements OnInit, OnDestroy {
  @HostListener("window:beforeunload", ["$event"]) beforeunloadHandler(event: Event) {
    event.returnValue = false;

    this.clearSchedule();
  }

  @ViewChild(AppointmentFormComponent)
  appointmentForm: AppointmentFormComponent;

  @Input()
  appointment: Appointment = null;

  @Input()
  contact: Contact = null;

  @Input()
  service: Service = null;

  @Input()
  services: Service[];

  @Input()
  purchaseId: string;

  @Output()
  appointmentCreated = new EventEmitter<Appointment>();

  form: FormGroup;
  visitReasons: VisitReason[];
  rooms: Room[];

  doctors: Doctor[];
  allDoctors: Doctor[];
  displayedDoctor: Doctor;

  date: Date;
  shedule: Shedule;
  sheduleLoading = false;
  branches: any[];
  selectedBranch: any;
  hasCome: boolean;
  anotherSelected: string[] = [];
  destroyed$ = new Subject();
  public timeStep = this.formBuilder.control(30);

  constructor(
    private appointmentsService: AppointmentsService,
    private formBuilder: FormBuilder,
    private modalService: NzModalService,
    private roomsService: RoomsService,
    private doctorService: DoctorsService,
    private authService: AuthService,
    private servicesService: ServicesService,
    private signalR: SignalR,
    private visitReasonsService: VisitReasonsService,
    private branchesService: BranchesService,
    private cd: ChangeDetectorRef,
    private _router: Router,
    public userService: UsersService,
  ) {
    this.form = this.formBuilder.group({
      service: [null, Validators.required],
      visitReason: [null],
      mondayDate: [DateUtils.getMondayDate(new Date()), Validators.required],
      room: [null, Validators.required],
      doctor: [null],
    });
  }

  get loading() {
    return this.rooms == null || this.services == null || this.visitReasons == null || this.shedule == null;
  }

  onSelectBranch(id: string) {
    this.sheduleLoading = true;

    Observable
      .forkJoin(
        this.roomsService.getList(null, id),
        this.servicesService.getList([id]),
        this.doctorService.getDoctors(id),
      )
      .subscribe(([rooms, services, doctorsData]) => {
        const doctor = this.form.get('doctor').value;

        this.sheduleLoading = false;

        this.setRooms(rooms);
        this.services = services;
        this.allDoctors = doctorsData;
        this.doctors = doctorsData;

        this.form.patchValue({
          service: this.service ? services.find(s => s.id === this.service.id) : services[0],
          doctor: (doctor && doctorsData.find(d => d.id === doctor.id)) || null,
        });
      });
  }

  ngOnInit() {
    this.onChanges();
    this._addSocketListener();
    this._addStepListener();

    this.branchesService.getList(null, { pageSize: 500 })
      .subscribe((list: any) => {
        const ids = this.authService.user.branchIds;
        const corsetId: string = '28a62e3a-3e54-4323-9d07-67a56363a6df';

        this.branches = list.data.filter((branch: any) => ids.includes(branch.id));
        this.selectedBranch = ids.includes(MAIN_BRANCH) ? MAIN_BRANCH : this.authService.user.branchIds[0];

        Observable
          .forkJoin(
            this.servicesService.getList([this.selectedBranch]),
            this.doctorService.getDoctors(this.selectedBranch),
            this.roomsService.getList(null, this.selectedBranch),
          )
          .subscribe(([services, doctorsData, rooms]) => {
            const corsetItem: Service = services.find((service: Service) => service.id === corsetId);

            this.services = services;
            this.doctors = doctorsData;
            this.allDoctors = doctorsData;

            this.form.patchValue({ service: corsetItem || services[0] });

            this.setRooms(rooms);
            this.loadVisitReasons(corsetItem ? corsetId : services[0].id);

            this.appointmentsService.appointmentCreated.subscribe((appointment) => {
              if (this.date != null && DateUtils.equals(appointment.dateTimeStart, this.date)) {
                this.appointment = appointment;
              }
              this.updateShedule([appointment, ...this.shedule.appointments]);
            });

            this.appointmentsService.appointmentChanged.subscribe((appointment) => {
              if (this.date != null && DateUtils.equals(appointment.dateTimeStart, this.date)) {
                this.appointment = appointment;
              }
              this.updateShedule(this.shedule.appointments.map(a => a.id === appointment.id ? appointment : a));
            });

            this.appointmentsService.appointmentDeleted.subscribe((appointmentId: string) => {
              if (this.appointment != null && this.appointment.id === appointmentId) {
                this.contact = this.appointment.contact;
                this.appointment = null;
              }
              this.updateShedule(this.shedule.appointments.filter(a => a.id !== appointmentId));
            });
          });
      });

    this._router.events
      .pipe(
        filter((e: RouterEvent) => e instanceof NavigationEnd),
        switchMap(() => {
          return this.userService.changeSchedule({
            id: this.authService.user.id,
            date: null,
            roomId: this.form.value.room && this.form.value.room.id,
          })
        })
      )
      .subscribe()
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private _addStepListener(): void {
    this.timeStep.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.shedule = Object.assign({}, this.shedule);
      });
  }

  private clearSchedule(): void {
    this.userService.changeSchedule({
      id: this.authService.user.id,
      date: null,
      roomId: this.form.value.room && this.form.value.room.id,
    }).subscribe();
  }

  private _addSocketListener(): void {
    this.signalR.on<{ id: string, date: string, roomId: string }[]>('change.schedule')
      .pipe(takeUntil(this.destroyed$))
      .subscribe((dates: { id: string, date: string, roomId: string }[]) => {
        console.log(`CHANGE_SCHEDULE`, dates);

        this.anotherSelected = dates
          .filter(({ id, date, roomId }) =>
            date && this.form.value.room && this.authService.user.id !== id && this.form.value.room.id === roomId)
          .map((anotherDate: {id: string, date: string}) => anotherDate.date);

        this.cd.markForCheck();
      });

    this.signalR.on<{ id: string, roomId: string }>('saved.appointment')
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ id, roomId }) => {
        console.log(`SAVED_APPOINTMENT`);

        if (this.authService.user.id !== id && this.form.value.room === roomId) {
          const { room, mondayDate, doctor } = this.form.value;

          this.loadShedule(room, mondayDate, doctor).subscribe();

          this.cd.markForCheck();
        }
      });
  }

  onSelectAppointment(appointment: Appointment) {
    if (appointment === this.appointment) { return; }
    const { touched } = this.appointmentForm.form;
    if (touched) {
      return this.showOnChangeWarning(() => {
        this._onSelectAppointment(appointment);
      });
    }

    this.clearSchedule();

    this._onSelectAppointment(appointment);
  }

  onSelectDate(date: Date) {
    if (date === this.date) { return; }
    const { isNewVisit, form: { touched } } = this.appointmentForm;
    if (touched && !isNewVisit && this.appointment) {
      return this.showOnChangeWarning(() => {
        this._onSelectDate(date);
      });
    }
    this._onSelectDate(date);

    this.userService.changeSchedule({
      id: this.authService.user.id,
      date,
      roomId: this.form.value.room && this.form.value.room.id,
    }).subscribe();
  }

  private showOnChangeWarning(nzOnOk: () => void) {
    this.modalService.warning({
      nzOnOk,
      nzTitle: 'Все несохраненные изменения будут удалены, продолжить?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzZIndex: 1200,
    });
  }

  private _onSelectAppointment(appointment: Appointment) {
    this.appointment = appointment;
    this.contact = this.appointment.contact;
    this.date = appointment.dateTimeStart;
    this.appointmentForm.isNewVisit = false;

    const doctor = this.doctors.find((d: Doctor) => d.id === appointment.doctor.id);

    this.form.get('doctor').patchValue(doctor);

    this.appointmentForm.markAsPristine();
    this.appointmentForm.markAsUntouched();
  }

  private _onSelectDate(date: Date) {
    if (this.appointment) {
      this.contact = null;
      this.appointment = null;
    }
    if (!this.appointmentForm.form.touched) { this.appointmentForm.markAsPristine(); }
    this.date = date;
  }

  onSelectDoctor(defaultDoctor: Doctor) {
    if (this.appointment || !this.form.value.doctor) {
      this.displayedDoctor = defaultDoctor;
    } else if (!this.appointment && this.form.value.doctor) {
      this.displayedDoctor = this.form.value.doctor;
    }
  }

  onSelectDefaultDoctor(defaultDoctor: string) {
    if (!this.form.value.doctor) {
      this.form.get('doctor').patchValue(this.allDoctors.find((doctor: Doctor) => doctor.id === defaultDoctor));
    }
  }

  onWeekChange(date: Date) {
    this.form.patchValue({ mondayDate: date });
  }

  onAppointmentCreated(appointment: Appointment) {
    this.appointmentCreated.emit(appointment);
  }

  public come(value: boolean): void {
    this.hasCome = value;
  }

  onSelectContact(contact: Contact) {
    this.contact = contact;
    this.appointmentForm && this.appointmentForm.markAsPristine();
    this.cd.detectChanges();
  }

  private onChanges() {
    this.form.get('service').valueChanges.skip(1).subscribe((service) => {
      this.loadVisitReasons(service.id);
    });
    this.form.get('visitReason').valueChanges.skip(1).subscribe((visitReason) => {
      if (this.date != null && visitReason != null && this.date.getMinutes() % visitReason.visitReasonTime !== 0) {
        this.date = null;
      }
      this.shedule = Object.assign({}, this.shedule);
    });
    this.form.get('room').valueChanges.skip(1).subscribe((room) => {
      this.clearSchedule();

      const { mondayDate, doctor } = this.form.value;

      this.loadShedule(room, mondayDate, doctor).subscribe(() => {
        this.userService.changeSchedule({
          id: this.authService.user.id,
          date: this.date,
          roomId: this.form.value.room && this.form.value.room.id,
        }).subscribe();
      });
    });
    this.form.get('doctor').valueChanges.subscribe((doctor) => {
      const { room, mondayDate } = this.form.value;

      this.displayedDoctor = doctor;

      if (this.appointment && this.appointment.doctor.id === doctor.id) {
        this.appointment.doctor = {
          ...this.appointment.doctor,
          ...doctor,
        };
      }

      if (!this.appointment || (this.appointment && this.appointment.doctor.id !== doctor.id)) {
        this.appointment = null;
        this.contact = null;
        this.date = null;
        this.clearSchedule();
      }

      this.loadShedule(room, mondayDate, doctor).subscribe();
    });
    this.form.get('mondayDate').valueChanges.subscribe((mondayDate) => {
      if (mondayDate != null) {
        const { room, doctor } = this.form.value;
        this.loadShedule(room, DateUtils.getMondayDate(mondayDate), doctor).subscribe();
      }
    });
  }

  private updateShedule(appointments: Appointment[]) {
    const { mondayDate, room, workedTime } = this.shedule;
    this.shedule = new Shedule({ appointments, mondayDate, room, workedTime });
  }

  private loadVisitReasons(serviceId: string) {
    this.sheduleLoading = true;

    this.visitReasonsService.getList(serviceId)
      .subscribe(visitReasons => this.setVisitReasons(visitReasons));
  }

  private loadShedule(room: Room, mondayDate: Date, doctor: Doctor) {
    this.sheduleLoading = true;

    return Observable
      .forkJoin(
        this.appointmentsService.getListForRoom(room.id, mondayDate),
        doctor != null ? this.appointmentsService.getListForDoctor(doctor.id, mondayDate) : Observable.of([]),
        this.roomsService.doctorWeekRoomWorkTime(room.id, mondayDate),
      )
      .map(([appointments, doctorAppointments, workedTime]) => {
        const doctorValue: Doctor = this.form.get('doctor').value;
        const doctorIds: string[] = workedTime.times.map((time: WorkedTimeRange) => time.doctorId);

        this.doctors = (this.allDoctors || []).filter((doctorItem: Doctor) => doctorIds.includes(doctorItem.id));

        if (doctorValue) {
          workedTime.times = workedTime.times.filter((time: WorkedTimeRange) => time.doctorId === doctorValue.id);
        }

        const scheduleAppointments = doctorValue ? [...doctorAppointments] : [...appointments];

        this.shedule = new Shedule({ mondayDate, room, workedTime, appointments: scheduleAppointments });
        this.userService.changeSchedule({
          id: this.authService.user.id,
          date: this.date || null,
          roomId: this.form.value.room && this.form.value.room.id,
        }).subscribe();
      })
      .finally(() => { this.sheduleLoading = false; });
  }

  private setVisitReasons(visitReasons: VisitReason[]) {
    this.visitReasons = visitReasons;
    const visitReason = this.form.get('visitReason').value;

    if (visitReason == null || this.findVisitReason(visitReason.id) == null) {
      this.form.patchValue({ visitReason: visitReasons[0] });
    }

    this.sheduleLoading = false;
  }

  private setRooms(rooms: Room[]) {
    this.rooms = rooms;

    this.loadShedule(rooms[0], this.form.get('mondayDate').value, this.form.get('doctor').value).subscribe();

    this.form.patchValue({ room: rooms[0] });
  }

  public isVisitReasonDisable(reason: VisitReason) {
    return (this.contact && this.contact.visitCount > 0 && reason.sysName === 'FirstReception');
  }

  private findVisitReason(reasonId) {
    return this.visitReasons.find(r => r.id === reasonId);
  }
}
