import { NgModule } from '@angular/core';
import { SlDatePickerModule } from '@common/modules/date-picker/date-picker.module';
import { SlTimePickerModule } from '@common/modules/time-picker';
import { PhoneFormatterDirective } from './directives/phone-formatter.directive';
import { TemplateReplacementDirective } from '@common/directives/template-replacement.directive';
import { FixedSavePanelModule } from '@common/modules/fixed-save-panel/fixed-save-panel.module';
import { ScrollToFirstInvalidDirective } from '@common/directives/scroll-to-first-invalid.directive';
import { FocusCaptureDirective } from './directives/focus-capture.directive';
import { ContactSearchModule } from '@common/modules/contact-search/contact-search.module';
import { CompanySearchModule } from '@common/modules/company-search/company-search.module';
import { ContractsService } from '@common/services/contracts.service';
import { CustomerService } from '@common/services/customer.service';
import { CompanyService } from '@common/services/company.service';
import { PatientService } from '@common/services/patient.service';
import { PurchaseStatusesService } from '@common/services/purchase-statuses.service';
import { CityService } from '@common/services/city.service';
import { GenderService } from '@common/services/dictionaries/gender.service';
import { DisabilityGroupsService } from '@common/services/dictionaries/disability-groups.service';
import { VisitReasonsListService } from '@common/services/dictionaries/visit-reasons-list.service';
import { Diagnosis1Service } from '@common/services/dictionaries/diagnosis1.service';
import { Diagnosis2Service } from '@common/services/dictionaries/diagnosis2.service';
import { BooleanStatusesService } from '@common/services/dictionaries/boolean-statuses.service';
import { ProductTypesByMedicalService } from '@common/services/dictionaries/product-types.service';
import { VertebraTypesService } from '@common/services/dictionaries/vertebra-types.service';
import { ReportConstructorService } from './services/report-constructor.service';
import { ReportService } from './services/report.service';
import { CurrencyDirective } from "@common/directives/currency.directive";
import { YearDirective } from "@common/directives/year.directive";

@NgModule({
  exports: [
    SlDatePickerModule,
    SlTimePickerModule,
    PhoneFormatterDirective,
    TemplateReplacementDirective,
    FixedSavePanelModule,
    ScrollToFirstInvalidDirective,
    FocusCaptureDirective,
    CurrencyDirective,
    YearDirective,
    ContactSearchModule,
    CompanySearchModule,
  ],
  declarations: [
    PhoneFormatterDirective,
    TemplateReplacementDirective,
    ScrollToFirstInvalidDirective,
    FocusCaptureDirective,
    CurrencyDirective,
    YearDirective,
  ],
  providers: [
    ContractsService,
    CustomerService,
    CompanyService,
    PurchaseStatusesService,
    PatientService,
    ReportConstructorService,
    ReportService,
    CityService,
    GenderService,
    DisabilityGroupsService,
    VisitReasonsListService,
    Diagnosis1Service,
    Diagnosis2Service,
    BooleanStatusesService,
    ProductTypesByMedicalService,
    VertebraTypesService,
  ],
})
export class SharedModule {
}
