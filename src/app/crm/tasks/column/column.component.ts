import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Status } from '@common/interfaces/Status';


import { TaskItem } from '@common/interfaces/Task-item';
import { TaskData } from '@common/interfaces/Task-data';
import { TaskDataService } from '@common/helpers/task-data';
import { TaskService } from '@common/services/task.service';
import { PageParams } from '@common/interfaces/Page-params';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { LeadDataService } from '@common/helpers/lead-data';
@Component({
  selector: 'sl-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.less'],
})
export class ColumnComponent implements OnInit, OnDestroy {
  @Input() statusNum: number;

  private taskData: TaskData;
  status: Status;
  statusSysName: string;
  statusName: string;
  colArr: TaskItem[];
  pageParams: PageParams;
  loadingLeads: boolean;
  dragulaSub: any;

  constructor(
    private taskDataService: TaskDataService,
    private taskService: TaskService,
    private leadDataService: LeadDataService,
    private dragula: DragulaService,
  ) {
    this.taskData = this.taskDataService.data;
  }

  ngOnInit() {
    this.status = this.taskData.statusesList[this.statusNum];
    this.statusSysName = this.status.sysName;
    this.statusName = this.status.name;
    this.colArr = this.taskData[this.statusSysName].items;
    this.pageParams = this.taskData[this.statusSysName].pageParams;
    this.onDropSuccess();
  }

  ngOnDestroy() {
    this.dragulaSub.unsubscribe();
  }

  onScroll(e) {
    if (+e.target.scrollTop + +e.target.clientHeight === e.target.scrollHeight && !this.loadingLeads) {
      if (this.pageParams.page === this.pageParams.pageCount) {
        return;
      }
      this.pageParams.page = this.pageParams.page + 1;
      this.loadingLeads = true;
      const obs = this.taskDataService.getTasks(this.status, this.pageParams);
      obs.subscribe(() => this.loadingLeads = false);
    }
  }

  private onDropSuccess() {
    this.dragulaSub = this.dragula
    .drop
    .subscribe((value) => {
      const from = value[3].getAttribute('statusSysName');
      const to = value[2].getAttribute('statusSysName');
      const id = value[1].getAttribute('id');
      let result;

      const index = value[4] && value[4].getAttribute('index') ? value[4].getAttribute('index') : 0;
      if (this.statusSysName === to) {
        this.taskDataService.data[this.statusSysName].items.forEach((task) => {
          if (task.taskId === id) {
            result = task;
          }
        });
        this.updateTask(result);
        const count = this.taskDataService.data[result.taskStatus.sysName].pageParams.totalCount;
        this.taskDataService.data[result.taskStatus.sysName].pageParams.totalCount = count - 1;
      }
    });
  }

  updateTask(task: TaskItem) {
    this.taskService.updateStatus(task.taskId, this.status.id)
      .subscribe((newTask: TaskItem) => {
        const count = this.taskDataService.data[newTask.taskStatus.sysName].pageParams.totalCount;
        this.taskDataService.data[newTask.taskStatus.sysName].pageParams.totalCount = count + 1;
        this.updateTackCountInLeadCard(task, newTask);
      });
  }

  updateTackCountInLeadCard(taskOld, taskNew) {
    let type = null;
    if (taskOld.taskStatus.sysName === 'Done' && taskNew.taskStatus.sysName !== 'Done') {
      type = 'add';
    } else if (taskOld.taskStatus.sysName !== 'Done' && taskNew.taskStatus.sysName === 'Done') {
      type = 'remove';
    }
    this.leadDataService.localUpdateLeadTask(taskNew, type);
  }
}
