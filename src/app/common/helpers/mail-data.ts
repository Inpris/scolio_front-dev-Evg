import { Injectable } from '@angular/core';
import { MailData } from '../interfaces/Mail-data';
import { MailService } from '../services/mail.service';
import { MailResponse } from '../interfaces/Mail-response';
import { Mail } from '../models/mail';
import { SignalR } from '@common/services/signalR';

const EMAIL_CREATED = 'email.created';
const EMAIL_CHANGED = 'email.changed';

@Injectable()
export class MailDataService {
  public data: MailData = {
    items: [],
    lastUpdate: null,
    pageParams: {
      page: 1,
      pageSize: 15,
      pageCount: null,
      totalCount: null,
    },
    filter: {
      isDeleted: false,
      emailStatus: 'Unanswered',
    },
  };

  readonly emailCreated = this.signalR.on(EMAIL_CREATED)
    .map((data: MailResponse) => new Mail(data));

  readonly emailChanged = this.signalR.on(EMAIL_CHANGED)
    .map((data: MailResponse) => new Mail(data));

  constructor(
    private mailService: MailService,
    private signalR: SignalR,
  ) {
    this.emailCreated.subscribe((email) => {
      this.addToMailList(email);
    });

    this.emailChanged.subscribe((email) => {
      this.removeFromMailList(email);
    });

    const mailParams = {
      inbox: true,
      isAnswered: false,
    };
    this.getMails(mailParams);
  }

  private addToMailList(email: Mail) {
    if (this.isEmailForCurrentFilter(email)) {
      this.data.items.unshift(email);
      this.data.pageParams.totalCount += 1;
    }
  }

  private removeFromMailList(removedEmail: Mail) {
    if (!this.isEmailForCurrentFilter(removedEmail)) {
      this.data.items = this.data.items.filter(email => email.id !== removedEmail.id);
      this.data.pageParams.totalCount -= 1;
    }
  }

  private isEmailForCurrentFilter(email: Mail) {
    const { emailStatus, isDeleted } = this.data.filter;
    return email.emailStatus === emailStatus && email.isDeleted === isDeleted;
  }

  public getMails(data) {
    const params = {
      id: data.mailId ? data.mailId : null,
      inbox: data.inbox ? data.inbox : null,
      outBox: data.outbox ? data.outbox : null,
      isAnswered: data.isAnswered != null ? data.isAnswered : null,
      isDeleted: data.isDeleted != null ? data.isDeleted : null,
    };
    const paginationParams = this.data.pageParams;
    const obs = this.mailService.get(params, paginationParams);
    obs.subscribe((response) => {
      this.addedMailsInArr(response);
    }, (err) => {
      console.log(err);
    });
    return obs;
  }

  public addedMailsInArr(response) {
    const data = response.data;
    this.data.lastUpdate = new Date();
    this.data.pageParams.page = response.page;
    this.data.pageParams.pageSize = response.pageSize;
    this.data.pageParams.pageCount = response.pageCount;
    this.data.pageParams.totalCount = response.totalCount;
    this.data.items = data;
  }
}
