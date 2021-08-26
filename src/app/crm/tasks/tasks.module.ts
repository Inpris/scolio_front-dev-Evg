import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { TasksRoutingModule } from './tasks-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksComponent } from './tasks.component';
import { TaskCreateFormComponent } from './task-create-form/task-create-form.component';
import { UserFilterModule } from '@common/modules/user-filter/user-filter.module';
import { ColumnComponent } from './column/column.component';
import { CardComponent } from './card/card.component';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { SharedModule } from '@common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    SharedModule,
    TasksRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UserFilterModule,
    DragulaModule,
  ],
  exports: [TasksComponent, TaskCreateFormComponent],
  declarations: [
    TasksComponent,
    TaskCreateFormComponent,
    ColumnComponent,
    CardComponent,
  ],
})
export class TasksModule { }
