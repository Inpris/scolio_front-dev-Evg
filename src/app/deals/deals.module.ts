import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateContractComponent } from './create-contract/create-contract.component';
import { SharedModule } from '@common/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormControlsModule } from '@common/modules/form-controls';
import { ContragentCompanyComponent } from './create-contract/contragent-company/contragent-company.component';
import { ContragentPersonComponent } from './create-contract/contragent-person/contragent-person.component';
import { AdditionalContactsModule } from '@common/modules/additional-contacts/additional-contacts.module';
import { ContactListModule } from '@common/modules/contact-list/contact-list.module';
import { RepresentativeSearchComponent } from './create-contract/representative-search/representative-search.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ContactListModule,
    NgZorroAntdModule,
    FormsModule,
    FormControlsModule,
    AdditionalContactsModule,
  ],
  declarations: [
    CreateContractComponent,
    ContragentCompanyComponent,
    ContragentPersonComponent,
    RepresentativeSearchComponent,
  ],
  entryComponents: [
    CreateContractComponent,
  ],
  exports: [
    CreateContractComponent,
    ContragentPersonComponent,
  ],
})
export class DealsModule {
}
