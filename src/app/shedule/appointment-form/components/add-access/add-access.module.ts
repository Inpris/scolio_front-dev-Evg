import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAccessComponent } from './add-access.component';
import {NgZorroAntdModule} from "ng-zorro-antd";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BranchesService} from "@common/services/dictionaries/branches.service";

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [AddAccessComponent],
  exports: [
    AddAccessComponent
  ],
  providers: [BranchesService]
})
export class AddAccessModule { }
