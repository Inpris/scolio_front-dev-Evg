import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';

import { Purchase } from '@common/models/purchase';

@Injectable()
export class PurchaseStore {

  private initialState = new Purchase();
  private state = new ReplaySubject<Purchase>(1);
  private update = new Subject<any>();

  constructor() {
    this.update.scan(
      (state: Purchase, action: Function) => action(state),
      this.initialState,
    )
    .subscribe(this.state);
  }

  setState(newState: Purchase) {
    this.update.next((state: Purchase) => newState);
  }

  updateState(updatedState: Purchase) {
    this.update.next((state: Purchase) => Object.assign(
      state,
      updatedState,
    ));
  }

  getState(): Observable<Purchase> {
    return this.state.asObservable();
  }
}
