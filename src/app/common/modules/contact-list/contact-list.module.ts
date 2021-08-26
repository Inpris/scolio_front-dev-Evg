import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactListComponent } from '@common/modules/contact-list/contact-list.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
// TODO: move to contacts module
@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
  ],
  declarations: [
    ContactListComponent,
  ],
  exports: [
    ContactListComponent,
  ],
})
export class ContactListModule {
}
