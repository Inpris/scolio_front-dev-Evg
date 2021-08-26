import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from '@common/utils/form';
import { TaskService } from '@common/services/task.service';
import { TaskCreate } from '@common/interfaces/Task-create';
import { UsersService } from '@common/services/users';
import { AuthService } from '@common/services/auth';
import { User } from '@common/models/user';
import { TaskDataService } from '@common/helpers/task-data';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpErrorResponse } from '@angular/common/http';
import { DateUtils } from '@common/utils/date';

@Component({
  selector: 'sl-task-create-form',
  templateUrl: './task-create-form.component.html',
  styleUrls: ['./task-create-form.component.less'],
})
export class TaskCreateFormComponent implements OnInit {
  @Input() data: any; // описать данные
  @Input() formType: string; // edit or create
  @Output() closeModal = new EventEmitter<any>();

  form: FormGroup;
  users: User[] = [];

  taskFormLoading = false;
  private tempDataForCreateUpdat = {
    taskStatusId: null,
    priority: null,
    entityType: null,
    entityId: null,
    eventStatusId: null,
  };

  taskStatusValue = 'New';

  constructor(
    private taskService: TaskService,
    private taskDataService: TaskDataService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    private message: NzMessageService,
  ) {
    this.form = this.formBuilder.group({
      subject: ['Новая задача', Validators.required],
      description: [null, Validators.required],
      dueDateTime: [null, Validators.required],
      assignedUserId: [null],
    });
  }

  ngOnInit() {
    const pageParam = {
      page: 1,
      pageSize: 500,
    };
    this.usersService.getList(pageParam).subscribe((users) => {
      this.users = users.data;
    });
    if (this.formType === 'create') {
      this.form.patchValue({
        assignedUserId: this.authService.user.id,
      });
    } else if (this.formType === 'edit') {
      this.fillForm();
    }
  }

  private fillForm() {
    this.taskStatusValue = this.data.taskStatus.sysName;
    this.tempDataForCreateUpdat.taskStatusId = this.data.taskStatus.id;
    this.tempDataForCreateUpdat.priority = this.data.priority;
    this.tempDataForCreateUpdat.entityType = this.data.entityType;
    this.tempDataForCreateUpdat.entityId = this.data.entity.id;
    this.tempDataForCreateUpdat.eventStatusId = this.data.eventStatusId;
    this.form.patchValue({
      subject: this.data.subject,
      description: this.data.description,
      dueDateTime: this.data.dueDateTime,
      assignedUserId: this.data.assignedUser.id,
    });
  }

  closeForm(task?) {
    const result = { data: task, type: this.formType };
    this.closeModal.emit(result);
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) {
      FormUtils.markAsDirty(form);
      return;
    }
    this.taskFormLoading = true;

    (this.formType === 'create' ? this.createTask() : this.editTask())
      .finally(() => { this.taskFormLoading = false; })
      .subscribe(
      (data) => { this.closeForm(data); },
      (response) => { this.onError(response); },
    );
  }

  private createTask() {
    this.createTempData();
    const taskModel: TaskCreate = this.getTaskModel();
    return this.taskService.create(taskModel);
  }

  private editTask() {
    const taskModel: TaskCreate = this.getTaskModel();
    return this.taskService.update(this.data.taskId, taskModel);
  }

  private createTempData() {
    this.tempDataForCreateUpdat.taskStatusId = this.taskDataService.getStatusById('New');
    this.tempDataForCreateUpdat.priority = 'first';  // для создание таски для лида
    this.tempDataForCreateUpdat.entityType = this.data.entityType; // для создание таски для лида
    this.tempDataForCreateUpdat.entityId = this.data.entityId; // leadId
    this.tempDataForCreateUpdat.eventStatusId = this.taskDataService.getEventStatusById('New'); // "новый" для создания таски
  }

  private getTaskModel(): TaskCreate {
    const {
      subject,
      description,
      dueDateTime,
      assignedUserId,
    } = this.form.value;
    return {
      subject,
      description,
      assignedUserId,
      dueDateTime: DateUtils.toISODateTimeString(dueDateTime),
      taskStatusId: this.taskDataService.getStatusById(this.taskStatusValue),
      priority: this.tempDataForCreateUpdat.priority,
      entityType: this.tempDataForCreateUpdat.entityType,
      entityId: this.tempDataForCreateUpdat.entityId,
      eventStatusId: this.tempDataForCreateUpdat.eventStatusId,
    };
  }

  public disabledDate(current: Date): boolean {
    const now = new Date();
    const date = now.setDate(now.getDate() - 1);
    return current && current.getTime() < date;
  }

  private onError(response: HttpErrorResponse) {
    const { errors } = response.error;
    if (errors != null && errors.length > 0) {
      this.message.error(errors[0], { nzDuration: 3000 });
    }
  }
}

