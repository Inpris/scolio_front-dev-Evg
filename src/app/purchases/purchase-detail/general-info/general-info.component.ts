import { Component, ViewChild } from '@angular/core';
import { PurchaseCreateService } from '@common/services/purchase-create.service';
import { AdditionalInfoBlockComponent } from '@modules/purchases/purchase-detail/general-info/additional-info-block/additional-info-block.component';
import { PurchaseInfoBlockComponent } from '@modules/purchases/purchase-detail/general-info/purchase-info-block/purchase-info-block.component';
import { FilesInfoBlockComponent } from '@modules/purchases/purchase-detail/general-info/files-info-block/files-info-block.component';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'sl-purchase-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.less'],
})
export class GeneralInfoComponent {

  @ViewChild('additionalBlock') additionalBlock: AdditionalInfoBlockComponent;
  @ViewChild('infoBlock') infoBlock: PurchaseInfoBlockComponent;
  @ViewChild('filesBlock') filesBlock: FilesInfoBlockComponent;
  constructor(
    private purchaseCreateService: PurchaseCreateService,
    private modalService: NzModalService,
    ) { }

  saveData() {
    const subj = this.purchaseCreateService.getSubject();
    subj.next();
  }

  cancel() {
    this.modalService.warning({
      nzTitle: 'Вы действительно хотите отменить все изменения?',
      nzOkText: 'Да',
      nzCancelText: 'Нет',
      nzOnOk: () => {
        this.additionalBlock.isEditMode = false;
        this.infoBlock.isEditMode = false;
        this.filesBlock.isEditMode = false;
      },
    });
  }
}
