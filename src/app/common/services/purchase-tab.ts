import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PurchaseTabService {
  setActiveTab = new Subject<number>();

  getSubject() {
    return this.setActiveTab;
  }
}
