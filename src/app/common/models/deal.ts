import { DealResponse } from '@common/interfaces/Deal-response';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { Entity } from '@common/interfaces/Entity';
import { DateUtils } from '@common/utils/date';

export class Deal {
  id: string;
  dealStatus: EntityWithSysName;
  dateTime: string;
  medicalService: Entity;
  purchaseId: string;
  contractId: string;
  get dealDisplayText() {
    return `${DateUtils.toISODateString(this.dateTime)}, ${this.medicalService.name}`;
  }

  constructor(data: DealResponse) {
    this.id = data.id;
    this.dealStatus = data.dealStatus;
    this.dateTime = data.dateTime;
    this.medicalService = data.medicalService;
    this.purchaseId = data.purchaseId;
    this.contractId = data.contractId;
  }
}
