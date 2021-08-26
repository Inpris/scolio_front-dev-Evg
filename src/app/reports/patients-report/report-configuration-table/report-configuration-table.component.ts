import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IReportColumn, IReportTemplate, IReportTemplateTableRow, ReportService} from "@common/services/report.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NzModalRef, NzModalService} from "ng-zorro-antd";
import {ReportConfigurationComponent} from "@modules/reports/patients-report/report-configuration/report-configuration.component";
import {RolesUsers} from "@common/constants/roles-users.constant";
import {filter, finalize, takeUntil, tap} from "rxjs/operators";
import {Subject} from "rxjs";
import {User} from "@common/models/user";

@Component({
  selector: 'sl-report-configuration-table',
  templateUrl: './report-configuration-table.component.html',
  styleUrls: ['./report-configuration-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportConfigurationTableComponent implements OnInit, OnDestroy {
  @Input() public reportId: number = 1;

  public data: IReportTemplate[] = [];
  public loading: boolean = false;

  private _destroyed$: Subject<void> = new Subject<void>();

  readonly ROLES_USERS = RolesUsers;

  constructor(
    private _reportService: ReportService,
    private _cd: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _modal: NzModalRef,
    private _modalService: NzModalService,
  ) {}

  public ngOnInit() {
    this._getReports();
  }

  public ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  public getColumns(columns: IReportColumn[]): string {
    return columns.map((c: IReportColumn) => c.name).join(', ');
  }

  public select(id: number): void {
    this._modal.destroy(id);
  }

  public add(): void {
    this._openModal({
      reportId: this.reportId,
    });
  }

  public edit(item: IReportTemplateTableRow): void {
    this._openModal({
      reportId: this.reportId,
      item,
    });
  }

  public remove(item: IReportTemplateTableRow): void {
    this._reportService.removeReportConfiguration(item.id)
      .subscribe(() => this._getReports());
  }

  private _getReports(): void {
    this.loading = true;
    this._cd.markForCheck();

    this._reportService.getTemplates(this.reportId)
      .pipe(finalize(() => this.loading = false))
      .subscribe((data: IReportTemplate[]) => {
        this.data = data;

        this._cd.markForCheck();
      });
  }

  private _openModal(params: { reportId?: number; item?: IReportTemplateTableRow }): void {
    const modal = this._modalService.create({
      nzTitle: null,
      nzClosable: true,
      nzMaskClosable: false,
      nzContent: ReportConfigurationComponent,
      nzFooter: null,
      nzComponentParams: params,
      nzWidth: '1000px',
    });

    modal.afterClose
      .pipe(
        filter(Boolean),
        takeUntil(this._destroyed$)
      )
      .subscribe(() => {
        this._getReports();
      });
  }
}
