import { Component, OnInit } from '@angular/core';
import { PageParams } from '@common/interfaces/Page-params';
import { DeadlineDataService } from '@common/helpers/deadline-data';
import { Purchase } from '@common/models/purchase';
import { ProductCount } from '@common/interfaces/Product-count';
import { DeadlineData } from '@common/interfaces/Deadline-data';
@Component({
  selector: 'sl-deadline',
  templateUrl: './deadline.component.html',
  styleUrls: ['./deadline.component.less'],
})
export class DeadlineComponent implements OnInit {
  data: Purchase[];
  pageParams: PageParams;
  public dealLineData: DeadlineData;

  constructor(
    private deadlineDataService: DeadlineDataService,
  ) { }

  ngOnInit() {
    this.pageParams = this.deadlineDataService.data.pageParams;
    this.deadlineDataService.getDataByStatuses();
    this.data = this.deadlineDataService.data.items;
    this.dealLineData = this.deadlineDataService.data;
  }

  indexChange() {
    this.deadlineDataService.getData();
  }

  pageIndexChangeClick() {
  }

  createProductCountData(data) {
    const countProducts: ProductCount = {
      total: data.allDevicesCount,
      inWorked: data.allDevicesInWork,
      done: data.allDevicesGiven,
      notDone: data.allDevicesCount - data.allDevicesInWork - data.allDevicesGiven,
    };
    return countProducts;
  }
}
