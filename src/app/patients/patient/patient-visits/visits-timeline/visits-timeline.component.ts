import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DateUtils } from '@common/utils/date';
import { Visit } from '@common/models/visit';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { Subject } from 'rxjs/Subject';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'sl-visits-timeline',
  templateUrl: './visits-timeline.component.html',
  styleUrls: ['./visits-timeline.component.less'],
})
export class VisitsTimelineComponent implements OnInit, OnDestroy {

  public visits: { date: string; visits: Visit[]; selected?; opened?; }[];
  private selectedVisitId: string;
  private unsubscribe$ = new Subject();

  @Input()
  public visitId: string;
  @Input()
  visitsManager: VisitsManager;
  @Output()
  visitDelete = new EventEmitter<Visit>();
  @Output()
  visitSelect = new EventEmitter<Visit>();

  constructor(private message: NzMessageService) {}

  ngOnInit() {
    if (this.visitsManager) {
      this.visitsManager.visitsUpdated
        .takeUntil(this.unsubscribe$)
        .subscribe(visits => this.setVisits(visits));
      this.visitsManager.selectionChanges
        .takeUntil(this.unsubscribe$)
        .subscribe(visit => this.markSelected(visit));
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  setVisits(visits: Visit[]) {
    if (Array.isArray(visits)) {
      const visitMap = visits.reduce((map, visit) => {
        const date = DateUtils.toISODateString(visit.dateTime);
        if (map[date]) {
          map[date].push(visit);
        } else {
          map[date] = [visit];
        }
        return map;
      }, {});
      this.visits = Object.keys(visitMap)
        .map(date => ({
          date,
          visits: visitMap[date],
        }));
      if (!this.visitsManager.selected && this.visits && this.visits.length > 0) {
        // visitId - идентификатор выбранного Посещения при переходе со страницы Запись на прием
        let selectedVisit;
        if (this.visitId) {
          const foundVisit = visits.find(item => item.id === this.visitId);
          if (foundVisit) {
            selectedVisit = foundVisit;
          } else {
            selectedVisit = this.visits[0].visits[0];
            this.message.error('Выбранное посещение не найдено!', { nzDuration: 3000 });
          }
        } else {
          selectedVisit = this.visits[0].visits[0];
        }
        this.visitsManager.select(selectedVisit);
      } else if (this.visitsManager.selected) {
        this.markSelected(this.visitsManager.selected);
      }
    } else {
      this.visits = [];
    }
  }

  private markSelected(visit) {
    const id = visit.id;
    this.selectedVisitId = id;
    this.visits.forEach((date) => {
      const selected = date.visits.some(
        _visit =>
          _visit.id === id,
      );
      date.selected = selected;
      date.opened = date.opened || selected;
    });
  }

  public deleteVisit(event, visit: Visit) {
    event.stopPropagation();
    this.visitDelete.next(visit);
  }

  public selectVisit(visit: Visit) {
    this.visitSelect.next(visit);
  }
}
