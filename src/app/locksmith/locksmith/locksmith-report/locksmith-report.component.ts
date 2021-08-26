import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NzModalRef } from 'ng-zorro-antd';
import { ToastsService } from '@common/services/toasts.service';
import { LocksmithService } from '@common/services/locksmith.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchesService } from '@common/services/dictionaries/branches.service';
import { FilesService } from '@common/services/file.service';
import { DateUtils } from '@common/utils/date';
import { FormUtils } from '@common/utils/form';
import { extract } from '@common/utils/object';
import { UsersService } from '@common/services/users';
import { ReportsService } from '@common/services/reports.service';

@Component({
  selector: 'sl-locksmith-report',
  templateUrl: './locksmith-report.component.html',
  styleUrls: ['./locksmith-report.component.less'],
  providers: [BranchesService, ReportsService],
})
export class LocksmithReportComponent implements OnInit {
  public isBusy = true;
  public form: FormGroup;
  public users;
  fromPaginationChunk = response => response.data;

  constructor(
    private modal: NzModalRef,
    private messageService: ToastsService,
    private lockSmithService: LocksmithService,
    public branchService: BranchesService,
    private filesService: FilesService,
    private fb: FormBuilder,
    private usersService: UsersService,
    private reportsService: ReportsService,
  ) {
    this.form = fb.group({
      range: [null, [Validators.required]],
      branch: [null],
      employeeFio: [null],
    });
  }

  ngOnInit() {
    this.usersService.getList({ pageSize: 1000 })
      .subscribe(({ data: users }) => {
        this.users = users.map(user => ({ id: user.id, name: user.abbreviatedName }));
        this.isBusy = false;
      });
    this.form.get('range')
        .patchValue([DateUtils.getCurrentMonthFirstDay(), DateUtils.getCurrentMonthLastDay()]);
  }
  public getReport() {
    FormUtils.markAsDirty(this.form);
    if (this.form.invalid) {
      return;
    }
    this.isBusy = true;
    const formData = this.form.value;
    const data = {
      startDate: DateUtils.toISODateString(formData.range[0]),
      endDate: DateUtils.toISODateString(formData.range[1]),
      employeeFio: extract(formData, 'employeeFio.name'),
      branchId: extract(formData, 'branch.id'),
    };
    this.reportsService.getLocksmithReport(data)
      .subscribe(
        (response) => {
          const name = `Отчет по слесарке ${
            data.startDate} - ${
            data.endDate}.xlsx`;
          this.filesService.saveFile(name, response, 'application/vnd.ms-excel');
        },
        error => this.onError(error),
        () => this.isBusy = false,
      );
  }

  private onError(response: HttpErrorResponse) {
    let message = 'Произошла ошибка';
    this.isBusy = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      message = errors[0];
    }
    this.messageService.error(message, { nzDuration: 3000 });
  }

  close() {
    this.modal.destroy();
  }
}
