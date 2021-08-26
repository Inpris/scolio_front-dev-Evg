import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'sl-apparatus-device-measurement',
  templateUrl: './apparatus-device-measurement.component.html',
  styleUrls: ['./apparatus-device-measurement.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(ApparatusDeviceMeasurementComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApparatusDeviceMeasurementComponent extends FormValueAccessor {
  @Input() readonly = false;
  public schema = {
    round: [
      this.cRow('Носок', 'SockRound'),
      this.cRow('Головки плюсневых', 'MetatarsalHeadsRound'),
      this.cRow('Пятка', 'HeelRound'),
      this.cRow('Над лодыжками', 'OverTheAnklesRound'),
      this.cRow('Голень (максимально выступающая часть)', 'DrumstickMaximumRound'),
      this.cRow('Колено', 'KneeRound'),
      this.cRow('Середина бедра', 'MidThighRound'),
      this.cRow('Промежность', 'CrotchRound'),
    ],
    transverse: [
      this.cRow('Лодыжки', 'Ankles'),
      this.cRow('Головки плюсневы', 'MetatarsalHeads'),
      this.cRow('Длина стопы', 'FootLength'),
    ],
    height: [
      this.cRow('Над лодыжками', 'OverTheAnkles'),
      this.cRow('Голень', 'Shin'),
      this.cRow('Колено', 'Knee'),
      this.cRow('Середина бедра', 'MidThigh'),
      this.cRow('Промежность', 'Crotch'),
      this.cRow('Вертел', 'Spit'),
    ],
    angle: [
      this.cRow('Контрактура колена', 'KneeContracture'),
      this.cRow('Контрактура голеностопа', 'AnkleContracture'),
      this.cRow('Контрактура тазобедренного', 'HipContracture'),
    ],
  };
  private cRow(name, field) { return { field, name, focused: false }; }
  private getSide(name, left = false) { return `${left ? 'left' : 'right'}${name}`; }
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    super();
    const rows = [
      ...this.schema.angle,
      ...this.schema.round,
      ...this.schema.transverse,
      ...this.schema.height,
    ];
    this.form = this.fb.group(
      rows.reduce((fg, row) => ({
        ...fg,
        [this.getSide(row.field)]: [null],
        [this.getSide(row.field, true)]: [null],
      }),
      {},
    ));
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  measurementParser(value) {
    if (value.length > 3) { return value.slice(0, 3); }
    return value.replace('.', '');
  }
}
