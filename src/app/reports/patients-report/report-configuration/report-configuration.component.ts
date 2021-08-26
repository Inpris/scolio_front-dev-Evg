import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {IReportColumn, IReportTemplate, ReportService} from "@common/services/report.service";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd";
import {finalize} from "rxjs/operators";

export const minLengthArray = (min: number) => {
  return (c: AbstractControl): {[key: string]: any} => {
    if (c.value.length >= min)
      return null;

    return { MinLengthArray: true};
  }
};

@Component({
  selector: 'sl-report-configuration',
  templateUrl: './report-configuration.component.html',
  styleUrls: ['./report-configuration.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportConfigurationComponent implements OnInit {
  @Input() public reportId: 1 | 2;
  @Input() public set item(data: IReportTemplate) {
    this.form.patchValue({
      ...data,
      columns: data.columns.map((c: IReportColumn) => c.sysName),
    });

    this.id = data.id;
  }

  public loading: boolean = false;
  public id: number;
  public columns: IReportColumn[] = [];
  public form: FormGroup = this._fb.group({
    columns: [[], minLengthArray(1)],
    templateName: ['', Validators.required],
  });

  constructor(
    private _reportService: ReportService,
    private _cd: ChangeDetectorRef,
    private _fb: FormBuilder,
    private _modal: NzModalRef,
  ) {}

  public ngOnInit() {
    this._reportService.getColumnsByReport(this.reportId)
      .subscribe((data: IReportColumn[]) => {
        this.columns = data;

        this._cd.markForCheck();
      });
  }

  public save(): void {
    if (this.form.invalid || !this.reportId) {
      return;
    }

    this.loading = true;

    const requestName = this.id ? 'updateReportConfiguration' : 'addReportConfiguration';
    const data = {
      ...this.form.value,
      reportId: this.reportId,
    };

    if (this.id) {
      data.id = this.id;
    }

    this._reportService[requestName](data)
      .pipe(finalize(() => {
        this.loading = false;
        this._cd.markForCheck();
      }))
      .subscribe((templateId: number) => {
      this._modal.destroy(templateId);
    });
  }
}
