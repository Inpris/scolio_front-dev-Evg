import { Component, EventEmitter, Output } from '@angular/core';
import { XAxisTicksComponent } from '@swimlane/ngx-charts/release/common/axes/x-axis-ticks.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[sl-robot-x-axis-ticks]',
  templateUrl: './robot-x-axis-ticks.component.html',
  styleUrls: ['./robot-x-axis-ticks.component.less'],
})
export class RobotXAxisTicksComponent extends XAxisTicksComponent {
  @Output() clicked = new EventEmitter();

  constructor() {
    super();
  }
}
