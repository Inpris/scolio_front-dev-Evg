import { Entity } from '@common/interfaces/Entity';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';

export interface CorsetShortFormData {
  branch: Entity;
  color: string;
  corsetType: Entity;
  dateOfIssue: string;
  dateOfIssueTurner: string;
  dateSendingToBranch: string;
  name: string;
  id: string;
  plasticType: Entity;
}
