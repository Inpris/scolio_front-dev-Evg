import { Component, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Measurement, MesurementType, VertebraType } from '@common/interfaces/Measurement';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { EnumToArrayPipe } from '@common/pipes/enum-to-array';
import { FormValueAccessor } from '@common/models/form-value-accessor';

@Component({
  selector: 'sl-arc-list',
  templateUrl: './arc-list.component.html',
  styleUrls: ['./arc-list.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(ArcListComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArcListComponent extends FormValueAccessor {
  @Output()
  measurementChange = new EventEmitter<Measurement[]>();
  @Output()
  measureArcAngle = new EventEmitter<MesurementType>();
  @Output()
  measureVertebraTorsian = new EventEmitter<MesurementType>();

  public form: FormGroup;

  public columns = [
    { name: 'Угол', field: 'value', readonly: true, type: 'input' },
    { name: 'Граница 1', field: 'boundary1', readonly: false, type: 'select' },
    { name: 'Вершина', field: 'vertex', readonly: false, type: 'select' },
    { name: 'Граница 2', field: 'boundary2', readonly: false, type: 'select' },
    { name: 'Ротация', field: 'rotation', readonly: false, type: 'select' },
  ];
  public rows = [{ name: 'Верхнегрудная дуга', type: MesurementType.PectoralArch, index: 0 },
                 { name: 'Грудная дуга', type: MesurementType.ThoracicArch, index: 1 },
                 { name: 'Грудопоясничная дуга', type: MesurementType.ThoracolumbarArch, index: 2 },
                 { name: 'Поясничная дуга', type: MesurementType.LumbarArche, index: 3 }];
  public get types() {
    return new EnumToArrayPipe().transform(MesurementType);
  }
  public get vertebraType() {
    return new EnumToArrayPipe().transform(VertebraType);
  }
  public rotationType = (() => {
    const rotations = [];
    for (let i = 0; i <= 60; i = i + 2) {
      rotations.push(i);
    }
    return rotations;
  })();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef) {
    super();
    this.form = fb.group({
      measurements: fb.array(this.rows.map((rowName, index) => fb.group({
        ...this.columns.reduce((columns, column) => {
          columns[column.field] = [null];
          return columns;
        }, {}),
        type: [index + 1],
        value: [null],
      }))),
    });

    this.form.get('measurements').valueChanges.subscribe(() => {
      this.measurementChange.emit(this.getMeasurements());
    });
  }

  getMeasurements() {
    const changedMeasurement = [];
    this.form.get('measurements')['controls'].forEach((control) => {
      const measurement = { boundary1: control.get('boundary1').value,
        vertex: control.get('vertex').value,
        boundary2: control.get('boundary2').value,
        rotation: control.get('rotation').value,
        type: control.get('type').value,
        value: control.get('value').value,
      };
      changedMeasurement.push(measurement);
    });
    return changedMeasurement;
  }

  clearAngleValue(index: number) {
    const measurementArray: FormArray = this.form.get('measurements') as FormArray;
    if (index !== undefined) {
      measurementArray.controls[index].get('value').patchValue(null);
      this.measurementChange.emit(this.getMeasurements());
    }
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

  measureAngle(type: MesurementType) {
    this.measureArcAngle.emit(type);
  }

  measureTorsian(type: MesurementType) {
    this.measureVertebraTorsian.emit(type);
  }
}
