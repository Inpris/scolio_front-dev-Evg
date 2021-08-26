import { Injectable } from '@angular/core';
import { TaskService } from '@common/services/task.service';
import { TaskData } from '@common/interfaces/Task-data';
import { Observable } from 'rxjs/Observable';
import { EntityTypes } from '@common/models/entity-types';

@Injectable()
export class TaskDataService {
  data: TaskData = {
    New: {
      items: [],
      pageParams: {
        page: 1,
        pageSize: 10,
        pageCount: null,
        totalCount: null,
      },
    },
    Worked: {
      items: [],
      pageParams: {
        page: 1,
        pageSize: 10,
        pageCount: null,
        totalCount: null,
      },
    },
    Done: {
      items: [],
      pageParams: {
        page: 1,
        pageSize: 10,
        pageCount: null,
        totalCount: null,
      },
    },
    statusesList: [],
    eventStatusesList: [],
  };

  constructor(
    private taskService: TaskService,
  ) {
    // слушаем обновлеия от сигналР по задачам
    this.listenCreateTask();
    this.listenUpdateTask();

    Observable.forkJoin(
      this.taskService.getStatuses(),
      this.taskService.getEventStatuses(),
    )
      .map(([dataStatuses, dataEventStatuses]) => {
        this.data.statusesList = dataStatuses;
        this.data.eventStatusesList = dataEventStatuses;
      })
      .subscribe(() => {
        this.getAllTasks();
      });
  }

  private listenCreateTask() {
    this.taskService.taskCreated.subscribe((task) => {
      this.localCreateTask(task);
    }, (err) => {
      console.log(err);
    });
  }

  private listenUpdateTask() {
    this.taskService.taskChanged.subscribe((task) => {
      this.localUpdateTask(task);
    }, (err) => {
      console.log(err);
    });
  }

  private localCreateTask(task) {
    this.data.New.items.unshift(task);
    this.data.New.pageParams.totalCount = this.data.New.pageParams.totalCount + 1;
  }

  private localUpdateTask(newTask) {
    this.data.statusesList.map((statusObj) => {
      const statusName = statusObj.sysName;
      this.data[statusName].items.map((task, i) => {
        if (task.taskId === newTask.taskId) {
          this.data[statusName].items.splice(i, 1);
          this.data[statusName].pageParams.totalCount = this.data[statusName].pageParams.totalCount - 1;
          this.data[newTask.taskStatus.sysName].items.unshift(newTask);
          this.data[newTask.taskStatus.sysName].pageParams.totalCount = this.data[newTask.taskStatus.sysName].pageParams.totalCount + 1;
        }
      });
    });
  }

  getStatusById(statusName: string) {
    let result = '';
    this.data.statusesList.forEach((status) => {
      if (status.sysName === statusName) { result = status.id; }
    });
    return result;
  }

  getEventStatusById(statusName: string) {
    let result = '';
    this.data.eventStatusesList.forEach((status) => {
      if (status.sysName === statusName) { result = status.id; }
    });
    return result;
  }

  private clearDataItems() {
    this.data.New.items.length = 0;
    this.data.Worked.items.length = 0;
    this.data.Done.items.length = 0;
  }

  getAllTasks(paramsObj?) {
    this.clearDataItems();
    this.data.statusesList.forEach((status) => {
      this.getTasks(status, paramsObj);
    });
  }

  getTasks(status, paramsObj?) {
    const params = {
      statusId: status.id,
      assignedUserId: paramsObj && paramsObj.assignedUserId ? paramsObj.assignedUserId : null,
      entityType: EntityTypes.LEAD,
    };
    const paginationParams = this.data[status.sysName].pageParams;
    const obs = this.taskService.getList(params, paginationParams);
    obs.subscribe((response) => {
      this.sortData(response, status.sysName);
    }, (err) => {
      console.log(err);
    });
    return obs;
  }

  private sortData(response, status) {
    const data = response.data;
    this.data[status].pageParams.page = response.page;
    this.data[status].pageParams.pageSize = response.pageSize;
    this.data[status].pageParams.pageCount = response.pageCount;
    this.data[status].pageParams.totalCount = response.totalCount;
    if (!data.length) { return; }
    data.forEach((lead) => {
      this.data[status].items.push(lead);
    });
  }
}
