import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import { ContactResolverService } from '@modules/contacts/helpers/contact-resolver.service';
import { PatientsComponent } from './patients.component';
import { CanDeactivateGuard } from '@modules/patients/patient/guards/can-deactivate-guard.service';
import { PatientVisitsComponent } from '@modules/patients/patient/patient-visits/patient-visits.component';
import { PatientDetailComponent } from '@modules/patients/patient/patient-detail/patient-detail.component';
import { OrderPrintComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/order-print/order-print.component';
import { PatientPurchasesComponent } from '@modules/patients/patient/patient-purchases/patient-purchases.component';
import { PatientRepresentativesComponent } from './patient/patient-representatives/patient-representatives.component';

const routes: Routes = [
  {
    path: '',
    component: PatientsComponent,
  },
  {
    path: ':id',
    component: PatientComponent,
    resolve: {
      contact: ContactResolverService,
    },
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
      },
      {
        path: 'info',
        component: PatientDetailComponent,
      },
      {
        path: 'purchases',
        component: PatientPurchasesComponent,
      },
      {
        path: 'visits/:visitId/:deviceId/:productOrderType/print',
        component: OrderPrintComponent,
        pathMatch: 'full',
      },
      {
        path: 'visits',
        canDeactivate: [CanDeactivateGuard],
        component: PatientVisitsComponent,
      },
      {
        path: 'representatives',
        component: PatientRepresentativesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  declarations: [],
  exports: [RouterModule],
})
export class PatientsRoutingModule {
}
