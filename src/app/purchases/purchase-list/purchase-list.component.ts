import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PurchaseService } from '@common/services/purchase.service';
import { Purchase } from '@common/models/purchase';
import { DateUtils } from '@common/utils/date';
import { PurchaseStatusesService } from '@common/services/purchase-statuses.service';
import { Region } from '@common/models/region';
import { RegionService } from '@common/services/region.service';
import { PurchaseTenderPlatform } from '@common/models/purchase-tender-platform';
import { PurchaseTenderPlatformsService } from '@common/services/purchase-tender-platforms.service';
import { Status } from '@common/interfaces/Status';
import { InfinityScrollComponent } from '@common/modules/infinity-scroll/infinity-scroll/infinity-scroll.component';
import { PurchaseType } from '@common/models/purchase-type';
import { PurchaseTypesService } from '@common/services/purchase-types.service';
import { PurchaseChaptersService } from '@common/services/purchase-chapters.service';
import { PurchaseChapter } from '@common/models/purchase-chapter';
import { LocalStorage } from '@common/services/storage';
import { City } from '@common/models/city';
import { CityService } from '@common/services/city.service';
import { CandyDate } from '@common/modules/date-picker/lib/candy-date';
import { Subject } from 'rxjs/Subject';
import {ReportsService} from "@common/services/reports.service";
import {FilesService} from "@common/services/file.service";
import {IProductKind} from "@modules/deals/create-contract/create-contract.component";
import {ContractsService} from "@common/services/contracts.service";
import {FormBuilder} from "@angular/forms";
import {takeUntil} from "rxjs/operators";

const STORAGE_KEY = 'PURCHASES_FILTER_DATA';

@Component({
  selector: 'sl-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.less'],
  providers: [
    ReportsService,
    FilesService,
  ]
})
export class PurchaseListComponent implements OnInit, OnDestroy {

  @ViewChild('nzTable')
  nzTable;

  @ViewChild('infinityScroll') infinityScroll: InfinityScrollComponent;

  pageParams = {
    totalCount: null,
    page: 1,
    pageSize: 10,
    pageCount: null,
  };
  loading: boolean = true;
  public scrollContainer;

  sortMap = {
    sortBy: null,
    sortType: null,
  };

  filterMap = {
    noticeNumber: null,
    contractNumber: null,
    contractDate: null,
    purchaseStatusIds: null,
    purchaseChapterIds: null,
    region: null,
    city: null,
    section: null,
    finalContractPrice: null,
    tenderPlatform: null,
    purchaseTypeId: null,
    customer: null,
    patientFio: null,
    year: null,
  };


  filterData = {
    ...this.sortMap,
    ...this.filterMap,
  };

  public searchInteractive$ = new Subject();
  private unsubscriber$ = new Subject();
  private latestFilterTimestamp: number;
  sortName = null;
  sortValue = null;
  data: Purchase[] = [];
  purchaseStatuses: Status[] = [];
  regions: Region[] = [];
  cities: City[] = [];
  purchaseChapters: PurchaseChapter[] = [];
  tenders: PurchaseTenderPlatform[] = [];
  purchaseTypes: PurchaseType[] = [];
  yearModel: string;
  patientModel: string;
  statusColors;
  public productKinds: IProductKind[];
  public selectedProduct = this._fb.control(null);

  constructor(
    private purchaseService: PurchaseService,
    private purchaseStatusesService: PurchaseStatusesService,
    private purchaseTypesService: PurchaseTypesService,
    private purchaseTenderPlatformsService: PurchaseTenderPlatformsService,
    private regionService: RegionService,
    private cityService: CityService,
    private purchaseChaptersService: PurchaseChaptersService,
    private storageService: LocalStorage,
    private _reportsService: ReportsService,
    private _filesService: FilesService,
    private _contractsService: ContractsService,
    private _fb: FormBuilder,
  ) {
    const savedFilters = this.storageService.getTemplJsonItem(STORAGE_KEY);
    if (savedFilters) {
      this.sortMap = savedFilters.sortMap;
      this.filterMap = {
        ...savedFilters.filterMap,
        contractDate: savedFilters.filterMap.contractDate && [
          new CandyDate(savedFilters.filterMap.contractDate[0]),
          new CandyDate(savedFilters.filterMap.contractDate[1]),
        ],
      };
      this.filterData = { ...this.filterMap, ...this.sortMap };
    }
    this.searchInteractive$
      .takeUntil(this.unsubscriber$)
      .debounceTime(500)
      .subscribe(value => this.search(value));
  }

  ngOnInit() {
    this.scrollContainer = document.querySelector('.sl-root-layout .sl-root-container');
    this.getPurchases();
    this.loadDictionariesData();
    this.statusColors = this.purchaseStatusesService.getColors();

    this._contractsService.getProducts()
      .subscribe((products: IProductKind[]) => {
        this.productKinds = products;
      });

    this.selectedProduct.valueChanges
      .pipe(takeUntil(this.unsubscriber$))
      .subscribe(() => this.getPurchases());
  }

  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  private getPurchases(more?) {
    if (
      (this.loading && more) ||
      this.pageParams.page === this.pageParams.pageCount
    ) {
      return;
    }
    if (more) {
      this.pageParams.page += 1;
    }
    const requestTimeStamp = Date.now();
    this.loading = !more;
    this.latestFilterTimestamp = requestTimeStamp;
    this.purchaseService.getList({
      ...this.filterData,
      productName: this.selectedProduct.value,
    }, this.pageParams)
      .filter(() => more || this.latestFilterTimestamp === requestTimeStamp)
      .subscribe((response) => {
        const { page, pageSize, pageCount, totalCount, data } = response;
        this.pageParams.page = page;
        this.pageParams.pageSize = pageSize;
        this.pageParams.pageCount = pageCount;
        this.pageParams.totalCount = totalCount;

        if (!more) {
          this.data = [];
        }
        this.data = [...this.data, ...data];
        this.loading = false;
        setTimeout(() => {
          if (this.infinityScroll !== undefined) {
            this.infinityScroll.checkView();
          }
        });
      }, (err) => {
        console.dir(err);
        this.loading = false;
      });
  }

  loadDictionariesData() {
    this.purchaseStatusesService.getList().subscribe((data) => {
      this.purchaseStatuses = data;
    });

    this.purchaseTenderPlatformsService.getList().subscribe((data) => {
      this.tenders = data;
    });

    this.purchaseTypesService.getList().subscribe((data) => {
      this.purchaseTypes = data;
    });

    this.purchaseChaptersService.getList().subscribe((data) => {
      this.purchaseChapters = data;
    });
  }

  expandChange(rowData, state) {
    this.nzTable.data.forEach(data => data.expand = state && rowData.id === data.id);
  }

  sort(sortBy, sortType) {
    this.sortMap = { sortBy, sortType };
    this.filterData = { ...this.filterData, ...this.sortMap };
    this.clearPageParams();
    this.getPurchases();
    this.rewriteStoredFilterData();
  }


  search(value) {
    this.filterData = Object.assign(this.filterData, this.filterMap);

    if (this.filterMap.contractDate) {
      const start = (this.filterMap.contractDate[0]) ?
        this.dataToIso(this.filterMap.contractDate[0].nativeDate) : null;
      const end = (this.filterMap.contractDate[1]) ?
        this.dataToIso(this.filterMap.contractDate[1].nativeDate) : null;
      this.filterData['contractDate'] = { start, end };
    }
    this.clearPageParams();
    this.getPurchases();
    this.rewriteStoredFilterData();
  }

  private clearPageParams() {
    this.pageParams.page = 1;
    this.pageParams.pageSize = 10;
    this.pageParams.pageCount = null;
    this.pageParams.totalCount = null;
  }

  private dataToIso(data) {
    return DateUtils.toISODateTimeString(data);
  }

  onRegionSearch(value: string): void {
    if (!value || value && value.length < 3) {
      this.regions = null;
      return;
    }
    this.getRegionList(value);
  }

  private getRegionList(value: string) {
    const params = { filter: value };
    this.regionService.getList(params)
      .subscribe((data) => {
        this.regions = data.data;
      });
  }

  onCitySearch(value: string): void {
    if (!value || value && value.length < 3) {
      this.cities = null;
      return;
    }
    this.getCitiesList(value);
  }

  private getCitiesList(value: string) {
    const params = { filter: value };
    this.cityService.getList(params)
      .subscribe(({ data }) => this.cities = data);
  }

  searchInteractive(value) {
    if (value.length > 0 && value.length < 4) {
      return;
    }
    this.searchInteractive$.next(value);
  }

  resetFilter() {
    Object.keys(this.filterData).forEach((key) => {
      this.filterData[key] = null;
    });

    Object.keys(this.filterMap).forEach((key) => {
      this.filterMap[key] = null;
    });

    this.selectedProduct.patchValue(null);

    this.clearPageParams();
    this.getPurchases();
    this.storageService.removeTempItem(STORAGE_KEY);
  }

  public export(): void {
    this._reportsService.getPurchasesTable(this.filterData)
      .subscribe((response) => {
        const name = `Таблица закупок.xlsx`;
        this._filesService.saveFile(name, response, 'application/vnd.ms-excel');
      });
  }

  private rewriteStoredFilterData() {
    this.storageService.setTempJsonItem(STORAGE_KEY, {
      filterMap: this.filterMap,
      sortMap: this.sortMap,
    });
  }
}
