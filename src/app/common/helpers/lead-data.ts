import { Injectable } from '@angular/core';
import { LeadData } from '@common/interfaces/Lead-data';
import { LeadService } from '../services/lead.service';
import { TaskService } from '@common/services/task.service';

@Injectable()
export class LeadDataService {
  data: LeadData = {
    NotProcessed: {
      items: [],
      pageParams: {
        page: 1,
        pageSize: 10,
        pageCount: null,
        totalCount: null,
      },
    },
    Processing: {
      items: [],
      pageParams: {
        page: 1,
        pageSize: 10,
        pageCount: null,
        totalCount: null,
      },
    },
    BecamePatient: {
      items: [],
      pageParams: {
        page: 1,
        pageSize: 10,
        pageCount: null,
        totalCount: null,
      },
    },
    statusesList: [],
  };

  constructor(
    private leadService: LeadService,
    private taskService: TaskService,
  ) {
    this.getStatuses();
    this.leadService.leadCreated.subscribe((lead) => {
      this.data.NotProcessed.items.unshift(lead);
      this.data.NotProcessed.pageParams.totalCount = this.data.NotProcessed.pageParams.totalCount + 1;
    }, (err) => {
      console.log(err);
    });
    this.taskService.taskCreated.subscribe((task) => {
      this.localUpdateLeadTask(task, 'add');
    }, (err) => {
      console.log(err);
    });
  }

  private clearDataItems() {
    this.data.NotProcessed.items.length = 0;
    this.data.Processing.items.length = 0;
    this.data.BecamePatient.items.length = 0;
  }

  getAllLeads(paramsObj?) {
    this.clearDataItems();
    this.data.statusesList.forEach((status) => {
      this.getLeads(status, paramsObj);
    });
  }

  getLeads(status, paramsObj?) {
    const params = {
      statusId: status.id,
      assignedUserId: paramsObj && paramsObj.assignedUserId ? paramsObj.assignedUserId : null,
    };
    const paginationParams = this.data[status.sysName].pageParams;
    const obs = this.leadService.getList(params, paginationParams);
    obs.subscribe((response) => {
      this.sortLeadsData(response, status.sysName);
    }, (err) => {
      console.log(err);
    });
    return obs;
  }

  private getStatuses() {
    this.leadService.getStatuses()
      .subscribe((data) => {
        // ограничиваем 3мя статусами, чтобы выводилось 3 колонки
        data.length = 3;
        this.data.statusesList = data;
        this.getAllLeads();
      }, (err) => {
        console.log(err);
      });
  }

  public localUpdateLeadTask(task, type) {
    this.data.statusesList.map((statusObj) => {
      const statusName = statusObj.sysName;
      this.data[statusName].items.map((lead, i) => {
        if (lead.id === task.entity.id) {
          if (type === 'add') {
            lead.taskCount = lead.taskCount + 1;
          }
          if (type === 'remove') {
            lead.taskCount = lead.taskCount - 1;
          }
        }
      });
    });
  }

  private sortLeadsData(response, status) {
    const data = response.data;
    this.data[status].pageParams.page = response.page;
    this.data[status].pageParams.pageSize = response.pageSize;
    this.data[status].pageParams.pageCount = response.pageCount;
    this.data[status].pageParams.totalCount = response.totalCount;
    if (!data.length) {
      return;
    }
    data.forEach((lead) => {
      this.data[status].items.push(lead);
    });
  }
}
