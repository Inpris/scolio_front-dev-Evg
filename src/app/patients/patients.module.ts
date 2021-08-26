import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientFormComponent } from './patient/patient-form/patient-form.component';
import { PatientsComponent } from './patients.component';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { PatientComponent } from './patient/patient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlsModule } from '@common/modules/form-controls';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ContactListModule } from '@common/modules/contact-list/contact-list.module';
import { TimeLineModule } from '@modules/crm/leads/time-line/time-line.module';
import { TableFilterModule } from '@common/modules/table-filter/table-filter.module';
import { ContactsModule } from '@modules/contacts/contacts.module';
import { PatientVisitsModule } from '@modules/patients/patient/patient-visits/patient-visits.module';
import { PipesModule } from '@common/pipes/pipes.module';
import { CanDeactivateGuard } from '@modules/patients/patient/guards/can-deactivate-guard.service';
import { SharedModule } from '@common/shared.module';
import { ProductService } from '@common/services/product.service';
import { PatientDetailComponent } from './patient/patient-detail/patient-detail.component';
import { PatientPurchasesComponent } from './patient/patient-purchases/patient-purchases.component';
import { PatientRepresentativesComponent } from './patient/patient-representatives/patient-representatives.component';
import { FormPatientRepresentativeComponent } from './patient/patient-representatives/form-patient-representative/form-patient-representative.component';
import { ConsentToTreatmentService } from '@common/services/consent-to-treatment.service';
import { FilesService } from '@common/services/file.service';
import { IfHasAccessModule } from '@common/modules/if-has-access/if-has-access.module';
import { DealsModule } from '@modules/deals/deals.module';
import { AdditionalContactsModule } from '@common/modules/additional-contacts/additional-contacts.module';
import { BranchAccessesModule } from "@modules/patients/branch-accesses/branch-accesses.module";

@NgModule({
  imports: [
    CommonModule,
    PatientsRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    TableFilterModule,
    FormsModule,
    ReactiveFormsModule,
    ContactListModule,
    TimeLineModule,
    FormControlsModule,
    ContactsModule,
    PatientVisitsModule,
    PipesModule,
    IfHasAccessModule,
    DealsModule,
    AdditionalContactsModule,
    BranchAccessesModule,
  ],
  declarations: [
    PatientsComponent,
    CreatePatientComponent,
    PatientComponent,
    PatientFormComponent,
    PatientDetailComponent,
    PatientPurchasesComponent,
    PatientRepresentativesComponent,
    FormPatientRepresentativeComponent,
  ],
  providers: [
    CanDeactivateGuard,
    ProductService,
    ConsentToTreatmentService,
    FilesService,
  ],
  entryComponents: [
    CreatePatientComponent,
    FormPatientRepresentativeComponent,
  ],
  exports: [
    CreatePatientComponent,
    PatientFormComponent,
  ],
})
export class PatientsModule {
}
