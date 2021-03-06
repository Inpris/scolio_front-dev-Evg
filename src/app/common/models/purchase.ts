import { PurchaseResponse } from '@common/interfaces/Purchase-response';
import { PurchaseType } from './purchase-type';
import { PurchaseTenderPlatform } from './purchase-tender-platform';
import { PurchaseResponsible } from './purchase-responsible';
import { CustomerResponse } from '@common/interfaces/Customer-response';
import { Entity } from '@common/interfaces/Entity';
import { PurchaseAttachment } from '@common/interfaces/Purchase-attachment';
import { Status } from '@common/interfaces/Status';
import { DocumentItem } from '@common/models/document-item';
import * as moment from 'moment';

export class Purchase {
  id: string;
  allDevicesCount: number;
  allDevicesGiven: number;
  allDevicesInWork: number;
  auctionDate: string;
  auctionDateLocal: string;
  bidDateTimeEnd: string;
  bidReviewDateTimeEnd: string;
  changeStatusDateTime: string;
  contractCompleteDate: string;
  contractDate: string;
  contractExecutionDate: string;
  contractNumber: string;
  contractPriceDeclinePercent: number;
  contractPriceDeclineSum: number;
  contractProvision: number;
  createdBy: Entity;
  createdDate: string;
  customer: CustomerResponse;
  deadline: string;
  files: PurchaseAttachment[];
  finalContractPrice: number;
  includeResidenceCompensationMaxDays: number;
  includeResidenceCompensationMaxSum: number;
  includeResidenceCompensationSum: number;
  isDeleted: boolean;
  isReturnProvision: boolean;
  isWin: boolean;
  lastModifiedBy: Entity;
  lastModifiedDate: string;
  note: string;
  noticeNumber: string;
  organizationRequisites: string;
  patients: string[];
  paymentDate: string;
  paymentOrderNumber: string;
  penalties: string;
  purchaseCode: string;
  purchaseObject: string;
  purchaseStatus: Status;
  purchaseType: PurchaseType;
  purchaseUrl: string;
  registryNumber: string;
  responsible: PurchaseResponsible;
  returnDate: string;
  returnProvisionNotificationDate: string;
  serviceDeliveryDate: string;
  serviceDeliveryPlace: string;
  startMaxContractPrice: number;
  tenderPlatform: PurchaseTenderPlatform;
  expand: boolean;
  purchaseChapters: Entity[];
  purchaseOverdu?: boolean;
  documents: DocumentItem[];

  constructor(data?: PurchaseResponse) {
    if (!data) {
      return;
    }
    this.id = data.id;
    this.allDevicesCount = data.allDevicesCount;
    this.allDevicesGiven = data.allDevicesGiven;
    this.allDevicesInWork = data.allDevicesInWork;
    this.contractDate = data.contractDate;
    this.noticeNumber = data.noticeNumber;
    this.purchaseType = data.purchaseType;
    this.contractNumber = data.contractNumber;
    this.tenderPlatform = data.tenderPlatform;
    this.purchaseCode = data.purchaseCode;
    this.registryNumber = data.registryNumber;
    this.purchaseUrl = data.purchaseUrl;
    this.purchaseStatus = data.purchaseStatus;
    this.serviceDeliveryDate = data.serviceDeliveryDate;
    this.serviceDeliveryPlace = data.serviceDeliveryPlace;
    this.purchaseObject = data.purchaseObject;
    this.responsible = data.responsible;
    this.deadline = data.deadline;
    this.contractCompleteDate = data.contractCompleteDate;
    this.startMaxContractPrice = data.startMaxContractPrice;
    this.contractPriceDeclineSum = data.contractPriceDeclineSum;
    this.contractPriceDeclinePercent = data.contractPriceDeclinePercent;
    this.bidDateTimeEnd = data.bidDateTimeEnd;
    this.bidReviewDateTimeEnd = data.bidReviewDateTimeEnd;
    this.auctionDate = data.auctionDate;
    this.auctionDateLocal = data.auctionDateLocal;
    this.finalContractPrice = data.finalContractPrice;
    this.contractProvision = data.contractProvision;
    this.paymentOrderNumber = data.paymentOrderNumber;
    this.paymentDate = data.paymentDate;
    this.returnDate = data.returnDate;
    this.includeResidenceCompensationSum = data.includeResidenceCompensationSum;
    this.includeResidenceCompensationMaxDays = data.includeResidenceCompensationMaxDays;
    this.returnProvisionNotificationDate = data.returnProvisionNotificationDate;
    this.includeResidenceCompensationMaxSum = data.includeResidenceCompensationMaxSum;
    this.isReturnProvision = data.isReturnProvision;
    this.organizationRequisites = data.organizationRequisites;
    this.customer = data.customer;
    this.expand = false;
    this.files = data.files;
    this.createdBy = data.createdBy;
    this.createdDate = data.createdDate;
    this.lastModifiedBy = data.lastModifiedBy;
    this.lastModifiedDate = data.lastModifiedDate;
    this.changeStatusDateTime = data.changeStatusDateTime;
    this.isWin = data.isWin;
    this.note = data.note;
    this.patients = data.patients;
    this.penalties = data.penalties;
    this.contractExecutionDate = data.contractExecutionDate;
    this.purchaseChapters = data.purchaseChapters;
    this.purchaseOverdu = new Date(moment(data.deadline).format())  < new Date() ? true : false;
    this.documents = data.documents ? data.documents.map(item => new DocumentItem (item)) : null;
  }
}

