import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PurchaseDetailComponent } from './purchase-detail.component';
import { PurchaseDetailRoutingModule } from './purchase-detail-routing.module';

import { GeneralInfoComponent } from './general-info/general-info.component';
import { PurchaseInfoBlockComponent } from './general-info/purchase-info-block/purchase-info-block.component';
import { PurchaseInfoBlockViewerComponent } from './general-info/purchase-info-block/purchase-info-block-viewer/purchase-info-block-viewer.component';
import { PurchaseInfoBlockEditorComponent } from './general-info/purchase-info-block/purchase-info-block-editor/purchase-info-block-editor.component';
import { AdditionalInfoBlockComponent } from './general-info/additional-info-block/additional-info-block.component';
import { AdditionalInfoBlockViewerComponent } from './general-info/additional-info-block/additional-info-block-viewer/additional-info-block-viewer.component';
import { AdditionalInfoBlockEditorComponent } from './general-info/additional-info-block/additional-info-block-editor/additional-info-block-editor.component';
import { FilesInfoBlockComponent } from './general-info/files-info-block/files-info-block.component';
import { FilesInfoBlockViewerComponent } from './general-info/files-info-block/files-info-block-viewer/files-info-block-viewer.component';
import { FilesInfoBlockEditorComponent } from './general-info/files-info-block/files-info-block-editor/files-info-block-editor.component';

import { PatientsComponent } from './patients/patients.component';

import { ProductsComponent } from './products/products.component';

import { PurchaseService } from '@common/services/purchase.service';
import { PurchaseStore } from '@common/services/purchase.store';
import { PurchaseTenderPlatformsService } from '@common/services/purchase-tender-platforms.service';
import { PurchaseStatusesService } from '@common/services/purchase-statuses.service';
import { PurchaseTypesService } from '@common/services/purchase-types.service';
import { PatientDevicesComponent } from './patients/patient-devices/patient-devices.component';
import { SelectProductComponent } from './patients/select-product/select-product.component';
import { PurchaseSharedModule } from '../purchase-shared/purchase-shared.module';
import { ProductSpecificationComponent } from './products/product-specification/product-specification.component';
import { PurchaseShortDescriptionComponent } from './purchase-short-description/purchase-short-description.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { SelectSpecificationComponent } from './products/select-specification/select-specification.component';
import { SpecificationService } from '@common/services/specification.service';
import { DictionarySpecificationComponent } from './products/dictionary-specification/dictionary-specification.component';
import { CustomerDataService } from '@common/helpers/customer-data';
import { CustomerService } from '@common/services/customer.service';
import { CityService } from '@common/services/city.service';
import { PatientsModule } from '@modules/patients/patients.module';
import { PurchaseChaptersService } from '@common/services/purchase-chapters.service';
import { CreatePurchasePacientComponent } from '@modules/purchases/purchase-detail/patients/create-purchase-pacient/create-purchase-pacient.component';
import { InfinityScrollModule } from '@common/modules/infinity-scroll/infinity-scroll.module';
import { FileTypesService } from '@common/services/file-types.service';
import { FilesService } from '@common/services/file.service';
import { SharedModule } from '@common/shared.module';
import { FormControlsModule } from '@common/modules/form-controls';
import { PurchasePatientAppointmentsComponent } from '@modules/purchases/purchase-detail/patients/patient-devices/purchase-patient-appointments/purchase-patient-appointments.component';
import { SheduleModule } from '@modules/shedule/shedule.module';
import { MedicalServicesService } from '@common/services/medical-services.service';
import { ProductTypesByMedicalService } from '@common/services/dictionaries/product-types-by-medical.service';
import { TableFilterModule } from '@common/modules/table-filter/table-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PurchaseDetailRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    TableFilterModule,
    PurchaseSharedModule,
    PatientsModule,
    InfinityScrollModule,
    FormControlsModule,
    SheduleModule,
  ],
  declarations: [
    PurchaseDetailComponent,
    GeneralInfoComponent,
    PurchaseInfoBlockComponent,
    PurchaseInfoBlockViewerComponent,
    PurchaseInfoBlockEditorComponent,
    AdditionalInfoBlockComponent,
    AdditionalInfoBlockViewerComponent,
    AdditionalInfoBlockEditorComponent,
    FilesInfoBlockComponent,
    FilesInfoBlockViewerComponent,
    FilesInfoBlockEditorComponent,
    PatientsComponent,
    ProductsComponent,
    PatientDevicesComponent,
    SelectProductComponent,
    CreateProductComponent,
    ProductSpecificationComponent,
    PurchaseShortDescriptionComponent,
    SelectSpecificationComponent,
    DictionarySpecificationComponent,
    CreatePurchasePacientComponent,
    PurchasePatientAppointmentsComponent,
  ],
  exports: [
    PurchaseInfoBlockEditorComponent,
    AdditionalInfoBlockEditorComponent,
    FilesInfoBlockEditorComponent,
  ],
  providers: [
    PurchaseService,
    PurchaseStore,
    PurchaseTenderPlatformsService,
    PurchaseStatusesService,
    PurchaseTypesService,
    SpecificationService,
    CustomerService,
    CustomerDataService,
    CityService,
    PurchaseChaptersService,
    FileTypesService,
    FilesService,
    MedicalServicesService,
    ProductTypesByMedicalService,
  ],
  entryComponents: [
    SelectProductComponent,
    CreateProductComponent,
    SelectSpecificationComponent,
    DictionarySpecificationComponent,
  ],
})
export class PurchaseDetailModule {
}
