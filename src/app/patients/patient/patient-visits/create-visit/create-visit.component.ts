import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room, RoomsService } from '@common/services/rooms';
import { ServicesService, Service } from '@common/services/services';
import { ControlSelectionComponent } from '@common/modules/form-controls/control-selection/control-selection.component';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { FormUtils } from '@common/utils/form';
import { Visit, VisitsService } from '@common/services/visits';
import { VisitReason, VisitReasonsService } from '@common/services/visit-reasons';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { HttpErrorResponse } from '@angular/common/http';
import { DateUtils } from '@common/utils/date';
import { DealsService } from '@common/services/deals.service';
import { extract } from '@common/utils/object';
import { LeadSourcesService } from '@common/services/lead-sources';
import { DealStatusesService } from '@common/services/dictionaries/deal-statuses.service';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { DoctorsService } from '@common/services/doctors';
import { PurchaseService } from '@common/services/purchase.service';
import { Entity } from '@common/interfaces/Entity';
import { PurchaseStatusesService } from '@common/services/purchase-statuses.service';
import { Status } from '@common/interfaces/Status';
import { MedicalServicesService } from '@common/services/medical-services.service';
import { AuthService } from '@common/services/auth';
import { BranchesService } from '@common/services/dictionaries/branches.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'sl-create-visit',
  templateUrl: './create-visit.component.html',
  styleUrls: ['./create-visit.component.less'],
  providers: [DealStatusesService, PurchaseService, PurchaseStatusesService, BranchesService],
})
export class CreateVisitComponent implements OnInit {
  @Input()
  contactId: string;
  @Input()
  visitsManager: VisitsManager;
  @ViewChild('roomSelection') roomSelection: ControlSelectionComponent;
  @ViewChild('reasonSelection') reasonSelection: ControlSelectionComponent;
  public form: FormGroup;
  public rooms: Room[];
  public reasons: VisitReason[];
  public medicalServices: Service[];
  public isBusy = false;
  public doctorServiceWrapper = {
    getList: (_, pageParams) => this.doctorService.getList(pageParams),
  };
  public getDeals = { getList: (_, pageParams) => this.dealService.getList({ contactId: this.contactId, isOpen: true }, pageParams) };
  private _contactVisitCount: number;
  public purchases: Entity[];
  branches: any[];
  selectedBranch: any;
  fromPaginationChunk = response => response.data;
  get hasPurchases() {
    return (this.purchases && this.purchases.length > 0);
  }

  constructor(
    private fb: FormBuilder,
    private roomsService: RoomsService,
    public doctorService: DoctorsService,
    public medicalService: ServicesService,
    private visitsService: VisitsService,
    private messageService: NzMessageService,
    public visitReasonService: VisitReasonsService,
    public dealService: DealsService,
    public leadSourcesService: LeadSourcesService,
    public dealStatusesService: DealStatusesService,
    public modal: NzModalRef,
    public purchaseService: PurchaseService,
    private purchaseStatusesService: PurchaseStatusesService,
    private availableMedicalServicesService: MedicalServicesService,
    private authService: AuthService,
    private branchesService: BranchesService,
  ) {
    this.form = fb.group({
      deal: [null, [Validators.required]],
      leadSource: [{ value: null, disabled: true }, [Validators.required]],
      dealStatus: [{ value: null, disabled: true }, Validators.required],
      dateTime: [new Date(), [Validators.required]],
      medicalService: [null, [Validators.required]],
      room: [null, [Validators.required]],
      visitReason: [null, [Validators.required]],
      doctor: [null, [Validators.required]],
      createNewDeal: [false],
      purchase: [null],
    });
    this.form.controls['deal']
      .valueChanges
      .filter(value => value)
      .subscribe(
        (deal) => {
          const currentPurchase = (deal.purchaseId) ?
            this.purchases.find(value => value.id === deal.purchaseId) : null;
          this.form.patchValue({
            medicalService: extract(deal, 'medicalService'),
            purchase: currentPurchase,
          });
        },
      );
    this.form.controls['createNewDeal']
      .valueChanges
      .subscribe(
        (status) => {
          const deal = this.form.get('deal');
          const leadSource = this.form.get('leadSource');
          const dealStatus = this.form.get('dealStatus');
          if (status) {
            deal.disable();
            leadSource.enable();
            dealStatus.enable();
          } else {
            deal.enable();
            leadSource.disable();
            dealStatus.disable();
          }
        },
      );
    this.form.controls['medicalService']
      .valueChanges
      .filter(value => value)
      .switchMap((service) => {
        this.roomSelection.isLoading = true;
        this.reasonSelection.isLoading = true;
        return this.visitReasonService.getList(service.id);
      })
      .subscribe((visitReasons) => {
        this.reasons = visitReasons;
        if (this._contactVisitCount > 0) {
          this.reasons.forEach(reason => reason.disabled = (reason.sysName === 'FirstReception'));
        }
        this.form.patchValue({
          room: this.rooms[0],
          visitReason: (this._contactVisitCount > 0) ? this.reasons.find(reason => reason.sysName !== 'FirstReception') : this.reasons[0],
        });
        this.reasonSelection.isLoading = false;
        this.roomSelection.isLoading = false;
      });

    this.form.controls['purchase']
        .valueChanges
        .subscribe((value) => {
          if (value) {
            this.availableMedicalServicesService.getByPurchasePatient(value.id, this.contactId)
                .subscribe((response) => {
                  this.medicalServices = response;
                  if (response.length > 0) {
                    const deal = this.form.controls['deal'].value;
                    const currentService = extract(deal, 'medicalService');
                    this.form.controls['medicalService'].setValue(currentService);
                  } else {
                    this.form.controls['medicalService'].setValue(null);
                  }
                });
          }
        });
  }

  onSelectBranch(id: string) {
    this.isBusy = true;

    Observable.
      forkJoin(this.medicalService.getList([id]), this.roomsService.getList(null, id))
      .subscribe(([services, rooms]) => {
        this.medicalServices = services;
        this.rooms = rooms;

        this.isBusy = false;
      });
  }

  ngOnInit() {
    this.branchesService.getList(null, { pageSize: 500 })
      .subscribe((list: any) => {
        this.branches = list.data.filter((branch: any) => this.authService.user.branchIds.includes(branch.id));
        this.selectedBranch = this.authService.user.branchIds[0];
        this.onSelectBranch(this.selectedBranch);
      });

    this.visitsService
        .getList(this.contactId, { pageSize: 500 })
        .subscribe(response => this._contactVisitCount = (response.data) ? response.data.length : 0,
                  () => this.messageService.error('Не удалось загрузить посещения, попробуйте позднее', { nzDuration: 4000 }));
    this.purchaseStatusesService
        .getList()
        .map((statuses: Status[]) => {
          const paramStatuses = statuses.filter((status: Status) => {
            return ['Consideration', 'Posted', 'WinButNotSign', 'WinAndSign', 'ConcludedWithReestr', 'ConcludedWithoutReestr', 'PartExecuted'].includes(status.sysName);
          });
          return paramStatuses;
        }).switchMap((statuses: Status[]) =>
          this.purchaseService
              .getPurchasesByPatientId(this.contactId, statuses, true),
        )
        .subscribe((response) => {
          this.purchases = response.map(purchase => ({ id: purchase.id, name: purchase.noticeNumber }));
        });
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      FormUtils.markAsDirty(form);
      return;
    }
    this.isBusy = true;
    const visit: Visit = form.value;
    const latest: Visit = this.visitsManager.findLatestVisit();

    this.visitsService.create({
      dateTime: DateUtils.toISODateString(visit.dateTime),
      dateTimeStart: DateUtils.toISODateTimeString(visit.dateTime),
      medicalServiceId: visit.medicalService.id,
      roomId: visit.room.id,
      visitReasonId: visit.visitReason.id,
      doctorId: visit.doctor.id,
      contactId: this.contactId,
      weight: extract(latest, 'weight'),
      growth: extract(latest, 'growth'),
      disabilityGroupId: extract(latest, 'disabilityGroup.id'),
      anamnesis: extract(latest, 'anamnesis'),
      iprPrpId: extract(latest, 'iprPrp.id'),
      iprPrpActualDate: extract(latest, 'iprPrpActualDate'),
      iprPrpComment: extract(latest, 'iprPrpComment'),
      stumpVicesVkId: extract(visit, 'stumpVicesVk.id'),
      diagnosis1Id: extract(latest, 'diagnosis1.id'),
      diagnosis2Id: extract(latest, 'diagnosis2.id'),
      mkb10Id: extract(latest, 'mkb10.id'),
      attendantDiagnosis: extract(latest, 'attendantDiagnosis'),
      purchaseId: extract(this.form.value, 'purchase.id'),
      ...this.form.value.createNewDeal
        ? {
          dealCreateRequest: {
            contragentId: this.contactId,
            representativeId: this.contactId,
            leadSourceId: extract(this.form.value, 'leadSource.id'),
            dealStatusId: extract(this.form.value, 'dealStatus.id'),
          },
        }
        : {
          dealId: extract(this.form.value, 'deal.id'),
        },
    }).subscribe(
      (newVisit) => {
        this.modal.destroy(newVisit);
      },
      error => this.onError(error),
      () => {
        this.isBusy = false;
      });
  }

  private onError(response: HttpErrorResponse) {
    let message = 'Произошла ошибка';
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      message = errors[0];
    }
    this.messageService.error(message, { nzDuration: 3000 });
  }

  closeForm() {
    this.modal.destroy();
  }

}
