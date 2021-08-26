import { Component, ElementRef } from '@angular/core';
import { AxisLabelComponent } from '@swimlane/ngx-charts/release/common/axes/axis-label.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[sl-robot-x-axis-label]',
  templateUrl: './robot-x-axis-label.component.html',
  styleUrls: ['./robot-x-axis-label.component.less'],
})
export class RobotXAxisLabelComponent extends AxisLabelComponent {
  constructor(element: ElementRef) {
    super(element);
  }
}
