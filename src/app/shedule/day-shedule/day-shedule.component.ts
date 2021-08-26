import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Appointment } from '@common/models/appointment';
import { DateUtils } from '@common/utils/date';
import { Shedule } from '@common/models/shedule';

@Component({
  selector: 'sl-day-shedule',
  templateUrl: './day-shedule.component.html',
  styleUrls: ['./day-shedule.component.less'],
})
export class DaySheduleComponent implements OnInit {
  @ViewChild('iframeprint') public iframeprint;
  @ViewChild('tablePrint') public tablePrint;

  @Input() date: Date;
  @Input() mondayDate: Date;
  @Input() shedule: Shedule;

  dayShedule: Appointment[];
  week: Date[];

  constructor(private _el: ElementRef) {}

  ngOnInit() {
    this.week = [];
    for (let i = 0; i < 6; i = i + 1) {
      this.week.push(DateUtils.addDays(this.mondayDate, i));
    }
    this.setDayShedule();
  }

  isSelectedDate(date: Date) {
    return DateUtils.equals(date, this.date);
  }

  onShowDayShedule(date: Date) {
    this.date = date;
    this.setDayShedule();
  }

  public onFrameLoad(): void {
    const cssLink = document.createElement('link');
    const frame: any = this.iframeprint.nativeElement.contentWindow;
    cssLink.href = 'assets/print-schedule.css';
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';

    frame.document.head.appendChild(cssLink);
  }

  public print(): void {
    const frame: any = this.iframeprint.nativeElement.contentWindow;
    frame.document.body.innerHTML = this.tablePrint.nativeElement.innerHTML;
    frame.print();
  }

  private setDayShedule() {
    const tomorrowDate = DateUtils.addDays(this.date, 1);
    this.dayShedule = this.shedule.appointments.filter((appointment) => {
      return appointment.dateTimeStart >= this.date && appointment.dateTimeEnd < tomorrowDate;
    });
  }
}
