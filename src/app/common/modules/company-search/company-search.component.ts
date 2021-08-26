import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from '@common/services/customer.service';
import { Customer } from '@common/models/customer';
import { CompanyService } from '@common/services/company.service';
import { Company } from '@common/models/company';

@Component({
  selector: 'sl-company-search',
  templateUrl: './company-search.component.html',
  providers: [CompanyService],
})
export class CompanySearchComponent implements OnInit {
  searchForm: FormGroup;
  companies: Company[] = [];
  notFound = false;

  @Input()
  disabled: boolean;

  @Output()
  companySelected = new EventEmitter<Company>();

  @Input()
  set company(company: Company) {
    if (!company) { return; }
    this.skipNextContactChange = true;
    this.companies = [company];
    this.searchForm.patchValue({ company });
  }

  private skipNextContactChange = false;

  constructor(private formBuilder: FormBuilder, private companyService: CompanyService) {
    this.searchForm = this.formBuilder.group({ company: null, searchTerm: null });
  }

  ngOnInit() {
    this.onSearchTermChange();
    this.onContactChange();
  }

  reset() {
    this.notFound = false;
    this.companies = [];
    this.skipNextContactChange = true;
    this.searchForm.patchValue({ company: null, searchTerm: null });
  }

  onSearch(searchTerm: string) {
    this.searchForm.patchValue({ searchTerm });
  }

  private onSearchTermChange() {
    this.searchForm.get('searchTerm').valueChanges
      .debounceTime(500)
      .do(() => { this.notFound = false; })
      .filter(value => value != null && value.length >= 3)
      .distinctUntilChanged()
      .flatMap(searchTerm => this.companyService.getList({ inn: searchTerm }, { pageSize: 10 }))
      .map(response => response.data)
      .subscribe((companies) => {
        this.notFound = companies.length === 0;
        this.companies = companies;
      });
  }

  private onContactChange() {
    this.searchForm.get('company').valueChanges.subscribe((company: string | Company) => {
      if (this.skipNextContactChange) {
        this.skipNextContactChange = false;
        return;
      }
      if (typeof company === 'string') {
        this.skipNextContactChange = true;
        this.companySelected.emit(new Company({ inn: company } as any));
        this.searchForm.patchValue({ company: null, searchTerm: null });
      } else if (company == null) {
        this.companies = [];
        this.companySelected.emit(null);
      } else {
        this.companySelected.emit(company);
      }
    });
  }
}
