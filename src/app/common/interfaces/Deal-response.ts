import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { Entity } from '@common/interfaces/Entity';

export interface DealResponse {
  id: string;
  dealStatus: EntityWithSysName;
  dateTime: string;
  medicalService: Entity;
  contractId?: string;
  purchaseId: string;
}
