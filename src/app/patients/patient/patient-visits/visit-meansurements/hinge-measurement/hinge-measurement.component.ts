import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnInit, SimpleChange, OnChanges, SimpleChanges } from '@angular/core';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HipJointTypesService } from '@common/services/dictionaries/hip-joint-types';
import { KneeJointTypesService } from '@common/services/dictionaries/knee-joint-types';
import { Observable } from 'rxjs/Observable';
import { Entity } from '@common/interfaces/Entity';
import { PaginationChunk } from '@common/services/paginable';
import { PlasticTypesService } from '@common/services/dictionaries/plastic-types.service';
import { ProductOrderTypes } from '@common/enums/product-order-types';

@Component({
  selector: 'sl-hinge-measurement',
  templateUrl: './hinge-measurement-component.html',
  styleUrls: ['./hinge-measurement-component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PlasticTypesService,
    HipJointTypesService,
    KneeJointTypesService,
    ...FormValueAccessor.getAccessorProviders(HingeMeasurementComponent)],
})
export class HingeMeasurementComponent extends FormValueAccessor implements OnInit, OnChanges {
  @Input()
  readonly = false;

  @Input()
  orderType: ProductOrderTypes;

  public form: FormGroup;
  public schema = [
    this.cRow('Крепление', 'mount', true, false, false, false,  'input'),
    this.cRow('Компенсация укорочения', 'shorteningСompensation', true, false, false, false, 'input'),
    this.cRow('Тазобедренный шарнир', 'hipJoint', (this.orderType !== 'Tutor'), true, false, false, 'select', []),
    this.cRow('Коленный шарнир', 'kneeJoint', (this.orderType !== 'Tutor'), true, true, false,  'select', []),
    this.cRow('Голеностопный шарнир', 'ankleJoint', (this.orderType !== 'Tutor'), true, true, false,  'input'),
  ];

  public jointTypes: Entity[];
  public kneeJointTypes: Entity[];

  private cRow(name, field, visible, isJoint, hasUnilateral, hasOther, type, dictionary?) {
    return { field, name, visible, isJoint, hasUnilateral, hasOther, type, dictionary };
  }
  private getUnilateral(name) { return `unilateral${this._capitalizeFirstLetter(name)}`; }
  private getOther(name) { return `other${this._capitalizeFirstLetter(name)}`; }
  fromPaginationChunk = response => response.data;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public plasticTypesService: PlasticTypesService,
    private hipJointTypesService: HipJointTypesService,
    private kneeJointTypesService: KneeJointTypesService,
  ) {
    super();
    this.form = this.fb.group({
      ...this.schema.reduce((fg, row) => ({
        ...fg,
        [row.field]: [null],
        [this.getUnilateral(row.field)]: [null],
        [this.getOther(row.field)]: [null],
      }),
      {},
      ),
      plasticType: [null, Validators.required],
      adapterSleeve: [null, Validators.required],
    });
    this.form.get('hipJoint').valueChanges
        .subscribe((controlValue: Entity) => {
          this.schema.find(value => value.field === 'hipJoint').hasOther =
            controlValue && controlValue.id === '-1';
        });
    this.form.get('kneeJoint').valueChanges
        .subscribe((controlValue: Entity) => {
          this.schema.find(value => value.field === 'kneeJoint').hasOther =
            controlValue && controlValue.id === '-1';
        });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderType && changes.orderType.currentValue) {
      this.schema
          .filter(value => ['hipJoint', 'kneeJoint', 'ankleJoint'].includes(value.field))
          .map(value => value.visible = changes.orderType.currentValue !== 'Tutor');
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.markForCheck();
    Observable.forkJoin(
      this.hipJointTypesService.getList({ pageSize: 500 }),
      this.kneeJointTypesService.getList({ pageSize: 500 }),
    ).subscribe((response: [PaginationChunk<Entity>, PaginationChunk<Entity>]) => {
      [this.jointTypes, this.kneeJointTypes] = response.map((value) => {
        value.data.push({ id: '-1', name: 'Иное' });
        return value.data;
      });
      this.schema.find(value => value.field === 'hipJoint').dictionary = this.jointTypes;
      this.schema.find(value => value.field === 'kneeJoint').dictionary = this.kneeJointTypes;
    });
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  private _capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
