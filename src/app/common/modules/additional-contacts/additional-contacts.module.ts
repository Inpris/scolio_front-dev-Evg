import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdditionalContactsComponent } from './additional-contacts.component';
import { ByCommunicationTypePipe } from '@common/pipes/by-communication-type.pipe';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,

    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AdditionalContactsComponent,
    ByCommunicationTypePipe,
  ],
  exports: [
    AdditionalContactsComponent,
    ByCommunicationTypePipe,
  ],
  providers: [],
})
export class AdditionalContactsModule {
}
