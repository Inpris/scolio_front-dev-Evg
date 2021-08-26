import { Entity } from '@common/interfaces/Entity';

export interface EisResponse {
  noticeNumber: string;
  purchaseUrl: string;
  purchaseCode: string;
  serviceDeliveryPlace: string;
  purchaseObject: string;
  bidDateTimeEnd: string;
  bidReviewDateTimeEnd: string;
  auctionDate: string;
  contractProvision: number;
  purchaseName: string;
  purchaseType: Entity;
  tenderPlatform: Entity;
  serviceDeliveryDateComment: string;
  responsibleUserFio: string;
  responsibleUserEmail: string;
  responsibleUserPhone: string;
  startMaxContractPrice: number;
  purchaseCompanyINN: string;
  purchaseCompanyName: string;
  purchaseCompanyRegion: string;
  purchaseCompanyCity: string;
  purchaseCompanyAddress: string;
  diffHours: number;
}
