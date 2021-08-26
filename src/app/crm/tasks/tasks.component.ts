import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskDataService } from '@common/helpers/task-data';
import { TaskData } from '@common/interfaces/Task-data';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { LocalStorage } from '@common/services/storage';
@Component({
  selector: 'sl-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.less'],
})
export class TasksComponent implements OnInit {
  @ViewChild('formTaskModalContent')
  private formTaskModalContent: any;

  taskModalType: string;
  modalTaskForm: NzModalRef;
  // dataForCreateTask: any = {
  //   leadId: null,
  //   assignedUserId: null,
  // };
  taskData: TaskData;
  statusNum: number;
  selectedUserId: string;

  constructor(
    private taskDataService: TaskDataService,
    private modalService: NzModalService,
    private localStorage: LocalStorage,
  ) { }

  ngOnInit() {
    const userId = this.localStorage.getTemplJsonItem('CRM_TASKS_FILTER_DATA');
    if (userId) { this.selectedUserId = userId.assignedUserId; }
    this.taskData = this.taskDataService.data;
  }

  // task form
  openModalTaskForm() {
    this.taskModalType = 'create';
    this.openFormTask();
  }

  private openFormTask() {
    this.modalTaskForm = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: this.formTaskModalContent,
      nzFooter: null,
      nzWidth: '600px',
    });
  }

  closeModalTaskForm(data) {
    this.modalTaskForm.close();
  }
  // end task form

  filterChanged(selectedUserId) {
    this.localStorage.setTempJsonItem('CRM_TASKS_FILTER_DATA', { assignedUserId: selectedUserId });
    if (selectedUserId === null) {
      this.taskDataService.getAllTasks();
    } else {
      this.taskDataService.getAllTasks({ assignedUserId: selectedUserId });
    }
  }
}
