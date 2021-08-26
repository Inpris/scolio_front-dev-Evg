import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { LeadItem } from '@common/interfaces/Lead-item';
import { LeadService } from '@common/services/lead.service';
import { LeadDataService } from '@common/helpers/lead-data';

@Component({
  selector: 'sl-detail-lead',
  templateUrl: './detail-lead.component.html',
  styleUrls: ['./detail-lead.component.less'],
})
export class DetailLeadComponent implements OnInit {
  private routeSubscription: Subscription;
  private id: string;
  leadData: LeadItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leadService: LeadService,
    private leadDataService: LeadDataService,
  ) {
    this.routeSubscription = activatedRoute.params.subscribe(params => this.id = params['id']);
  }

  ngOnInit() {
    this.getLeadData();
  }

  getLeadData() {
    this.leadService.getLeadById(this.id)
      .subscribe((lead) => {
        this.leadData = lead;
      });
  }
  callbackFromForm(status) {
    this.back();
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }

  onEventUpdate({ newValue, prevValue, eventType }) {
    if (eventType === 'task') {
      let type = null;
      if (prevValue.status === 'done' && newValue.taskStatus.sysName !== 'Done') {
        type = 'add';
      } else if (prevValue.status !== 'done' && newValue.taskStatus.sysName === 'Done') {
        type = 'remove';
      }
      this.leadDataService.localUpdateLeadTask(newValue, type);
    }
  }

}
