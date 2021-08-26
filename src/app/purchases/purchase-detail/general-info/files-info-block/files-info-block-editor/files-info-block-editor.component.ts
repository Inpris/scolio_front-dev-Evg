import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Purchase } from '@common/models/purchase';
import { PurchaseStore } from '@common/services/purchase.store';
import { PurchaseType } from '@common/models/purchase-type';
import { FileTypesService } from '@common/services/file-types.service';
import { FilesService } from '@common/services/file.service';
import { DocumentItem } from '@common/models/document-item';
import { PurchaseService } from '@common/services/purchase.service';
import { FormUtils } from '@common/utils/form';
import { UploadFile } from 'ng-zorro-antd';
import { AuthService } from '@common/services/auth';
import { PurchaseCreateService } from '@common/services/purchase-create.service';
import { Subject } from 'rxjs/Subject';
import { PurchaseHelper } from '@modules/purchases/purchase-detail/helpers/purchase-helper';
import { ToastsService } from '@common/services/toasts.service';

@Component({
  selector: 'sl-files-info-block-editor',
  templateUrl: './files-info-block-editor.component.html',
  styleUrls: ['./files-info-block-editor.component.less'],
})
export class FilesInfoBlockEditorComponent implements OnInit, OnDestroy {
  @Input() componentType: string; // edit of create
  @Output() changeMode = new EventEmitter();
  @ViewChild('formEl') formEl: ElementRef;
  filesInfoForm: FormGroup;
  fileTypes: PurchaseType[] = [];
  tempArrFileIds: string[] = [];
  public isBusy = false;
  public fileList = [];

  get files(): FormArray {
    return this.filesInfoForm.get('files') as FormArray;
  }

  fileToUpload: any;
  purchaseData: Purchase;
  saveBtnDisable: boolean = null;
  documents: DocumentItem[] = [];
  private unsubscriber$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private purchaseStore: PurchaseStore,
    private fileTypesService: FileTypesService,
    private filesService: FilesService,
    private purchaseService: PurchaseService,
    private authService: AuthService,
    private purchaseCreateService: PurchaseCreateService,
    private toastService: ToastsService,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.subscribeClick(this.componentType !== 'create');
    this.getPurchase();
    this.loadDictionariesData();
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
  }

  private subscribeClick(isEdit: boolean) {
    const subj = this.purchaseCreateService.getSubject();
    subj.takeUntil(this.unsubscriber$).subscribe((_) => {
      if (isEdit) {
        return this.saveData();
      }
      if (this.filesInfoForm.invalid) {
        this.updateFormState();
        return;
      }
      this.documents = this.getDocumentsModel();
      this.changeMode.emit();
    });
  }

  getPurchase() {
    this.purchaseStore.getState().subscribe((purchaseData: Purchase) => {
      this.purchaseData = purchaseData;
      if (!purchaseData.documents) {
        this.upload();
        return;
      }
      this.fillForm();
    });
  }


  private fillForm() {
    this.purchaseData.documents.forEach((document) => {
      this.upload(document);
    });
  }

  onFileChosen = (file: UploadFile) => {
    if (!file) {
      return;
    }
    this.isBusy = true;
    this.filesService.createTemp(file)
      .subscribe(({ tempAttachmentId, fileName }) => {
        this.saveBtnDisable = null;
        this.tempArrFileIds.push(tempAttachmentId);
        this.files.push(this.initFile({
          tempAttachmentId,
          fileName,
          createdBy: { name: this.authService.user.abbreviatedName },
          createdDate: new Date(),
        }));
      }, (err) => {
        console.dir(err);
      }, () => {
        this.isBusy = false;
      });
    return false;
  }

  initForm() {
    this.filesInfoForm = this.fb.group({
      files: this.fb.array([]),
    });
  }

  initFile(data?) {
    return this.fb.group({
      id: [data && data.id ? data.id : null],
      documentTypeId: [data && data.documentType && data.documentType.id ? data.documentType.id : null, [Validators.required]],
      name: [data && data.fileName ? data.fileName : null, [Validators.required]],
      attachmentId: [data && data.attachmentId ? data.attachmentId : null],
      tempAttachmentId: [data && data.tempAttachmentId ? data.tempAttachmentId : null],
      createdBy: [data && data.createdBy ? data.createdBy : null],
      createdDate: [data && data.createdDate ? data.createdDate : null],
    });
  }

  loadDictionariesData() {
    this.fileTypesService.getList().subscribe((statues) => {
      this.fileTypes = this.fileTypes.concat(statues);
    });
  }

  upload(data?) {
    this.files.push(this.initFile(data));
  }

  removeItem(index) {
    this.files.removeAt(index);
  }

  getDocumentModel(data) {
    return {
      id: data.id,
      fileName: data.fileName,
      attachmentId: data.attachmentId,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      documentType: { id: data.documentTypeId, name: null },
      tempAttachmentId: data.tempAttachmentId,
    };
  }

  private updateFormState()  {
    FormUtils.markAsDirty(this.filesInfoForm);
    const event = new Event('purchaseCreateScroll');
    this.formEl.nativeElement.dispatchEvent(event);
  }

  public saveData() {
    if (this.files.invalid) {
      this.updateFormState();
      return;
    }
    this.isBusy = true;
    this.documents.push(...this.getDocumentsModel());
    this.purchaseData.documents = this.documents;

    const purchaseModel = PurchaseHelper.getPurchaseModel(this.purchaseData);

    this.purchaseService.update(this.purchaseData.id, purchaseModel)
      .subscribe((purchase: Purchase) => {
        this.purchaseStore.updateState(purchase);
        this.toastService.onSuccess('Информация о закупке обновлена');
        this.toViewMode();
        this.isBusy = false;
      }, (err) => {
        this.toastService.onError(err);
        this.isBusy = false;
      });

  }

  getDocumentsModel() {
    return this.files.controls.map((formFile) => {
      const temp = {
        id: formFile.value.id,
        fileName: formFile.value.name,
        attachmentId: formFile.value.attachmentId,
        tempAttachmentId: formFile.value.tempAttachmentId,
        documentTypeId: formFile.value.documentTypeId,
      };
      return this.getDocumentModel(temp);
    });
  }

  toViewMode() {
    this.changeMode.emit(false);
  }
}
