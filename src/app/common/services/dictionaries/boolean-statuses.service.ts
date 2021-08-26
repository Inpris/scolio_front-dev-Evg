import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

const Statuses = [{ id: true, name: 'Да' }, { id: false, name: 'Нет' }];

@Injectable()
export class BooleanStatusesService {
  getList() {
    return Observable.of(Statuses)
      .take(1);
  }
}
