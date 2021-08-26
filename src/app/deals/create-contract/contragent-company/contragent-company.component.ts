import { ChangeDetectorRef, Component } from '@angular/core';
import { FormValueAccessor } from '@common/models/form-value-accessor';
import { FormBuilder, Validators } from '@angular/forms';
import { Company } from '@common/models/company';

@Component({
  selector: 'sl-contragent-company',
  templateUrl: './contragent-company.component.html',
  styleUrls: ['./contragent-company.component.less'],
  providers: [...FormValueAccessor.getAccessorProviders(ContragentCompanyComponent)],
})
export class ContragentCompanyComponent extends FormValueAccessor {

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.form = fb.group({
      address: [null, Validators.required],
      region: [null, Validators.required],
      city: [null, Validators.required],
      postalCode: [null, Validators.required],
      phone: [null, Validators.required],
      inn: [null, Validators.required],
      kpp: [null, Validators.required],
      otherDetails: [null],
      name: [null, Validators.required],
      proxy: fb.group({
        id: [null],
        firstName: [null, Validators.required],
        secondName: [null],
        lastName: [null, Validators.required],
      }),
      selected: [null],
    });
  }

  markForCheck() {
    this.cdr.markForCheck();
  }

  onCompanyChange(company: Company) {
    if (company) {
      this.form.patchValue({
        ...company,
        selected: company,
        proxy: company.proxy || {
          id: null,
          firstName: null,
          secondName: null,
          lastName: null,
        },
      });
    } else {
      this.form.reset();
    }
  }
}
