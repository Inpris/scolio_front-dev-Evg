import { Component, EventEmitter, Input, Output } from '@angular/core';
import { XAxisComponent } from '@swimlane/ngx-charts/release/common/axes/x-axis.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[sl-robot-x-axis]',
  templateUrl: './robot-x-axis.component.html',
})
export class RobotXAxisComponent extends XAxisComponent {
  @Output() clicked = new EventEmitter();

  constructor() {
    super();
  }
}
