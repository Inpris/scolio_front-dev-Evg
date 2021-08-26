import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts.component';
import { ContactsTableComponent } from './contacts-table/contacts-table.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { InfinityScrollModule } from '@common/modules/infinity-scroll/infinity-scroll.module';
import { ContactResolverService } from '@modules/contacts/helpers/contact-resolver.service';
import { SharedModule } from '@common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    InfinityScrollModule,
  ],
  declarations: [
    ContactsComponent,
    ContactsTableComponent,
  ],
  providers: [
    ContactResolverService,
  ],
  exports: [
    ContactsTableComponent,
  ],
})
export class ContactsModule {
}
