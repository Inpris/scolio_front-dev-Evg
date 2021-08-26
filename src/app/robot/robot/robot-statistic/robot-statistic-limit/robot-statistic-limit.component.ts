import { Component, Input } from '@angular/core';
import { RobotStageLimits } from '@common/interfaces/Robot-stage';
import { NzModalRef } from 'ng-zorro-antd';
import { RobotService } from '@common/services/robot.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from '@common/services/toasts.service';

@Component({
  selector: 'sl-robot-statistic-limit',
  templateUrl: './robot-statistic-limit.component.html',
  styleUrls: ['./robot-statistic-limit.component.less'],
})
export class RobotStatisticLimitComponent {
  constructor(
    private modal: NzModalRef,
    private robotService: RobotService,
    private toastsService: ToastsService,
  ) {
  }

  @Input() limits: RobotStageLimits[];
  public pending = false;
  public maxPercent = 100;
  public maxOptimalCount = 999999;

  save() {
    this.robotService
      .updateSettings(this.limits)
      .subscribe(
        () => {
          this.modal.destroy(this.limits);
        },
        error => this.onError(error),
        () => this.pending = false,
      );
  }

  close() {
    this.modal.destroy();
  }

  private onError(response: HttpErrorResponse) {
    this.pending = false;
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.toastsService.error(errors[0], { nzDuration: 3000 });
    }
  }

  public maxSumOptimalCount = (value) => {
    const valueInput = this.noDots(value);
    if (parseFloat(valueInput) > this.maxOptimalCount) {
      return this.maxOptimalCount;
    }
    return this.noNan(valueInput);
  }

  public maxSumCriticalPercent = (value) => {
    const valueInput = this.noDots(value);
    if (parseFloat(valueInput) > this.maxPercent) {
      return this.maxPercent;
    }
    return this.noNan(valueInput);
  }

  private noDots(value) {
    return value.replace('.', '');
  }

  private noNan(value) {
    return isNaN(value) ? 0 : value;
  }
}
