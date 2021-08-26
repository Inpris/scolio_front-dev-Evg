import { VisitReason } from '@common/models/visit-reason';
import { Service } from '@common/models/service';
import { Room } from '@common/models/room';
import { LocksmithOperation } from '@common/models/locksmith-operation';

export interface LocksmithResponse {
  visitId: string;
  productId: string;
  dateVisit: string;
  productType: Service;
  visitReason: VisitReason;
  patientId: number;
  patientFio: string;
  notes: string;
  room: Room;
  lockSmithExecutions: LocksmithOperation[];
}
