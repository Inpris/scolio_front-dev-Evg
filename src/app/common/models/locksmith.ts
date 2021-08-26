import { LocksmithResponse } from '@common/interfaces/Locksmith-response';
import { Service } from '@common/models/service';
import { VisitReason } from '@common/models/visit-reason';
import { LocksmithOperation } from '@common/models/locksmith-operation';
import { Room } from '@common/models/room';

export class Locksmith {
  id: number;
  visitId: string;
  productId: string;
  visitDate: string;
  productType: Service;
  visitReason: VisitReason;
  patientId: number;
  fullName: string;
  note: string;
  room: Room;
  operations?: LocksmithOperation[];
  isLoading?: boolean;
  lockSmithExecutions: LocksmithOperation[];

  constructor(data: LocksmithResponse, index: number) {
    this.id = index;
    this.visitId = data.visitId;
    this.productId = data.productId;
    this.visitDate = data.dateVisit;
    this.productType = data.productType;
    this.visitReason = data.visitReason;
    this.patientId = data.patientId;
    this.fullName = data.patientFio;
    this.note = data.notes;
    this.room = data.room;
    this.lockSmithExecutions = data.lockSmithExecutions;
  }
}
