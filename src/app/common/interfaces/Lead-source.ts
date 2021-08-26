export interface LeadSource {
  id: string;
  name: string;
  sysName: string;
}

export enum LeadSourceSysName {
  PURCHASE = 'StatePurchase',
}
