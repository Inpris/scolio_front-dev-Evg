import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchAccessesComponent } from './branch-accesses.component';
import { NgZorroAntdModule } from "ng-zorro-antd";
import { TableFilterModule } from "@common/modules/table-filter/table-filter.module";
import { ContactsModule } from "@modules/contacts/contacts.module";
import { FormsModule } from "@angular/forms";
import { InfinityScrollModule } from "@common/modules/infinity-scroll/infinity-scroll.module";
import { RouterModule } from "@angular/router";
import {AccessesService} from "@common/services/accesses-service.service";

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    TableFilterModule,
    ContactsModule,
    FormsModule,
    InfinityScrollModule,
    RouterModule,
  ],
  exports: [
    BranchAccessesComponent
  ],
  providers: [
    AccessesService,
  ],
  declarations: [BranchAccessesComponent],
})
export class BranchAccessesModule { }
