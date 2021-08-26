import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PipesModule } from '@common/pipes/pipes.module';
import { XrayPhotoComponent } from '@modules/xray/xray-photo/xray-photo.component';
import { XrayPhotoRoutingModule } from '@modules/xray/xray-photo/xray-routing.module';
import { XrayPhotoEditComponent } from '@modules/xray/xray-photo/xray-photo-edit/xray-photo-edit.component';
import { XrayLineEditComponent } from '@modules/xray/xray-photo/xray-line-edit/xray-line-edit.component';
import { ArcListComponent } from './xray-line-edit/arc-list/arc-list.component';
import { XrayArcCanvasComponent } from './xray-line-edit/xray-arc-canvas/xray-arc-canvas.component';
import { XrayPhotoResolverService } from '@modules/xray/xray-photo/helpers/xray-photo-resolver.service';
import { CanDeactivateGuard } from '@modules/patients/patient/guards/can-deactivate-guard.service';
import { FormControlsModule } from '@common/modules/form-controls';
import { SharedModule } from '@common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    SharedModule,
    FormControlsModule,
    XrayPhotoRoutingModule,
    PipesModule,
  ],
  exports: [
    XrayPhotoComponent,
  ],
  declarations: [
    XrayPhotoComponent,
    XrayPhotoEditComponent,
    XrayLineEditComponent,
    ArcListComponent,
    XrayArcCanvasComponent,
  ],
  providers: [
    XrayPhotoResolverService,
    CanDeactivateGuard,
  ],
})
export class XrayPhotoModule {
}
