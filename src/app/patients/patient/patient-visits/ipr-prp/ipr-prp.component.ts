import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { IprPrpService } from '@common/services/dictionaries/ipr-prp.service';

@Component({
  selector: 'sl-ipr-prp',
  templateUrl: './ipr-prp.component.html',
  styleUrls: ['./ipr-prp.component.less'],
  providers: [
    ...FormValueAccessor.getAccessorProviders(IprPrpComponent),
    IprPrpService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IprPrpComponent extends FormValueAccessor {
  public dictionary;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private iprPrp: IprPrpService,
  ) {
    super();
    this.form = fb.group({
      iprPrp: [null],
      iprPrpActualDate: [null],
      iprPrpComment: [null],
    });
    this.iprPrp.getList({})
      .map(response => response.data)
      .subscribe(data => this.dictionary = data);
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

}
