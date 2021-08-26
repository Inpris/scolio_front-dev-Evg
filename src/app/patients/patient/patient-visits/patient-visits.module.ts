import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientDiagnosisComponent } from './patient-diagnosis/patient-diagnosis.component';
import { VisitsTimelineComponent } from './visits-timeline/visits-timeline.component';
import { IprPrpComponent } from './ipr-prp/ipr-prp.component';
import { StumpVicesVkComponent } from './stump-vices-vk/stump-vices-vk.component';
import { VisitHistorySelectionComponent } from './visit-history-selection/visit-history-selection.component';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { VisitCommentComponent } from './visit-comment/visit-comment.component';
import { PatientHealingPlanComponent } from './patient-healing-plan/patient-healing-plan.component';
import { PatientVisitsComponent } from './patient-visits.component';
import { VisitAppointmentComponent } from './visit-appointment/visit-appointment.component';
import { VisitDocumentsComponent } from './visit-documents/visit-documents.component';
import { VisitPhotoVideoComponent } from './visit-photo-video/visit-photo-video.component';
import { CorsetOrderComponent, CorsetWearingComponent, VisitMeasurementComponent } from './visit-meansurements';
import { FormControlsModule } from '@common/modules/form-controls';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VisitMediaPreviewComponent } from './visit-photo-video/visit-media-preview/visit-media-preview.component';
import { VisitPhotoPreviewComponent } from './visit-photo-video/visit-photo-preview/visit-photo-preview.component';
import { CreateVisitComponent } from './create-visit/create-visit.component';
import { CorsetOrderDetailComponent } from './visit-meansurements/corset-order/corset-order-detail/corset-order-detail.component';
import { CorsetOrderPrintComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/corset-order-print/corset-order-print.component';
import { CorsetOrderTermComponent } from './visit-meansurements/corset-order/corset-order-detail/corset-order-term/corset-order-term.component';
import { VisitVideoPreviewComponent } from './visit-photo-video/visit-video-preview/visit-video-preview.component';
import { CorsetDeviceMeasurementComponent } from './visit-meansurements/corset-device-measurement/corset-device-measurement.component';
import { VisitDevicesComponent } from './visit-devices/visit-devices.component';
import { CorsetOrderShortComponent } from './visit-meansurements/corset-order/corset-order-short/corset-order-short.component';
import { ProtezVKDeviceMeasurementComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-vk-device-measurement/protez-vk-device-measurement.component';
import { ProtezVkOrderComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-vk-order/protez-vk-order.component';
import { ProtezVkOrderShortComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-vk-order/protez-vk-order-short/protez-vk-order-short.component';
import { ProtezVkOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-vk-order/protez-vk-order-detail/protez-vk-order-detail.component';
import { CorsetOrderService } from '@common/services/corset-order';
import { XrayPhotoModule } from '@modules/xray/xray-photo/xray-photo.module';
import { ProductOrderService } from '@common/services/product-order.service';
import { OrderProgressComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/order-progress/order-progress.component';
import { OrderModelComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/order-model/order-model.component';
import { OrderIssueComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/order-issue/order-issue.component';
import { OrderManufacturingComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/common/order-manufacturing/order-manufacturing.component';
import { SwoshDeviceMeasurementComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/swosh-device-measurement/swosh-device-measurement.component';
import { SwoshOrderShortComponent } from './visit-meansurements/swosh-order/swosh-order-short/swosh-order-short.component';
import { SwoshOrderDetailComponent } from './visit-meansurements/swosh-order/swosh-order-detail/swosh-order-detail.component';
import { SwoshOrderPrintComponent } from './visit-meansurements/swosh-order/swosh-order-print/swosh-order-print.component';
import { VisitPhotoCompareComponent } from './visit-photo-video/visit-photo-compare/visit-photo-compare.component';
import { CreateMtkComponent } from './visit-documents/create-mtk/create-mtk.component';
import { CreateMtkTemplateComponent } from './visit-documents/create-mtk-template/create-mtk-template.component';
import { MtkComissionComponent } from './visit-documents/mtk-comission/mtk-comission.component';
import { VisitFilesComponent } from './visit-files/visit-files.component';
import { DeviceMeasurementComponent } from './visit-meansurements/device-measurement/device-measurement.component';
import { VisitBySysNamePipe } from './pipes/visit-by-sys-name.pipe';
import {
  CorsetCorrectionOrderDetailComponent,
} from '@modules/patients/patient/patient-visits/visit-meansurements/corset-correction-order/corset-correction-order-detail/corset-correction-order-detail.component';
import { CorsetCorrectionOrderComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-correction-order/corset-correction-order.component';
import { CorsetCorrectionComponent } from './visit-meansurements/corset-correction-order/corset-correction/corset-correction.component';
import { IfHasAccessModule } from '@common/modules/if-has-access/if-has-access.module';
import { SharedModule } from '@common/shared.module';
import { ApparatusDeviceMeasurementComponent } from './visit-meansurements/apparatus-device-measurement/apparatus-device-measurement.component';
import { ApparatusOrderShortComponent } from './visit-meansurements/apparatus-order/apparatus-order-short/apparatus-order-short.component';
import { ApparatusOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/apparatus-order-detail/apparatus-order-detail.component';
import { ApparatusOrderComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/apparatus-order.component';
import { ApparatusProductionMethodComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/apparatus-production-method/apparatus-production-method.component';
import { ProductionMethodService } from '@common/services/production-method.service';
import { OrderPrintComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/order-print/order-print.component';
import { DealsModule } from '@modules/deals/deals.module';
// tslint:disable-next-line:max-line-length
import { VerticalizatorOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/verticalizator-order/verticalizator-order-detail/verticalizator-order-detail.component';
import { HingeMeasurementComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/hinge-measurement/hinge-measurement.component';
import { VerticalizatorOrderShortComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/verticalizator-order/verticalizator-order-short/verticalizator-order-short.component';
import { VerticalizatorOrderPrintComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/verticalizator-order/verticalizator-order-print/verticalizator-order-print.component';
import { ApparatusOrderPrintComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/apparatus-order/apparatus-order-print/apparatus-order-print.component';
import { ContractTemplatesComponent } from './visit-appointment/contract-templates/contract-templates.component';
import { MedicalServicesService } from '@common/services/medical-services.service';
import { PatientService } from '@common/services/patient.service';
import { ProductTypesByMedicalService } from '@common/services/dictionaries/product-types-by-medical.service';
import { MarloModalComponent } from '@modules/patients/patient/patient-visits/marlo-modal/marlo-modal.component';
import { ProtezNkDeviceMeasurementComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-device-measurement/protez-nk-device-measurement.component';
import { ProtezNkOrderShortComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/protez-nk-order-short/protez-nk-order-short.component';
import { ProtezNkOrderDetailComponent } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/protez-nk-order-detail/protez-nk-order-detail.component';
import { ProtezNkInfoComponent } from './visit-meansurements/protez-nk-order/protez-nk-info/protez-nk-info.component';
import {ProtezNkOrderPrintComponent} from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-order/protez-nk-order-print/protez-nk-order-print.component';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    IfHasAccessModule,
    SharedModule,
    FormControlsModule,
    FormsModule,
    ReactiveFormsModule,
    XrayPhotoModule,
    DealsModule,
  ],
  declarations: [
    PatientVisitsComponent,
    VisitsTimelineComponent,
    VisitAppointmentComponent,
    PatientInfoComponent,
    PatientDiagnosisComponent,
    IprPrpComponent,
    StumpVicesVkComponent,
    VisitCommentComponent,
    VisitDocumentsComponent,
    PatientHealingPlanComponent,
    VisitPhotoVideoComponent,
    CorsetOrderComponent,
    VisitMeasurementComponent,
    CorsetWearingComponent,
    VisitHistorySelectionComponent,
    VisitMediaPreviewComponent,
    VisitPhotoPreviewComponent,
    CreateVisitComponent,
    CorsetOrderDetailComponent,
    CorsetOrderPrintComponent,
    ProtezVkOrderDetailComponent,
    CorsetOrderTermComponent,
    OrderIssueComponent,
    OrderModelComponent,
    OrderManufacturingComponent,
    OrderProgressComponent,
    VisitVideoPreviewComponent,
    CorsetDeviceMeasurementComponent,
    ProtezVKDeviceMeasurementComponent,
    ProtezNkDeviceMeasurementComponent,
    ProtezVkOrderComponent,
    ProtezNkOrderShortComponent,
    ProtezNkOrderDetailComponent,
    VisitDevicesComponent,
    CorsetOrderShortComponent,
    ProtezVkOrderShortComponent,
    SwoshDeviceMeasurementComponent,
    SwoshOrderShortComponent,
    SwoshOrderDetailComponent,
    SwoshOrderPrintComponent,
    OrderPrintComponent,
    VisitPhotoCompareComponent,
    CreateMtkComponent,
    CreateMtkTemplateComponent,
    MtkComissionComponent,
    VisitFilesComponent,
    DeviceMeasurementComponent,
    VisitBySysNamePipe,
    CorsetCorrectionOrderDetailComponent,
    CorsetCorrectionOrderComponent,
    CorsetCorrectionComponent,
    ApparatusDeviceMeasurementComponent,
    ApparatusOrderShortComponent,
    ApparatusOrderDetailComponent,
    ApparatusOrderComponent,
    ApparatusProductionMethodComponent,
    ApparatusOrderPrintComponent,
    ProtezNkOrderPrintComponent,
    VerticalizatorOrderShortComponent,
    VerticalizatorOrderDetailComponent,
    VerticalizatorOrderPrintComponent,
    HingeMeasurementComponent,
    ContractTemplatesComponent,
    MarloModalComponent,
    ProtezNkInfoComponent,
  ],
  exports: [
    PatientVisitsComponent,
    OrderManufacturingComponent,
    OrderModelComponent,
  ],
  entryComponents: [
    VisitPhotoPreviewComponent,
    VisitVideoPreviewComponent,
    CreateVisitComponent,
    CorsetOrderDetailComponent,
    CorsetOrderPrintComponent,
    ProtezVkOrderDetailComponent,
    ProtezNkOrderDetailComponent,
    CorsetOrderShortComponent,
    ProtezVkOrderShortComponent,
    ProtezNkOrderShortComponent,
    SwoshOrderShortComponent,
    SwoshOrderDetailComponent,
    SwoshOrderPrintComponent,
    OrderPrintComponent,
    VisitPhotoCompareComponent,
    CreateMtkComponent,
    CreateMtkTemplateComponent,
    CorsetCorrectionOrderDetailComponent,
    ApparatusOrderShortComponent,
    ApparatusOrderDetailComponent,
    ApparatusProductionMethodComponent,
    VerticalizatorOrderShortComponent,
    VerticalizatorOrderDetailComponent,
    VerticalizatorOrderPrintComponent,
    ApparatusOrderPrintComponent,
    ProtezNkOrderPrintComponent,
    MarloModalComponent,
  ],
  providers: [
    CorsetOrderService,
    ProductOrderService,
    ProductionMethodService,
    MedicalServicesService,
    PatientService,
    ProductTypesByMedicalService,
  ],
})
export class PatientVisitsModule {
}
