import { Injectable } from '@angular/core';

import { BehaviorSubject } from "rxjs";

@Injectable()
export class AccessesDataService {
  public isAccess = new BehaviorSubject(true);
  public addFormPatient = new BehaviorSubject(null);
}
