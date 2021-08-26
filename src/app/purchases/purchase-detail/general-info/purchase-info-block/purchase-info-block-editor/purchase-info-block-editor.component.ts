import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Purchase } from '@common/models/purchase';
import { PurchaseTenderPlatform } from '@common/models/purchase-tender-platform';
import { PurchaseType } from '@common/models/purchase-type';

import { PurchaseStore } from '@common/services/purchase.store';
import { PurchaseTenderPlatformsService } from '@common/services/purchase-tender-platforms.service';
import { PurchaseStatusesService } from '@common/services/purchase-statuses.service';
import { PurchaseTypesService } from '@common/services/purchase-types.service';
import { PurchaseCreateService } from '@common/services/purchase-create.service';
import { FormUtils } from '@common/utils/form';
import { EisService } from '@common/services/eis.service';
import { Eis } from '@common/models/eis';
import { PurchaseChaptersService } from '@common/services/purchase-chapters.service';
import { Entity } from '@common/interfaces/Entity';
import { Status } from '@common/interfaces/Status';
import { Subject } from 'rxjs/Subject';
import { PurchaseHelper } from '@modules/purchases/purchase-detail/helpers/purchase-helper';
import { PurchaseService } from '@common/services/purchase.service';
import { ToastsService } from '@common/services/toasts.service';
import { PurchaseResponsible } from '@common/models/purchase-responsible';
import * as moment from 'moment';

@Component({
  selector: 'sl-purchase-info-block-editor',
  templateUrl: './purchase-info-block-editor.component.html',
  styleUrls: ['./purchase-info-block-editor.component.less'],
})
export class PurchaseInfoBlockEditorComponent implements OnInit, OnDestroy {
  @Input() componentType: string; // create of edit
  @Input() responsible: PurchaseResponsible;
  @Output() changeMode = new EventEmitter();
  @Output() loadEis = new EventEmitter<Eis>();
  purchaseInfoForm: FormGroup;

  purchaseTenderPlatforms: PurchaseTenderPlatform[];
  purchaseStatuses: Status[];
  purchaseTypes: PurchaseType[];
  selectedPlatform: any;
  purchaseChapters: Entity[];

  @ViewChild('tenderPlatformEl') tenderPlatformEl;
  @ViewChild('formEl') formEl: ElementRef;
  public isBusy = false;
  private unsubscriber$ = new Subject();
  private purchaseInitialData: Purchase;

  constructor(
    private fb: FormBuilder,
    private purchaseStore: PurchaseStore,
    private purchaseService: PurchaseService,
    private purchaseTenderPlatformsService: PurchaseTenderPlatformsService,
    private purchaseStatusesService: PurchaseStatusesService,
    private purchaseTypesService: PurchaseTypesService,
    private purchaseCreateService: PurchaseCreateService,
    private eisService: EisService,
    private purchaseChaptersService: PurchaseChaptersService,
    private toastsService: ToastsService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadDictionariesData();
    this.setFormType();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
  }

  private setFormType() {
    switch (this.componentType) {
      case 'create':
        this.subscribeClick(false);
        break;
      case 'edit':
        this.subscribeClick(true);
        this.fillForm();
        break;
    }
  }

  private subscribeClick(isEdit: boolean) {
    const subj = this.purchaseCreateService.getSubject();
    subj.takeUntil(this.unsubscriber$).subscribe((_) => {
      if (isEdit) {
        return this.onSubmit(this.purchaseInfoForm);
      }
      this.createPurchase();
    });
  }

  fillForm() {
    this.purchaseStore.getState().subscribe((purchaseData: Purchase) => {
      const tender = purchaseData.tenderPlatform;
      const type = purchaseData.purchaseType;
      const status = purchaseData.purchaseStatus;

      const temp = Object.assign({}, purchaseData);
      delete temp.tenderPlatform;
      delete temp.purchaseType;
      delete temp.purchaseStatus;
      temp['tenderPlatformId'] = tender.id;
      temp['purchaseTypeId'] = type.id;
      temp['purchaseStatusId'] = status.id;
      temp['purchaseChapterIds'] = temp.purchaseChapters ? temp.purchaseChapters.map(item => item.id) : null;
      this.purchaseInfoForm.patchValue(temp);
      this.purchaseInitialData = purchaseData;
    });
  }

  initForm() {
    this.purchaseInfoForm = this.fb.group({
      noticeNumber: [null, [Validators.required]],
      purchaseTypeId: [null, [Validators.required]],
      contractNumber: [null],
      tenderPlatformId: [null, [Validators.required]],
      purchaseCode: this.fb.control(null),
      purchaseUrl: [null, [Validators.required]],
      purchaseStatusId: [null, [Validators.required]],
      purchaseChapterIds: [],
      deadline: [null, [Validators.required]],
      contractCompleteDate: [null],
      startMaxContractPrice: [null, [Validators.required]],
      contractPriceDeclinePercent: this.fb.control(null),
      contractDate: this.fb.control(null),
      bidDateTimeEnd: this.fb.control(null),
      bidReviewDateTimeEnd: [null, [Validators.required]],
      auctionDateLocal: this.fb.control(null),
      finalContractPrice: this.fb.control(null),
      includeResidenceCompensationSum: this.fb.control(null),
      contractProvision: this.fb.control(null),
      paymentOrderNumber: this.fb.control(null),
      paymentDate: this.fb.control(null),
      returnDate: this.fb.control(null),
      returnProvisionNotificationDate: this.fb.control(null),
      isReturnProvision: this.fb.control(false),
      organizationRequisites: this.fb.control(null),
      note: this.fb.control(''),
    });
  }

  loadDictionariesData() {
    this.purchaseTenderPlatformsService.getList().subscribe((data) => {
      this.purchaseTenderPlatforms = data;
    });
    this.purchaseStatusesService.getList().subscribe((data) => {
      this.purchaseStatuses = data;
    });
    this.purchaseTypesService.getList().subscribe((data) => {
      this.purchaseTypes = data;
    });
    this.purchaseChaptersService.getList().subscribe((data) => {
      this.purchaseChapters = data;
    });
  }

  onSubmit(form) {
    if (this.purchaseInfoForm.invalid) {
      this.markFormDirty();
      return;
    }
    this.isBusy = true;
    const purchaseModel = PurchaseHelper.getPurchaseModel({ ...this.purchaseInitialData, ...this.convertatinFromFormToPurchase() });
    this.purchaseService.update(this.purchaseInitialData.id, purchaseModel)
      .subscribe(
        (purchase: Purchase) => {
          this.purchaseStore.updateState(purchase);
          this.toastsService.onSuccess('Информация о закупке обновлена');
          this.toViewMode();
          this.isBusy = false;
        },
        (error) => { this.toastsService.onError(error);  this.isBusy = false; },
      );
  }

  private markFormDirty()  {
    FormUtils.markAsDirty(this.purchaseInfoForm);
    const event = new Event('purchaseCreateScroll');
    this.formEl.nativeElement.dispatchEvent(event);
  }

  private createPurchase() {
    if (this.purchaseInfoForm.invalid) {
      this.markFormDirty();
      return;
    }

    const data = this.convertatinFromFormToPurchase();
    this.changeMode.emit(data);
  }

  private convertatinFromFormToPurchase() {
    const tenderId = this.purchaseInfoForm.get('tenderPlatformId').value;
    const typeId = this.purchaseInfoForm.get('purchaseTypeId').value;
    const statusId = this.purchaseInfoForm.get('purchaseStatusId').value;

    const tender = this.purchaseTenderPlatforms.find(item => item.id === tenderId);
    const type = this.purchaseTypes.find(item => item.id === typeId);
    const status = this.purchaseStatuses.find(item => item.id === statusId);
    const chapters = this.purchaseInfoForm.value.purchaseChapterIds ?
      this.purchaseInfoForm.value.purchaseChapterIds.map((id) => {
        return this.purchaseChapters.find(chapter => chapter.id === id);
      }) : [];

    const data = Object.assign({}, this.purchaseInfoForm.value);
    delete data.tenderPlatformId;
    delete data.purchaseTypeId;
    delete data.purchaseStatusId;
    delete data.purchaseChapterIds;


    data['tenderPlatform'] = tender;
    data['purchaseType'] = type;
    data['purchaseStatus'] = status;
    data['purchaseChapters'] = chapters;
    return data;
  }

  toViewMode() {
    this.changeMode.emit(false);
  }

  goToPurchases() {
    const url = this.purchaseInfoForm.value.purchaseUrl;
    if (!url) {
      return;
    }
    const page = window.open(url, '_blank');
    page.focus();
  }

  loadPurchaseData() {
    const noticeNumber = this.purchaseInfoForm.get('noticeNumber').value;
    if (!noticeNumber) { return; }
    const params = { noticeNumber };
    this.eisService.get(params).subscribe((eis: Eis) => {
      this.fillFormFromEis(eis);
      this.loadEis.emit(eis);
    }, (err) => {
      const message = err.error.errors['0'];
      this.toastsService.error(message, { nzDuration: 3000 });
    });
  }

  private fillFormFromEis(data) {
    const {
      noticeNumber,
      purchaseUrl,
      purchaseCode,
      contractDate,
      bidDateTimeEnd,
      auctionDate,
      contractProvision,
      purchaseType,
      diffHours,
      tenderPlatform,
      startMaxContractPrice,
      bidReviewDateTimeEnd,
      note,
    } = data;


    this.purchaseInfoForm.patchValue({
      noticeNumber,
      purchaseUrl,
      purchaseCode,
      contractDate,
      bidDateTimeEnd,
      contractProvision,
      startMaxContractPrice,
      bidReviewDateTimeEnd,
      auctionDate: moment(auctionDate).add(diffHours, 'hours'),
      auctionDateLocal: auctionDate,
      purchaseTypeId: purchaseType.id,
      tenderPlatformId: tenderPlatform.id,
      note,
    });
  }
}
