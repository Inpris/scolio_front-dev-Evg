import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { BranchesService } from '@common/services/dictionaries/branches.service';
import { ProductTypesByMedicalService } from '@common/services/dictionaries/product-types.service';
import { ProthesisTypesVkService } from '@common/services/dictionaries/prothesis-types-vk.service';

@Component({
  selector: 'sl-protez-vk-order',
  templateUrl: './protez-vk-order.component.html',
  styleUrls: ['./protez-vk-order.component.less'],
  providers: [
    BranchesService,
    ProthesisTypesVkService,
    ProductTypesByMedicalService,
    ...FormValueAccessor.getAccessorProviders(ProtezVkOrderComponent),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtezVkOrderComponent extends FormValueAccessor {
  fromPaginationChunk = response => response.data;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public branchService: BranchesService,
    public prothesisTypesService: ProthesisTypesVkService,
  ) {
    super();
    this.form = fb.group({
      name: [null],
      device: [null],
      prothesisVkType: [null, Validators.required],
      color: [null, Validators.required],
      dateOfIssue: [null, Validators.required],
      dateOfIssueTurner: [null],
      dateSendingToBranch: [null],
      branch: [null, Validators.required],
    });
  }

  markForCheck() {
    this.cdr.markForCheck();
  }
}
