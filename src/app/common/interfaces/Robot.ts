import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { Entity } from '@common/interfaces/Entity';

export interface Robot {
  id?: string;
  patientId?: number;
  patientFio?: string;
  visitDate?: string;
  dateOfIssue?: string;
  dateSendingToBranch?: string;
  branchName?: string;
  acceptedBy?: string;
  productType?: EntityWithSysName;
  generalStatus?: string;
  model3DExecutor1?: Entity;
  model3DExecutor2?: Entity;
  participationPercent1?: number;
  participationPercent2?: number;
  execution3DModelStart?: string;
  execution3DModelEnd?: string;
  is3DModelReady?: boolean;
  isControlled?: boolean;
  makingStage?: string;
}
