import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { VisitsManager } from '@modules/patients/patient/patient-visits/helpers/visits-manager';
import { BranchesService } from '@common/services/dictionaries/branches.service';
import { PlasticTypesService } from '@common/services/dictionaries/plastic-types.service';
import { CorsetTypesService } from '@common/services/dictionaries/corset-types.service';
import { ProductTypesByMedicalService } from '@common/services/dictionaries/product-types.service';
import { CorsetOrder } from '@common/models/product-order/corset-order';
import { CorsetShortFormData } from '@common/interfaces/product-order/Corset-short-form-data';

@Component({
  selector: 'sl-corset-order',
  templateUrl: './corset-order.component.html',
  styleUrls: ['./corset-order.component.less'],
  providers: [
    BranchesService,
    PlasticTypesService,
    CorsetTypesService,
    ProductTypesByMedicalService,
    ...FormValueAccessor.getAccessorProviders(CorsetOrderComponent),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorsetOrderComponent extends FormValueAccessor implements OnInit {
  @Input()
  data: VisitsManager;

  @Input()
  measurementData: {};

  @Input()
  device: CorsetOrder;
  @Input()
  corsetData: CorsetShortFormData;

  fromPaginationChunk = response => response.data;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public branchService: BranchesService,
    public plasticTypesService: PlasticTypesService,
    public corsetTypesService: CorsetTypesService,
  ) {
    super();
    this.form = fb.group({
      name: [null],
      corsetType: [null, Validators.required],
      plasticType: [null, Validators.required],
      color: [null, Validators.required],
      dateOfIssue: [null, Validators.required],
      dateOfIssueTurner: [null],
      dateSendingToBranch: [null],
      branch: [null, Validators.required],
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
