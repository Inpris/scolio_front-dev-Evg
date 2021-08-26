import { RegionResponse } from '@common/interfaces/Region-response';

export class Region {
  id: string;
  name: string;

  constructor(data: RegionResponse) {
    this.id = data.id;
    this.name = data.name;
  }
}

