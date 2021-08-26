import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NzCalendarComponent } from 'ng-zorro-antd';
import { PurchaseService } from '@common/services/purchase.service';
import { Purchase } from '@common/models/purchase';
import { DateUtils } from '@common/utils/date';
import * as moment from 'moment';

@Component({
  selector: 'sl-purchase-calendar',
  templateUrl: './purchase-calendar.component.html',
  styleUrls: ['./purchase-calendar.component.less'],
})
export class PurchaseCalendarComponent implements OnInit, AfterViewInit {

  @ViewChild('slCalendar') slCalendar: NzCalendarComponent;

  purchase: Purchase[];
  sortedItemsByDate = {};

  private pageParams = { pageSize: 500 };

  auctionParams: {
    'auctionDateFilter.startDay': string;
    'auctionDateFilter.endDay': string;
  } = {
    'auctionDateFilter.startDay': null,
    'auctionDateFilter.endDay': null,
  };

  selectedModel;
  selectedValue = new Date();
  showCalendar = true;
  purchaseDataLoaded = false;

  visible: boolean;
  count: number;

  constructor(private purchaseService: PurchaseService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.auctionDateParams();

    const onMonthSelectOrig = this.slCalendar.onMonthSelect.bind(this.slCalendar);
    const onYearSelectOrig = this.slCalendar.onYearSelect.bind(this.slCalendar);

    this.slCalendar.onMonthSelect = (...args) => {
      onMonthSelectOrig(...args);
      this.auctionDateParams();
      this.getPurchases();
    };
    this.slCalendar.onYearSelect = (...args) => {
      onYearSelectOrig(...args);
      this.auctionDateParams();
      this.getPurchases();
    };
    this.getPurchases();
  }

  getPurchases() {
    this.purchaseDataLoaded = false;
    this.purchaseService.getList(this.auctionParams, this.pageParams).subscribe((data) => {
      this.purchase = data.data;
      this.createAuctionData();
      this.purchaseDataLoaded = true;
      this.reRenderCalendar();
    });
  }

  reRenderCalendar() {
    this.showCalendar = false;
    this.showCalendar = true;
  }

  auctionDateParams() {
    const weeks = this.slCalendar['dateMatrix'];
    this.auctionParams = {
      'auctionDateFilter.startDay': DateUtils.toISODateTimeString(weeks[0][0].value),
      'auctionDateFilter.endDay': DateUtils.toISODateTimeString(weeks[weeks.length - 1][weeks[weeks.length - 1].length - 1].value),
    };
  }

  createAuctionData() {
    const start = this.auctionParams['auctionDateFilter.startDay'];
    const end = this.auctionParams['auctionDateFilter.endDay'];
    let dayDate = new Date(moment(start).format());
    const endDate = new Date(moment(end).format());
    while (+dayDate < +endDate) {
      this.addStyleAuctionDays(dayDate);
      dayDate = DateUtils.addDays(dayDate, 1);
    }
  }

  addStyleAuctionDays(day) {
    const calendarDayResult = +day;
    this.purchase.forEach((item) => {
      const auctionDay = new Date(moment(item.auctionDate).format());
      const auctionDayResult = auctionDay.setHours(0, 0, 0, 0);
      if (calendarDayResult === auctionDayResult) {
        this.saveDate(calendarDayResult, item);
      }
    });
  }

  private saveDate(calendarDayResult, item) {
    if (!this.sortedItemsByDate[calendarDayResult.toString()]) {
      this.sortedItemsByDate[calendarDayResult.toString()] = {};
      this.sortedItemsByDate[calendarDayResult.toString()]['items'] = [];
    }
    this.sortedItemsByDate[calendarDayResult.toString()]['items'].push(item);
  }

  closeModal(date) {
    this.sortedItemsByDate[+date].visible = false;
  }

}
