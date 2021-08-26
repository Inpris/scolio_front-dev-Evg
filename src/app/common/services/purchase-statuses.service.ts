import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Status } from '@common/interfaces/Status';

@Injectable()
export class PurchaseStatusesService {
  colors = {
    Consideration: null,
    Posted: '#ffff00',
    WinButNotSign: '#ffa500',
    WinAndSign: null,
    ConcludedWithReestr: '#00fa9a',
    ConcludedWithoutReestr: '#7fff00',
    Excecuted: '#9400d3',
    PartExecuted: '#00ff00',
    Terminated: '#48d1cc',
    NotWin: '#a9a9a9',
    Imported: null,
  };

  constructor(private http: HttpClient) {
  }

  getList() {
    return this.http.get<Status[]>('/api/v1/dictionaries/purchase-statuses');
  }

  getColors() {
    return this.colors;
  }
}
