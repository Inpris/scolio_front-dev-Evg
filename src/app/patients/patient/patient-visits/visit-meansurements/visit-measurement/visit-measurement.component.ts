import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { VertebraType } from '@common/interfaces/Measurement';
import { EnumToArrayPipe } from '@common/pipes/enum-to-array';

@Component({
  selector: 'sl-visit-meansurement',
  templateUrl: './visit-measurement.component.html',
  styleUrls: ['./visit-measurement.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(VisitMeasurementComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitMeasurementComponent extends FormValueAccessor implements OnInit {
  @Input()
  readonly = false;
  public columns = [
    { name: 'Угол', field: 'value', readonly: true, type: 'input' },
    { name: 'Граница 1', field: 'boundary1', readonly: false, type: 'select' },
    { name: 'Вершина', field: 'vertex', readonly: false, type: 'select' },
    { name: 'Граница 2', field: 'boundary2', readonly: false, type: 'select' },
    { name: 'Ротация', field: 'rotation', readonly: false, type: 'select' },
  ];
  public rows = ['Верхнегрудная дуга', 'Грудная дуга', 'Грудопоясничная дуга', 'Поясничная дуга'];
  public types = ['PectoralArch', 'ThoracicArch', 'ThoracolumbarArch', 'LumbarArche'];
  public rotationType = (() => {
    const rotations = [];
    for (let i = 0; i <= 60; i = i + 2) {
      rotations.push(i);
    }
    return rotations;
  })();

  public get vertebraType() {
    return new EnumToArrayPipe().transform(VertebraType);
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.form = fb.group({
      measurements: fb.array(this.rows.map((rowName, index) => fb.group({
        ...this.columns.reduce((columns, column) => {
          columns[column.field] = [null];
          return columns;
        }, {}),
        type: [this.types[index]],
        value: [null],
      }))),
    });
  }

  ngOnInit() {
    if (this.readonly) { this.form.disable(); }
    super.ngOnInit();
  }

  writeValue(v) {
    if (!v) {
      return;
    }
    super.writeValue(v);
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  clearAngleValue(measurementRow: string) {
    const measurementArray: FormArray = this.form.get('measurements') as FormArray;
    const index = this.rows.indexOf(measurementRow);
    if (index !== undefined) {
      measurementArray.controls[index].get('value').setValue(null);
    }
  }
}
