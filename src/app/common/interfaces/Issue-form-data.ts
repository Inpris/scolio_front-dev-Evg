import { Entity } from '@common/interfaces/Entity';
import { CorsetStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/corset-status.enum';

export interface IssueFormData {
  issuer1: Entity;
  issuer2: Entity;
  corsetStatus: CorsetStatus;
}
