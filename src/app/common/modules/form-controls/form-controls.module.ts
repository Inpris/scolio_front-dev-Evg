import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AcceptTermsComponent } from './accept-terms/accept-terms.component';
import { GiasAddressComponent } from '@common/modules/form-controls/gias-address/gias-address.component';
import { GiasRegionComponent } from './gias-address/gias-region/gias-region.component';
import { GiasCityComponent } from './gias-address/gias-city/gias-city.component';
import { ControlSelectionComponent } from './control-selection/control-selection.component';
import { SharedModule } from '@common/shared.module';
import { SelectComponent } from './select/select.component';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AcceptTermsComponent,
    GiasAddressComponent,
    GiasRegionComponent,
    GiasCityComponent,
    ControlSelectionComponent,
    SelectComponent,
  ],
  exports: [
    AcceptTermsComponent,
    GiasAddressComponent,
    GiasRegionComponent,
    GiasCityComponent,
    ControlSelectionComponent,
    SelectComponent,
  ],
})
export class FormControlsModule {
}
