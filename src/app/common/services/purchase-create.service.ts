import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PurchaseCreateService {
  clickBtnCreatePurchase = new Subject<any>();

  getSubject() {
    return this.clickBtnCreatePurchase;
  }
}
