import { OnInit, ViewChild } from '@angular/core';
import { PaginationParams } from '@common/services/paginable';
import { PageParams } from '@common/interfaces/Page-params';
import { InfinityScrollComponent } from '@common/modules/infinity-scroll/infinity-scroll/infinity-scroll.component';
import { LocalStorage } from '@common/services/storage';

export abstract class InfinityTable implements OnInit {
  @ViewChild('nzTable') nzTable;
  @ViewChild('infinityScroll') infinityScroll: InfinityScrollComponent;
  public scrollContainer;
  public filterData;
  public pending = true;
  public pagination: PageParams;
  public data: any[];
  public abstract tableDataService;
  public sortMap = { sortBy: null, sortType: null };
  abstract additionalFilterParams;

  abstract onError(error): void;

  protected constructor(
    public filterMap,
    public storageKey: string,
    public storageService: LocalStorage,
  ) {
    this.restoreSavedFilters();
    this.filterData = { ...this.filterMap, ...this.sortMap };
  }

  ngOnInit() {
    this.scrollContainer = document.querySelector('.sl-root-layout .sl-root-container');
  }

  private restoreSavedFilters() {
    const savedFilters = this.storageService.getTemplJsonItem(this.storageKey);
    if (savedFilters) {
      this.sortMap = savedFilters.sortMap;
      this.filterMap = savedFilters.filterMap;
    }
  }

  protected getData(more?) {
    if (this.pending && more) {
      return;
    }
    this.pending = !more;
    this
      .tableDataService
      .getList(
        { page: more ? this.pagination.page + 1 : 0, pageSize: 10 },
        { ...this.additionalFilterParams, ...this.filterData },
      )
      .subscribe(
        response => this.updatePaginationState(response),
        error => this.onError(error),
        () => this.pending = false,
      );
  }

  protected updatePaginationState({ data, page, pageSize, pageCount, totalCount }) {
    this.updateData(data, page);
    this.pagination = { page, pageCount, pageSize, totalCount };
    this.pending = false;
    setTimeout(() => {
      if (this.infinityScroll !== undefined) {
        this.infinityScroll.checkView();
      }
    });
  }

  protected updateData(data, page) {
    if (page === 1 || this.data === undefined) {
      this.data = data;
    } else {
      this.data.push(...data);
    }
  }

  public rewriteStoredFilterData() {
    this.storageService.setTempJsonItem(this.storageKey, {
      filterMap: this.filterMap,
      sortMap: this.sortMap,
    });
  }

  public clearFilters() {
    for (const filter in this.filterMap) {
      if (this.filterMap[filter]) {
        this.filterMap[filter] = null;
      }
    }
    this.sortMap = { sortBy: null, sortType: null };
    this.filterData = { ...this.sortMap, ...this.filterMap };
    this.storageService.removeTempItem(this.storageKey);
  }

  public clearPageParams() {
    if (!this.pagination) { return; }
    this.pagination.page = 1;
    this.pagination.pageSize = 10;
    this.pagination.pageCount = null;
    this.pagination.totalCount = null;
  }

  public sort(sortBy, sortType) {
    this.sortMap = { sortType, sortBy: sortType && sortBy };
    this.filterData = { ...this.filterData, ...this.sortMap };
    this.clearPageParams();
    this.getData();
    this.rewriteStoredFilterData();
  }

  public search(_) {
    this.filterData = { ...this.filterData, ...this.filterMap };
    this.clearPageParams();
    this.getData();
    this.rewriteStoredFilterData();
  }

  public expandChange(rowData, state) {
    this.nzTable.data.forEach(data => data.expand = state && rowData.id === data.id);
  }
}
