import { Component } from '@angular/core';
import { SeriesVerticalComponent } from '@swimlane/ngx-charts';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[sl-robot-statistic-series-vertical]',
  templateUrl: './robot-statistic-series-vertical.component.html',
  styleUrls: ['./robot-statistic-series-vertical.component.less'],
  animations: [
    trigger('animationState', [
      transition(':leave', [
        style({
          opacity: 1,
        }),
        animate(500, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class RobotStatisticSeriesVerticalComponent extends SeriesVerticalComponent {

  constructor() {
    super();
  }

}
