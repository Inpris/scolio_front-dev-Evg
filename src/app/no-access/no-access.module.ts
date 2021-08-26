import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlsModule } from '@common/modules/form-controls';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PipesModule } from '@common/pipes/pipes.module';
import { CanDeactivateGuard } from '@modules/patients/patient/guards/can-deactivate-guard.service';
import { NoAccessComponent } from '@modules/no-access/no-access.component';
import { NoAccessRoutingModule } from '@modules/no-access/no-access-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NoAccessRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    FormControlsModule,
    PipesModule,
  ],
  declarations: [
    NoAccessComponent,
  ],
  providers: [
    CanDeactivateGuard,
  ],
  entryComponents: [NoAccessComponent],
  exports: [],
})
export class NoAccessModule {
}
