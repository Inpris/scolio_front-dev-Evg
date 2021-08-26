import { Component, Output, EventEmitter } from '@angular/core';

import { Purchase } from '@common/models/purchase';
import { PurchaseStore } from '@common/services/purchase.store';
import * as moment from 'moment';
import { DateUtils } from '@common/utils/date';

@Component({
  selector: 'sl-purchase-info-block-viewer',
  templateUrl: './purchase-info-block-viewer.component.html',
  styleUrls: ['./purchase-info-block-viewer.component.less'],
})
export class PurchaseInfoBlockViewerComponent {

  purchaseData: Purchase;
  @Output() changeMode = new EventEmitter();
  public moscowDateTime;

  constructor(
    private purchaseStore: PurchaseStore,
  ) {
    this.purchaseStore.getState().subscribe((purchaseData: Purchase) => {
      this.purchaseData = purchaseData;
      if (purchaseData.auctionDateLocal && purchaseData.customer) {
        this.moscowDateTime = DateUtils.toMoscowDateTime(purchaseData.auctionDateLocal, purchaseData.customer.diffHours);
      }
    });
  }

  toEditMode() {
    this.changeMode.emit(true);
  }

}
