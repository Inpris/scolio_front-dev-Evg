import { Component, Output, EventEmitter } from '@angular/core';

import { Purchase } from '@common/models/purchase';
import { PurchaseStore } from '@common/services/purchase.store';

@Component({
  selector: 'sl-files-info-block-viewer',
  templateUrl: './files-info-block-viewer.component.html',
  styleUrls: ['./files-info-block-viewer.component.less'],
})
export class FilesInfoBlockViewerComponent {

  purchaseData: Purchase;

  @Output() changeMode = new EventEmitter();

  constructor(
    private purchaseStore: PurchaseStore,
  ) {
    this.purchaseStore.getState().subscribe((purchaseData: Purchase) => {
      this.purchaseData = purchaseData;
    });
  }

  toEditMode() {
    this.changeMode.emit(true);
  }
}
