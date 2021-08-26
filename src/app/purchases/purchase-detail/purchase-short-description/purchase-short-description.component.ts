import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Purchase } from '@common/models/purchase';
import { PurchaseTabService } from '@common/services/purchase-tab';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'sl-purchase-short-description',
  templateUrl: './purchase-short-description.component.html',
  styleUrls: ['./purchase-short-description.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseShortDescriptionComponent {
  subject: Subject<number>;

  @Input()
  purchase: Purchase;

  @Input()
  actionButtonText: string;

  @Output()
  action = new EventEmitter<Event>();

  @Input()
  resetButtonText: string;

  @Output()
  reset = new EventEmitter<Event>();

  constructor(private purchaseTabService: PurchaseTabService) {
    this.subject = this.purchaseTabService.getSubject();
  }

  setActiveTab(index: number) {
    this.subject.next(index);
  }

  resetFilters() {
    this.reset.emit();
  }
}
