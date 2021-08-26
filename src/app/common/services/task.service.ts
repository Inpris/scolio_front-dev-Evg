import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskCreate } from '@common/interfaces/Task-create';
import { TaskResponse } from '@common/interfaces/Task-response';
import { Task } from '@common/models/task';
import { SignalR } from '@common/services/signalR';
import { PaginableService, PaginationChunk, PaginationParams } from '@common/services/paginable';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

const TASK_CREATED = 'task.created';
const TASK_CHANGED = 'task.changed';

@Injectable()
export class TaskService extends PaginableService {
  readonly taskCreated = this.signalR.on(TASK_CREATED)
    .map((data: TaskResponse) => new Task(data));

  readonly taskChanged = this.signalR.on(TASK_CHANGED)
    .map((data: TaskResponse) => new Task(data));

  constructor(
    protected http: HttpClient,
    private signalR: SignalR,
  ) {
    super(http);
  }

  getStatuses() {
    return this.http.get<any[]>(`/api/v1/task-statuses`);
  }
  getEventStatuses() {
    return this.http.get<any[]>(`/api/v1/event-statuses`);
  }

  create(data: TaskCreate) {
    return this.http.post<TaskResponse>('/api/v1/tasks', data)
      .do((response) => { this.signalR.call(TASK_CREATED, response); })
      .map(response => new Task(response));
  }

  getList(paramsObj, paginationParams: PaginationParams = {}) {
    const params = {};
    if (paramsObj && paramsObj.statusId) { params['taskStatusId'] = paramsObj.statusId; }
    if (paramsObj && paramsObj.assignedUserId) { params['AssignedUserIds'] = [paramsObj.assignedUserId]; }
    if (paramsObj && paramsObj.entityType) { params['EntityType'] = [paramsObj.entityType]; }

    return this.paginationRequest<TaskResponse>(`/api/v1/tasks`, paginationParams, params)
      .map(({ data, page, pageSize, pageCount, totalCount }) => {
        return {
          page,
          pageSize,
          pageCount,
          totalCount,
          data: data.map(task => new Task(task)),
        } as PaginationChunk<Task>;
      });
  }

  update(taskId: string, data: TaskCreate) {
    return this.http.put<TaskResponse>(`/api/v1/tasks/${taskId}`, data)
      .do((response) => { this.signalR.call(TASK_CHANGED, response); })
      .map(response => new Task(response));
  }

  updateStatus(taskId: string, statusId: string) {
    const data = {
      taskStatusId: statusId,
    };
    return this.http.put<TaskResponse>(`/api/v1/tasks/change-status/${taskId}`, data)
      .do((response) => { this.signalR.call(TASK_CHANGED, response); })
      .map(response => new Task(response));
  }

  get(taskId: string, entityType?: string) {
    return this.http.get<TaskResponse>(`/api/v1/tasks/${taskId}`, { params: { entityType } })
      .map(response => new Task(response));
  }
}
