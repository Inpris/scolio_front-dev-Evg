import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DictionaryComponent } from './dictionary.component';
import { DictionaryRoutingModule } from './dictionary-routing.module';
import { SharedModule } from '@common/shared.module';
import { UsersModule } from '@modules/users/users.module';
import { BranchesComponent } from '@modules/dictionary/branches/branches.component';
import { RoomComponent } from '@modules/dictionary/room/room.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DictionaryRoutingModule,
    NgZorroAntdModule,
    SharedModule,
    UsersModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DictionaryComponent,
    BranchesComponent,
    RoomComponent,
  ],
  entryComponents: [
    RoomComponent,
  ],
})
export class DictionaryModule {}
