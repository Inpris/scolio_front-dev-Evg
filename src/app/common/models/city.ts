import { RegionResponse } from '@common/interfaces/Region-response';
import { CityResponse } from '@common/interfaces/City-response';

export class City {
  id: string;
  name: string;

  constructor(data: CityResponse) {
    this.id = data.id;
    this.name = data.name;
  }
}

