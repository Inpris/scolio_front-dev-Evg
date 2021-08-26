import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Entity } from '@common/interfaces/Entity';

export const Genders: Entity[] = [{ id: '0', name: 'Мужской' }, { id: '1', name: 'Женский' }];

@Injectable()
export class GenderService {
  getList() {
    return Observable.of(Genders)
      .take(1);
  }
}
