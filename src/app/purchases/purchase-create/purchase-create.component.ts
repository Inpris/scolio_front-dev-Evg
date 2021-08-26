import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '@common/services/customer.service';
import { PurchaseCreate } from '@common/interfaces/Purchase-create';
import { PurchaseService } from '@common/services/purchase.service';
import { Purchase } from '@common/models/purchase';
import { Router } from '@angular/router';
import { PurchaseCreateService } from '@common/services/purchase-create.service';
import { PurchaseHelper } from '@modules/purchases/purchase-detail/helpers/purchase-helper';
import { FilesInfoBlockEditorComponent } from '@modules/purchases/purchase-detail/general-info/files-info-block/files-info-block-editor/files-info-block-editor.component';
import { AdditionalInfoBlockEditorComponent } from '@modules/purchases/purchase-detail/general-info/additional-info-block/additional-info-block-editor/additional-info-block-editor.component';
import { PurchaseInfoBlockEditorComponent } from '@modules/purchases/purchase-detail/general-info/purchase-info-block/purchase-info-block-editor/purchase-info-block-editor.component';
import { ToastsService } from '@common/services/toasts.service';
import { Eis } from '@common/models/eis';
import { PurchaseResponsible } from '@common/models/purchase-responsible';

@Component({
  selector: 'sl-purchase-create',
  templateUrl: './purchase-create.component.html',
  styleUrls: ['./purchase-create.component.less'],
})
export class PurchaseCreateComponent implements OnInit {
  @ViewChild('additional') additional: AdditionalInfoBlockEditorComponent;
  @ViewChild('filesBlock') filesBlock: FilesInfoBlockEditorComponent;
  @ViewChild('purchaseBlock') purchaseBlock: PurchaseInfoBlockEditorComponent;
  componentType: string = 'create';
  infoBlockData: Purchase;
  additionalBlockData: any;
  purchaseCreateInProcess: boolean = false;
  eis: Eis;
  responsible: PurchaseResponsible;
  constructor(
    private purchaseCreateService: PurchaseCreateService,
    private customerService: CustomerService,
    private purchaseService: PurchaseService,
    private message: ToastsService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onChangeModeInfoBlock(data) {
    this.infoBlockData = data;
    if (this.checkData()) {
      this.createUpdateCustomer();
    }
  }

  onChangeModeAdditionalBlock(data) {
    this.additionalBlockData = data;
    if (this.checkData()) {
      this.createUpdateCustomer();
    }
  }

  onChangeFilesBlock(data) {
    if (this.checkData()) {
      this.createUpdateCustomer();
    }
  }

  onChangeResponsible(responsible) {
    this.responsible = responsible;
  }

  onLoadEis(eis: Eis) {
    this.eis = eis;

    this.responsible = {
      fullName: eis.responsibleUserFio,
      phone: eis.responsibleUserPhone,
      email: eis.responsibleUserEmail,
    };
  }

  checkData() {
    return this.additional.additionalInfoForm.valid
      && this.filesBlock.filesInfoForm.valid
      && this.purchaseBlock.purchaseInfoForm.valid
      && !this.purchaseCreateInProcess;
  }

  createUpdateCustomer() {
    const data = this.additional.getCustomerUpdateModel();
    this.purchaseCreateInProcess = true;
    if (data.id) {
      this.updateCustomer(data);
    } else {
      this.createCustomer(data);
    }
  }

  private createCustomer(customerForm) {
    this.customerService.create(customerForm)
      .subscribe((customer) => {
        this.createPurchase(customer);
      }, (err) => {
        this.message.onError(err);
        this.purchaseCreateInProcess = false;
      });
  }

  private updateCustomer(customerForm) {
    this.customerService.update(customerForm.id, customerForm)
      .subscribe((customer) => {
        this.createPurchase(customer);
      }, (err) => {
        this.message.onError(err);
        this.purchaseCreateInProcess = false;
      });
  }

  private createPurchase(customer) {
    const newPurchase: PurchaseCreate = PurchaseHelper.getPurchaseModel({ ...this.infoBlockData, customer });
    this.purchaseService.create({
      ...newPurchase,
      documents: this.filesBlock.documents.map(doc => (
        {
          documentTypeId: doc.documentType.id,
          tempAttachmentId: doc.tempAttachmentId,
        }
      )),
    })
      .subscribe((purchase) => {
        this.message.onSuccess('Закупка успешно создана');
        this.purchaseCreateInProcess = false;
        this.router.navigate(['purchases/' + purchase.id]);
      }, (err) => {
        this.purchaseCreateInProcess = false;
        this.message.onError(err);
      }) ;
  }

  saveData() {
    const subj = this.purchaseCreateService.getSubject();
    subj.next();
  }
}
