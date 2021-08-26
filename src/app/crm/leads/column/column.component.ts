import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LeadItem } from '@common/interfaces/Lead-item';
import { LeadData } from '@common/interfaces/Lead-data';
import { LeadDataService } from '@common/helpers/lead-data';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { PageParams } from '@common/interfaces/Page-params';
import { Status } from '@common/interfaces/Status';

@Component({
  selector: 'sl-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.less'],
})
export class ColumnComponent implements OnInit {
  @Input() statusNum: number;

  @ViewChild('formLeadModalContent')
  private formLeadModalContent: any;

  private leadData: LeadData;
  statusName: string;
  dataForLeadForm: any;
  statusSysName: string;
  colArr: LeadItem;
  pageParams: PageParams;
  modal: NzModalRef;
  status: Status;
  loadingLeads: boolean;

  constructor(
    private leadDataService: LeadDataService,
    private modalService: NzModalService,
  ) {
    this.leadData = this.leadDataService.data;
  }

  ngOnInit() {
    this.status = this.leadData.statusesList[this.statusNum];
    this.statusSysName = this.status.sysName;
    this.statusName = this.status.name;
    this.dataForLeadForm = { leadStatusId: this.status.id };
    this.colArr = this.leadData[this.statusSysName].items;
    this.pageParams = this.leadData[this.statusSysName].pageParams;
  }

  clickCreateLeadBtn(status) {
    this.openModalLeadForm();
  }

  private openModalLeadForm () {
    this.modal = this.modalService.create({
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzContent: this.formLeadModalContent,
      nzFooter: null,
      nzWidth: '600px',
    });
  }

  closeModal(flag) {
    this.modal.close();
  }

  onScroll(e) {
    if (+e.target.scrollTop + +e.target.clientHeight === e.target.scrollHeight && !this.loadingLeads) {
      if (this.pageParams.page === this.pageParams.pageCount) {
        return;
      }
      this.pageParams.page = this.pageParams.page + 1;
      this.loadingLeads = true;
      const obs = this.leadDataService.getLeads(this.status, this.pageParams);
      obs.subscribe(() => this.loadingLeads = false);
    }
  }
}
