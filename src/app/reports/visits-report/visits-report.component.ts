import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { InfinityTable } from '@common/helpers/infinity-table';
import { hasScrollbar } from '@common/utils/ui';
import { LocalStorage } from '@common/services/storage';
import { ToastsService } from '@common/services/toasts.service';
import { VisitsReportHelper } from '@modules/reports/helpers/visits-report-helper';
import { ReportHelper } from '../helpers/report-helper';
import { ReportConstructorService } from '@common/services/report-constructor.service';
import { ReportType } from '@common/models/report-types';
import { Report } from '@common/models/report';
import * as moment from "moment";
import {FormBuilder, FormControl} from "@angular/forms";
import {FilesService} from "@common/services/file.service";
import {IReportColumn, IReportTemplate, ReportService} from "@common/services/report.service";
import {ReportConfigurationTableComponent} from "@modules/reports/patients-report/report-configuration-table/report-configuration-table.component";
import {finalize, takeUntil} from "rxjs/operators";
import {NzModalService} from "ng-zorro-antd";
import {Subject} from "rxjs";

const STORAGE_KEY = 'VISITS_REPORT';

@Component({
  selector: 'sl-visits-report',
  templateUrl: './visits-report.component.html',
  styleUrls: ['./visits-report.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitsReportComponent extends InfinityTable implements OnInit, OnDestroy {
  public data: Report[];
  public reportTableSchema;
  public updatingList = true;
  public columns: {name: string, value: string}[];
  public columnsControl = this._fb.control([]);
  public templateControl: FormControl = this._fb.control(null);
  public templates: IReportTemplate[];
  private _destroyed$: Subject<void> = new Subject<void>();

  get additionalFilterParams() {
    return ReportHelper.createFilterParams(this.filterMap);
  }

  public scrollBarPadding;

  public get columnsValue(): string[] {
    return this.columnsControl.value;
  }

  constructor(
    public visitsReportHelper: VisitsReportHelper,
    public storageService: LocalStorage,
    public tableDataService: ReportConstructorService,
    public toastsService: ToastsService,
    private cdr: ChangeDetectorRef,
    private _fb: FormBuilder,
    private filesService: FilesService,
    private _modalService: NzModalService,
    private _reportService: ReportService,
  ) {
    super(
      {},
      STORAGE_KEY,
      storageService,
    );
    this.reportTableSchema = visitsReportHelper.getTableSchema();
    this.filterData = {};
    this.getData();
    this.scrollBarPadding = hasScrollbar();
  }

  public trackByRow = (index, item) => item.id;
  public trackByCell = index => index;

  public ngOnInit() {
    super.ngOnInit();

    this.scrollContainer = document.querySelector('.sl-root-layout .sl-root-container');

    this._getTemplates();
    this._setDefaultColumns();
    this._addTemplateListener();
  }

  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  getData(more?) {
    if (this.pending && more) {
      return;
    }
    if (!more) { this.updatingList = true; }
    this.pending = true;
    this.cdr.markForCheck();
    this
      .tableDataService
      .getList(
        { page: more ? this.pagination.page + 1 : 0, pageSize: 20 },
        { ...this.additionalFilterParams, ...this.filterData },
        ReportType.VISIT_REPORT,
      )
      .subscribe(
        (response) => {
          this.updatingList = false;
          this.updatePaginationState(response);
        },
        error => this.onError(error),
        () => {
          this.updatingList = false;
          this.pending = false;
          this.cdr.markForCheck();
        },
      );
  }

  getExcel() {
    if (this.pagination && this.pagination.totalCount > 10000) {
      this._modalService.warning({
        nzTitle: 'Слишком много записей для выгрузки.',
        nzOkText: 'Выставить фильтры',
        nzZIndex: 1200,
      });

      return;
    }

    const date = moment(new Date).format('YYYY.MM.DD');
    this.updatingList = true;
    this.cdr.detectChanges();

    this.tableDataService
      .getVisitExcel(
        { page: 0, pageSize: 20 },
        { ...this.additionalFilterParams, ...this.filterData, columns: this.columnsValue },
      )
      .pipe(
        finalize(() => {
          this.updatingList = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe(
        (response) => {
          const name = `${date} Отчет по визитам.xlsx`;
          this.filesService.saveFile(name, response, 'application/vnd.ms-excel');
        },
        error => {
          this.onError(error)
        },
      );
  }

  public openConfiguration(): void {
    const modal = this._modalService.create({
      nzTitle: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzContent: ReportConfigurationTableComponent,
      nzComponentParams: {
        reportId: 2,
      },
      nzFooter: null,
      nzWidth: '1000px',
    });

    modal.afterClose
      .pipe(takeUntil(this._destroyed$))
      .subscribe((id?: number) => {
        this._getTemplates(id);
      });
  }

  onError(error) {
    this.updatingList = true;
    this.pending = false;
    this.cdr.markForCheck();
    this.toastsService.onError(error);
  }

  updateData(data, page) {
    if (page === 1 || this.reportTableSchema.rows === undefined) {
      this.reportTableSchema.rows = this.reportTableSchema.buildRows(data);
    } else {
      this.reportTableSchema.rows.push(...this.reportTableSchema.buildRows(data));
    }
  }

  search(_) {
    this.clearPageParams();
    this.getData();
    this.rewriteStoredFilterData();
    this.filterData = { ...this.filterData };
  }

  resetFilter() {
    this.clearPageParams();
    this.clearFilters();
    this.filterData = { ...this.filterData };
    this.getData();
  }

  private _getTemplates(id?: number): void {
    this._reportService.getTemplates(2)
      .subscribe((data: IReportTemplate[]) => {
        this.templates = data;

        if (!!id) {
          this.templateControl.patchValue(id);
        }

        this.cdr.markForCheck();
      });
  }

  private _setDefaultColumns(): void {
    this.columns = this.reportTableSchema.schema.map(item => ({
      name: item.title,
      value: item.path || item.filterField,
    }));

    this.columnsControl.setValue(this.columns.map(c => c.value));
  }

  private _addTemplateListener(): void {
    this.templateControl.valueChanges
      .pipe(takeUntil(this._destroyed$))
      .subscribe((id: number) => {
        if (!id) {
          this.reportTableSchema = this.visitsReportHelper.getTableSchema();
          this._setDefaultColumns();
          this.getData();
          this.scrollBarPadding = hasScrollbar();
          return;
        }

        const template: IReportTemplate = this.templates
          .find((template: IReportTemplate) => template.id === id);
        const columns = template.columns.map((c: IReportColumn) => c.sysName);
        this.reportTableSchema = this.visitsReportHelper.getTableSchema(columns);
        this.getData();
        this.scrollBarPadding = hasScrollbar();

        this.columnsControl.patchValue(columns);
      });
  }
}
