import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sl-product-count-field',
  templateUrl: './product-count.component.html',
  styleUrls: ['./product-count.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCountComponent {
  @Input()
  countData = { done: 'выдано', inWorked: 'в работе', notDone: 'осталось', total: 'всего' };
}
