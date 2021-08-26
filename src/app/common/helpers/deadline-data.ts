import { Injectable } from '@angular/core';
import { DeadlineData } from '@common/interfaces/Deadline-data';
import { PurchaseService } from '@common/services/purchase.service';
import { DateUtils } from '@common/utils/date';
import { PurchaseStatusesService } from '@common/services/purchase-statuses.service';


@Injectable()
export class DeadlineDataService {
  public data: DeadlineData = {
    items: [],
    pageParams: {
      page: 1,
      pageSize: 6,
      pageCount: null,
      totalCount: null,
    },
    deadlineDays: 30,
    isLoading: true,
  };

  filterParams = {
    startDay: null,
    endDay: null,
    purchaseStatusIds: [],
  };

  constructor(
    private purchaseService: PurchaseService,
    private purchaseStatusesService: PurchaseStatusesService,
  ) {
  }

  getDataByStatuses() {
    this.purchaseStatusesService.getList().subscribe((statuses) => {
      statuses.map((item) => {
        if (
          item.sysName === 'WinAndSign' ||
          item.sysName === 'ConcludedWithReestr'
        ) {
          this.filterParams.purchaseStatusIds.push(item.id);
        }
      });
      this.getData();
    });
  }

  public getData() {
    const paginationParams = this.data.pageParams;

    const nowDate = DateUtils.nowDate();
    const end = DateUtils.addDays(nowDate, this.data.deadlineDays);
    this.filterParams.endDay = DateUtils.toISODateTimeString(end);
    this.data.isLoading = true;
    return this.purchaseService.getList(this.filterParams, paginationParams)
      .subscribe((response) => {
        this.addedItemsInArr(response);
      }, (err) => {
        console.log(err);
        this.data.isLoading = false;
      });
  }

  public addedItemsInArr(response) {
    const data = response.data;
    this.data.isLoading = false;
    if (!data.length) { return; }
    this.data.pageParams.page = response.page;
    this.data.pageParams.pageSize = response.pageSize;
    this.data.pageParams.pageCount = response.pageCount;
    this.data.pageParams.totalCount = response.totalCount;
    this.data.items.length = 0;
    data.forEach((item) => {
      this.data.items.push(item);
    });
  }
}
