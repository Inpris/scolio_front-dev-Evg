export interface RejectResultsResponse {
  id: string;
  name: string;
  sort: string;
  sysName: string;
}

export class RejectResults {
  id: string;
  name: string;
  sort: string;
  sysName: string;
  constructor(data: RejectResultsResponse) {
    this.id = data.id;
    this.name = data.name;
    this.sort = data.sort;
    this.sysName = data.sysName;
  }
}
