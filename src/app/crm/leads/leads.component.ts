import { Component, OnInit } from '@angular/core';
import { LeadDataService } from '@common/helpers/lead-data';
import { LeadData } from '@common/interfaces/Lead-data';
import { LeadService } from '@common/services/lead.service';
import { LocalStorage } from '@common/services/storage';

@Component({
  selector: 'sl-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.less'],
})

export class LeadsComponent implements OnInit {
  leadData: LeadData;
  selectedUserId: string;

  constructor(
    private leadDataService: LeadDataService,
    private leadService: LeadService,
    private localStorage: LocalStorage,
  ) {
    this.leadData = this.leadDataService.data;
  }

  ngOnInit() {
    const userId = this.localStorage.getTemplJsonItem('CRM_LEADS_FILTER_DATA');
    if (userId) { this.selectedUserId = userId.assignedUserId; }
    this.leadService.leadChanged.subscribe((lead) => {
      this.localUpdateLead(lead);
    }, (err) => {
      console.log(err);
    });
  }

  private localUpdateLead(newLead) {
    this.leadDataService.data.statusesList.map((statusObj) => {
      const statusName = statusObj.sysName;
      this.leadDataService.data[statusName].items.map((lead, i) => {
        if (lead.id === newLead.id) {
          this.leadDataService.data[statusName].items.splice(i, 1);
          this.leadDataService.data[newLead.leadStatus.sysName].items.unshift(newLead);
        }
      });
    });
  }

  filterChanged(selectedUserId) {
    this.localStorage.setTempJsonItem('CRM_LEADS_FILTER_DATA', { assignedUserId: selectedUserId });
    if (selectedUserId === null) {
      this.leadDataService.getAllLeads();
    } else {
      this.leadDataService.getAllLeads({ assignedUserId: selectedUserId });
    }
  }

}
