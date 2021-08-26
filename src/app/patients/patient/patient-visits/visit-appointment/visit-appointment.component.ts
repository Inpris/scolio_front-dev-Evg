import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormBuilder, Validator, Validators } from '@angular/forms';
import { ServicesService } from '@common/services/services';
import { Room, RoomsService } from '@common/services/rooms';
import { ControlSelectionComponent } from '@common/modules/form-controls/control-selection/control-selection.component';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { HealingDynamicsService } from '@common/services/dictionaries/healing-dynamics.service';
import { DoctorsService } from '@common/services/doctors';
import { VisitReason } from '@common/models/visit-reason';
import { VisitReasonsService } from '@common/services/visit-reasons';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'sl-visit-appointment',
  templateUrl: './visit-appointment.component.html',
  styleUrls: ['./visit-appointment.component.less'],
  providers: [
    ...FormValueAccessor.getAccessorProviders(VisitAppointmentComponent),
    HealingDynamicsService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitAppointmentComponent extends FormValueAccessor implements OnInit, ControlValueAccessor, Validator, OnDestroy {
  @ViewChild('roomSelection') roomSelection: ControlSelectionComponent;
  @ViewChild('reasonSelection') reasonSelection: ControlSelectionComponent;
  public rooms: Room[] = [];
  public reasons: VisitReason[];
  public medicalServices = [];
  public dynamics;
  @Input()
  medicalServiceSysName: string = '';
  @Input()
  visitsManager: VisitsManager;
  @Input()
  private unsubscriber$ = new Subject();

  doctorServiceWrapper = {
    getList: (_, pageParams) => this.doctorService.getList(pageParams),
  };

  constructor(
    private formBuilder: FormBuilder,
    public medicalService: ServicesService,
    public roomsService: RoomsService,
    public doctorService: DoctorsService,
    private healingDynamics: HealingDynamicsService,
    public visitReasonService: VisitReasonsService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.form = this.formBuilder.group({
      medicalService: [null, Validators.required],
      room: [null, Validators.required],
      doctor: [null, Validators.required],
      dateTimeStart: [null, Validators.required],
      dateTimeEnd: [null],
      healingDynamic: [null],
      visitReason: [null],
      branchId: [null],
      acceptXRay: [false],
      nextVisitDate: [null],
    });
    this.healingDynamics.getList({})
      .map(this.fromPaginationChunk)
      .subscribe(data => this.dynamics = data);

    this.form.get('branchId').valueChanges
      .filter(value => value)
      .distinctUntilChanged()
      .takeUntil(this.unsubscriber$)
      .subscribe((branch: string) => {
        this.roomSelection.isLoading = true;

        this.roomsService.getList(null, branch)
          .subscribe((rooms) => {
            this.rooms = rooms;
            this.roomSelection.isLoading = false;
          });

        this.medicalService.getList([branch])
          .subscribe((medicals) => {
            this.medicalServices = medicals;
          });
      });

    this.form.controls['medicalService']
      .valueChanges
      .filter(value => value)
      .distinctUntilChanged()
      .switchMap((service) => {
        this.reasonSelection.isLoading = true;
        return this.visitReasonService.getList(service.id);
      })
      .subscribe((reasons) => {
        this.reasons = reasons;

        if (this.visitsManager.visits.length > 1) {
          this.reasons.forEach(reason => reason.disabled = (reason.sysName === 'FirstReception'));
        }

        this.reasonSelection.isLoading = false;
      });
  }

  ngOnInit() {
    super.ngOnInit();

    this.visitsManager.visitsUpdated
      .takeUntil(this.unsubscriber$)
      .subscribe(() => {
        this.markForCheck();
      });
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  fromPaginationChunk = response => response.data;

  markForCheck() {
    this.cdr.markForCheck();
  }
}
