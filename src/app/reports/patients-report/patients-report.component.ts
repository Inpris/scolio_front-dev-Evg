import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { InfinityTable } from '@common/helpers/infinity-table';
import { LocalStorage } from '@common/services/storage';
import { ToastsService } from '@common/services/toasts.service';
import { hasScrollbar } from '@common/utils/ui';
import { PatientsReportHelper } from '../helpers/patients-report-helper';
import { ReportHelper } from '../helpers/report-helper';
import { ReportConstructorService } from '@common/services/report-constructor.service';
import { ReportType } from '@common/models/report-types';
import { Report } from '@common/models/report';
import { FormBuilder, FormControl } from "@angular/forms";
import { FilesService } from "@common/services/file.service";
import { NzModalService } from "ng-zorro-antd";
import { ReportConfigurationTableComponent } from "@modules/reports/patients-report/report-configuration-table/report-configuration-table.component";
import { takeUntil } from "rxjs/operators";
import { IReportColumn, IReportTemplate, ReportService } from "@common/services/report.service";
import { Subject } from "rxjs";
import * as moment from 'moment';

const STORAGE_KEY = 'PATIENTS_REPORT';

@Component({
  selector: 'sl-patients-report',
  templateUrl: './patients-report.component.html',
  styleUrls: ['./patients-report.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientsReportComponent extends InfinityTable implements OnInit, OnDestroy {
  public data: Report[];
  public reportTableSchema;
  public columns: {name: string, value: string}[];
  public templates: IReportTemplate[];
  public updatingList = true;
  public columnsControl = this._fb.control([]);

  get additionalFilterParams() {
    return ReportHelper.createFilterParams(this.filterMap);
  }

  public scrollContainer;
  public scrollBarPadding;
  public templateControl: FormControl = this._fb.control(null);

  private _destroyed$: Subject<void> = new Subject<void>();

  public get columnsValue(): string[] {
    return this.columnsControl.value;
  }

  constructor(
    public patientsReportHelper: PatientsReportHelper,
    public storageService: LocalStorage,
    public tableDataService: ReportConstructorService,
    public toastsService: ToastsService,
    private cdr: ChangeDetectorRef,
    private filesService: FilesService,
    private _fb: FormBuilder,
    private _cd: ChangeDetectorRef,
    private _modalService: NzModalService,
    private _reportService: ReportService,
  ) {
    super(
      {},
      STORAGE_KEY,
      storageService,
    );
    this.reportTableSchema = patientsReportHelper.getTableSchema();
    this.filterData = {};
    this.getData();
    this.scrollBarPadding = hasScrollbar();
  }

  public trackByRow = (index, item) => item.id;
  public trackByCell = index => index;

  public showColumn(name: string): boolean {
    return this.columnsValue.includes(name);
  }

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
        ReportType.PATIENT_REPORT,
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

  getExcel() {
    const date = moment(new Date).format('YYYY.MM.DD');
    this.updatingList = true;
    this._cd.detectChanges();

    this.tableDataService
      .getContactExcel(
        { page: 0, pageSize: 20 },
        { ...this.additionalFilterParams, ...this.filterData, columns: this.columnsValue },
      )
      .subscribe(
        (response) => {
          this.updatingList = false;
          this._cd.markForCheck();

          const name = `${date} Отчет по пациентам.xlsx`;
          this.filesService.saveFile(name, response, 'application/vnd.ms-excel');
        },
        error => {
          this.updatingList = false;
          this._cd.markForCheck();
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
      nzFooter: null,
      nzWidth: '1000px',
    });

    modal.afterClose
      .pipe(takeUntil(this._destroyed$))
      .subscribe((id?: number) => {
        this._getTemplates(id);
      });
  }

  public resetFilter() {
    this.clearPageParams();
    this.clearFilters();
    this.filterData = { ...this.filterData };
    this.getData();
  }

  private _getTemplates(id?: number): void {
    this._reportService.getTemplates()
      .subscribe((data: IReportTemplate[]) => {
        this.templates = data;

        if (!!id) {
          this.templateControl.patchValue(id);
        }

        this._cd.markForCheck();
      });
  }

  private _setDefaultColumns(): void {
    this.columns = this.reportTableSchema.headers.map(item => ({
      name: item.title,
      value: item.filterField,
    }));

    this.columnsControl.setValue(this.columns.map(c => c.value))
  }

  private _addTemplateListener(): void {
    this.templateControl.valueChanges
      .pipe(takeUntil(this._destroyed$))
      .subscribe((id: number) => {
        if (!id) {
          this.reportTableSchema = this.patientsReportHelper.getTableSchema();
          this._setDefaultColumns();
          this.getData();
          this.scrollBarPadding = hasScrollbar();
          return;
        }

        const template: IReportTemplate = this.templates
          .find((template: IReportTemplate) => template.id === id);
        const columns = template.columns.map((c: IReportColumn) => c.sysName);
        this.reportTableSchema = this.patientsReportHelper.getTableSchema(columns);
        this.getData();
        this.scrollBarPadding = hasScrollbar();

        this.columnsControl.patchValue(columns);
      });
  }
}
