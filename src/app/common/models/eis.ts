import { EisResponse } from '@common/interfaces/Eis-response';
import { Entity } from '@common/interfaces/Entity';

export class Eis {
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

  constructor(data: EisResponse) {
    this.noticeNumber = data.noticeNumber;
    this.purchaseUrl = data.purchaseUrl;
    this.purchaseCode = data.purchaseCode;
    this.serviceDeliveryPlace = data.serviceDeliveryPlace;
    this.purchaseObject = data.purchaseObject;
    this.bidDateTimeEnd = data.bidDateTimeEnd;
    this.bidReviewDateTimeEnd = data.bidReviewDateTimeEnd;
    this.auctionDate = data.auctionDate;
    this.contractProvision = data.contractProvision;
    this.purchaseName = data.purchaseName;
    this.purchaseType = data.purchaseType;
    this.tenderPlatform = data.tenderPlatform;
    this.serviceDeliveryDateComment = data.serviceDeliveryDateComment;
    this.responsibleUserFio = data.responsibleUserFio;
    this.responsibleUserEmail = data.responsibleUserEmail;
    this.responsibleUserPhone = data.responsibleUserPhone;
    this.startMaxContractPrice = data.startMaxContractPrice;
    this.purchaseCompanyINN = data.purchaseCompanyINN;
    this.purchaseCompanyName = data.purchaseCompanyName;
    this.purchaseCompanyRegion = data.purchaseCompanyRegion;
    this.purchaseCompanyCity = data.purchaseCompanyCity;
    this.purchaseCompanyAddress = data.purchaseCompanyAddress;
    this.diffHours = data.diffHours;
  }
}

