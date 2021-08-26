import { Component, ElementRef } from '@angular/core';
import { BarComponent } from '@swimlane/ngx-charts';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[sl-robot-statistic-charts-bar]',
  templateUrl: './robot-statistic-charts-bar.component.html',
  styleUrls: ['./robot-statistic-charts-bar.component.less'],
})
export class RobotStatisticChartsBarComponent extends BarComponent {

  constructor(element: ElementRef) {
    super(element);
  }

}
