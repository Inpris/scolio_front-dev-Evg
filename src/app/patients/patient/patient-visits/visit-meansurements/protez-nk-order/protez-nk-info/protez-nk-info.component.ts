import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BranchesService} from '@common/services/dictionaries/branches.service';
import {FormValueAccessor} from '@common/models/form-value-accessor';
import {ProthesisTypesVkService} from '@common/services/dictionaries/prothesis-types-vk.service';
import {ProductTypesByMedicalService} from '@common/services/dictionaries/product-types.service';

@Component({
  selector: 'sl-protez-nk-info',
  templateUrl: './protez-nk-info.component.html',
  styleUrls: ['./protez-nk-info.component.less'],
  providers: [
    BranchesService,
    ProthesisTypesVkService,
    ProductTypesByMedicalService,
    ...FormValueAccessor.getAccessorProviders(ProtezNkInfoComponent),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtezNkInfoComponent extends FormValueAccessor {
  public form: FormGroup = this._fb.group({
    name: [null, Validators.required],
    dateOfIssue: [null, Validators.required],
    guarantee: [null, Validators.required],
    prothesisFastening: [null],
    sleeveMaterial: [null],
    prothesisParts: [null],
    dateSendingToBranch: [null],
    branch: [null, Validators.required],
  });

  public fromPaginationChunk = response => response.data;

  constructor(
    private _fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public branchService: BranchesService,
  ) {
    super();
  }

  public markForCheck() {
    this.cdr.markForCheck();
  }
}
