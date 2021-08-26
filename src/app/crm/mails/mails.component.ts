import { Component, OnInit } from '@angular/core';
import { MailDataService } from '@common/helpers/mail-data';
import { MailItem } from '@common/interfaces/Mail-item';
import { MailData } from '@common/interfaces/Mail-data';
import { PageParams } from '@common/interfaces/Page-params';
import { NzModalService } from 'ng-zorro-antd';
import { Mail } from '@common/models/mail';

@Component({
  selector: 'sl-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.less'],
})
export class MailsComponent implements OnInit {
  mailData: MailData;
  // mails: MailItem[];
  pageParams: PageParams;
  lastUpdate: Date;
  mailForDetail: MailItem;
  showDetailMail: boolean;

  _allChecked = false;
  _indeterminate = false;
  mailParams = {
    inbox: true,
    isAnswered: false,
  };

  modalMail: any;

  selectedFilter = 'unanswered';
  filters = {
    unanswered: {
      applay: true,
      name: 'Неотвеченные',
      mailParams: {
        inbox: true,
        isAnswered: false,
      },
    },
    inbox: {
      name: 'Входящие',
      applay: false,
      mailParams: {
        inbox: true,
      },
    },
    outbox: {
      name: 'Исходящие',
      applay: false,
      mailParams: {
        outbox: true,
      },
    },
    isDeleted: {
      name: 'Удаленные',
      applay: false,
      mailParams: {
        isDeleted: true,
      },
    },
  };

  loading = true;

  constructor(
    private mailDataService: MailDataService,
    private modalService: NzModalService,
  ) {
    this.mailData = this.mailDataService.data;
    this.pageParams = this.mailData.pageParams;
  }

  ngOnInit() {
    this.mailDataService.emailCreated.subscribe((email) => {
      this.addToMailList(email);
    });

    this.mailDataService.emailChanged.subscribe((email) => {
      this.removeFromMailList(email);
    });
  }

  appyFilter(filter) {
    this.clearFilter();
    this.filters[filter].applay = true;
    this.selectedFilter = filter;
    this.getMails();
  }
  private clearFilter() {
    Object.keys(this.filters).forEach((item) => {
      this.filters[item].applay = false;
    });
  }

  private addToMailList(email: Mail) {
    if (this.isEmailForCurrentFilter(email)) {
      this.mailData.items.unshift(email);
      this.pageParams.totalCount += 1;
    }
  }

  private removeFromMailList(removedEmail: Mail) {
    if (!this.isEmailForCurrentFilter(removedEmail)) {
      this.mailData.items = this.mailData.items.filter(email => email.id !== removedEmail.id);
      this.pageParams.totalCount -= 1;
    }
  }

  private isEmailForCurrentFilter(email: Mail) {
    const { emailStatus, isDeleted } = this.mailData.filter;
    return email.emailStatus === emailStatus && email.isDeleted === isDeleted;
  }

  updateMailList() {
    this.pageParams.page = 1;
    this.getMails();
  }

  getMails() {
    this.loading = true;
    this.mailDataService.getMails(this.filters[this.selectedFilter].mailParams);
  }
  indexChange() {
    this.getMails();
  }
  currentPageDataChange() {
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }


  // checkbox
  checkboxRefreshStatus() {
    const allChecked = this.mailData.items.every(value => value.checked);
    const allUnChecked = this.mailData.items.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkAllMails(value) {
    if (value) {
      this.mailData.items.forEach((data) => {
        data.checked = true;
      });
    } else {
      this.mailData.items.forEach((data) => {
        data.checked = false;
      });
    }
    this.checkboxRefreshStatus();
  }
  // end checkbox

  // open detail mail
  showMail(data) {
    this.showDetailMail = true;
    this.mailForDetail = data;
  }

  returnToAllMails() {
    this.showDetailMail = false;
  }
  // end open detail mail
}
