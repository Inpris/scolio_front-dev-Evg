import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';

@Component({
  selector: 'sl-corset-correction',
  templateUrl: './corset-correction.component.html',
  styleUrls: ['./corset-correction.component.less'],
  providers: [
    ...FormValueAccessor.getAccessorProviders(CorsetCorrectionComponent),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorsetCorrectionComponent extends FormValueAccessor implements OnInit {
  public distanceInCentimeters = [
    { value: 5, name: '0,5 см' },
    { value: 10, name: '1 см' },
    { value: 20, name: '2 см' },
    { value: 30, name: '3 см' },
  ];
  public insertionThoraxInFront = [
    { value: 10, name: '4,5 Ребер' },
    { value: 20, name: '5,6 Ребер' },
    { value: 30, name: '6,7 Ребер' },
    { value: 40, name: '7,8 Ребер' },
  ];
  public vertebra = [
    { name: 'Th1', value: 1 },
    { name: 'Th2', value: 2 },
    { name: 'Th3', value: 3 },
    { name: 'Th4', value: 4 },
    { name: 'Th5', value: 5 },
    { name: 'Th6', value: 6 },
    { name: 'Th7', value: 7 },
    { name: 'Th8', value: 8 },
    { name: 'Th9', value: 9 },
    { name: 'Th10', value: 10 },
    { name: 'Th11', value: 11 },
    { name: 'Th12', value: 12 },
    { name: 'L1', value: 13 },
    { name: 'L2', value: 14 },
    { name: 'L3', value: 15 },
    { name: 'L4', value: 16 },
    { name: 'L5', value: 17 },
  ];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.form = fb.group({
      enlargedFrontCavity: [null],
      exctraCorrectionVariants: [null],
      insertionThoraxInFront: [null],
      liftingOfTheAxillary: [null],
      pasteOfBreast: [null],
      pasteOfBreastFrom: [null],
      pasteOfBreastTo: [null],
      pasteOfLoin: [null],
      pasteOfLoinFrom: [null],
      pasteOfLoinTo: [null],
      shiftOfTheAxillary: [null],
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.markForCheck();
  }

  markForCheck() {
    this.cdr.markForCheck();
  }
}
