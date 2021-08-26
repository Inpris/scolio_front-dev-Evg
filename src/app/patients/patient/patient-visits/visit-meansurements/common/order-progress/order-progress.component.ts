import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sl-order-progress',
  templateUrl: './order-progress.component.html',
  styleUrls: ['./order-progress.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderProgressComponent implements OnInit {
  @Input()
  currentStep;
  @Input()
  schema: { name: string, field: string }[] = [];
  @Input()
  is3DModel = true;
  @Input()
  set manufacturing(manufacturing) {
    if (!manufacturing) { return; }
    this.manufacturingProgress = manufacturing;
    this.percentageProgress =
      Math.ceil(
        this.schema
          .reduce((percentage, state) => percentage + Number(manufacturing[state.field]), 0)
        / this.schema.length
        * 100,
      );
  }
  public manufacturingProgress = {};
  public percentageProgress = 0;
  constructor(
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.cdr.markForCheck();
    });
  }

}
