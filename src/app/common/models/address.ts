export interface Address {
  fias: string;
  region: Region;
  city: City;
  house: string;
  flat: string;
}

export interface AddressCreate {
  fias: string;
  regionId: string;
  cityId: string;
  house: string;
  flat: string;
}

export interface Region {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
}
