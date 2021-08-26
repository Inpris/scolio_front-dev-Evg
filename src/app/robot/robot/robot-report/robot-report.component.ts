import {Component, Input, OnInit} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NzModalRef } from 'ng-zorro-antd';
import { ToastsService } from '@common/services/toasts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilesService } from '@common/services/file.service';
import { DateUtils } from '@common/utils/date';
import { FormUtils } from '@common/utils/form';
import { RobotService } from '@common/services/robot.service';
import { ReportsService } from '@common/services/reports.service';
import * as moment from 'moment';
import { DOCTORS, TECHNICS, ALL } from "@modules/robot/robot/robot.component";

@Component({
  selector: 'sl-robot-report',
  templateUrl: './robot-report.component.html',
  styleUrls: ['./robot-report.component.less'],
  providers: [ReportsService],
})
export class RobotReportComponent implements OnInit {
  @Input() type: string;

  public isBusy = true;
  public form: FormGroup;
  public productTypes = [{ id: 'Corset', name: 'Корсет' }, { id: 'Swosh', name: 'СВОШ' }, { id: 'Apparatus', name: 'Аппарат' }, { id: 'Tutor', name: 'Тутор' }];
  fromPaginationChunk = response => response.data;

  constructor(
    private modal: NzModalRef,
    private messageService: ToastsService,
    private robotService: RobotService,
    private filesService: FilesService,
    private fb: FormBuilder,
    private reportsService: ReportsService,
  ) {
    this.form = fb.group({
      range: [null, [Validators.required]],
      productType: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.form.patchValue({ productType: this.productTypes[0],
      range: [DateUtils.getCurrentMonthFirstDay(), DateUtils.getCurrentMonthLastDay()] });
    this.isBusy = false;
  }
  public getReport() {
    FormUtils.markAsDirty(this.form);
    if (this.form.invalid) {
      return;
    }
    this.isBusy = true;
    const formData = this.form.value;

    const startDate = moment(formData.range[0]).format('YYYY-MM-DD');
    const endDate = moment(formData.range[1]).format('YYYY-MM-DD');

    const data = {
      startDate,
      endDate,
      // TODO: Использовать справочник когда будут все отчеты
      productTypeSysName: formData.productType.id,
    };

    let func;

    switch (this.type) {
      case DOCTORS:
        func = 'getDoctorsReport';
        break;
      case TECHNICS:
        func = 'getTechnicsReport';
        break;
      case ALL:
        func = 'getEmployeeReport';
        break;
      default:
        break;
    }

    this.reportsService[func](data)
      .subscribe(
        (response) => {
          const name = `Отчет по сотрудникам ${
            data.startDate} - ${
            data.endDate}.xlsx`;
          this.filesService.saveFile(name, response, 'application/vnd.ms-excel');
          this.close();
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
