import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LayoutScrollService {
  private LayoutScroll = new Subject<any>();

  getSubject() {
    return this.LayoutScroll;
  }
}
