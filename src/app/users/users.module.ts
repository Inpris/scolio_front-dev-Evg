import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from './user-form/user-form.component';
import { UserChangePassComponent } from './user-change-pass/user-change-pass.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersRoutingModule } from '@modules/users/users-routing.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SharedModule } from '@common/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableFilterModule } from '@common/modules/table-filter/table-filter.module';
import { InfinityScrollModule } from '@common/modules/infinity-scroll/infinity-scroll.module';
import { FormControlsModule } from '@common/modules/form-controls';
import { IfHasAccessModule } from '@common/modules/if-has-access/if-has-access.module';
import { UserPasswordCriteriaComponent } from './user-password-criteria/user-password-criteria.component';
import { UserRolesDescriptionComponent } from '@modules/users/user-roles-description/user-roles-description.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TableFilterModule,
    InfinityScrollModule,
    FormControlsModule,
    IfHasAccessModule,
  ],
  declarations: [
    UserFormComponent,
    UserChangePassComponent,
    UsersListComponent,
    UserPasswordCriteriaComponent,
    UserRolesDescriptionComponent,
  ],
  entryComponents: [
    UserFormComponent,
    UserChangePassComponent,
  ],
})
export class UsersModule {
}
