export interface RejectsResponse {
  id: string;
  rejectResult: {
    id: string;
    name: string;
    sort: number;
    sysName: string;
  };
  entityType: string;
  entityId: string;
}

export class Rejects {
  id: string;
  rejectResult: {
    id: string;
    name: string;
    sort: number;
    sysName: string;
  };
  entityType: string;
  entityId: string;

  constructor(data: RejectsResponse) {
    this.id = data.id;
    this.rejectResult = data.rejectResult;
    this.entityType = data.entityType;
    this.entityId = data.entityId;
  }
}
