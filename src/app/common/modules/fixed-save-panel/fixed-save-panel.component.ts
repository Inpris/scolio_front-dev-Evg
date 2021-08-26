import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sl-fixed-save-panel',
  templateUrl: './fixed-save-panel.component.html',
  styleUrls: ['./fixed-save-panel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FixedSavePanelComponent {
  @Input() public disabled = true;
  @Input() public loading = false;
  @Output() public save = new EventEmitter();
  @Output() public reset = new EventEmitter();
}
