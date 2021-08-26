import { Injectable } from '@angular/core';
import { VertebraType } from '@common/interfaces/Measurement';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VertebraTypesService {
  getList() {
    return Observable.of(
      Object.keys(VertebraType)
        .map((key, index) => ({
          id: index + 1,
          name: key,
        })),
    )
      .take(1);
  }
}
