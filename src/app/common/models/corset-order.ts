import { CorsetOrderResponse } from '@common/interfaces/corset-order-response';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { Entity } from '@common/interfaces/Entity';
import { OrderTerm } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/order-term.enum';
import { CorsetOperationStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/corser-operation-status.enum';
import { CorsetStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/corset-status.enum';
import { ProductStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/product-status.enum';
import { CorsetMeasurement } from '@common/interfaces/product-order/Corset-measurement';

export class CorsetOrder implements CorsetOrderResponse {
  afterBlockCorsetPlasticThickness: boolean;
  blockingExecutor1: Entity;
  blockingExecutor2: Entity;
  blockingStatus: CorsetOperationStatus;
  branch: Entity;
  color: string;
  comment: string;
  competentCutting: boolean;
  controlledBy: Entity;
  corsetFastenersInstallation: boolean;
  corsetMeasurement: CorsetMeasurement;
  corsetProblocking: boolean;
  corsetStatus: CorsetStatus;
  corsetType: Entity;
  cuttingExecutor1: Entity;
  cuttingExecutor2: Entity;
  cuttingStatus: CorsetOperationStatus;
  dateOfIssue: string;
  dateOfIssueTurner: string;
  dateSendingToBranch: string;
  deformationInsideCorsetLiner: boolean;
  execution3DModelEnd: string;
  execution3DModelStart: string;
  fastenersInstallExecutor1: Entity;
  fastenersInstallExecutor2: Entity;
  fastenersInstallStatus: CorsetOperationStatus;
  isControlled: boolean;
  issuer1: Entity;
  issuer2: Entity;
  is3DModelReady: boolean;
  levelOfAxillaryPelot: boolean;
  model3DExecutor1: Entity;
  model3DExecutor2: Entity;
  otherDefects: string;
  paintQualityAfterBlocking: boolean;
  participationPercent1: number;
  participationPercent2: number;
  plasticBend: boolean;
  plasticType: Entity;
  productReadinessAtTime: boolean;
  productionTime: OrderTerm;
  purityBeforeLoadingInThermostol: boolean;
  sameColorFrames: boolean;
  seamPolishing: boolean;
  stonesAfterTights: boolean;
  surfaceScratches: boolean;
  turningExecutor1: Entity;
  turningExecutor2: Entity;
  turningQuality: boolean;
  turningStatus: CorsetOperationStatus;
  whriteWhoInstalledFasteners: boolean;
  whriteWhoTurned: boolean;
  id: string;
  name: string;
  price: number;
  visitId: string;
  dealId: string;
  number: string;
  productType: EntityWithSysName;
  generalStatus: ProductStatus;
  statusComplete: boolean;

  constructor(data: CorsetOrderResponse) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
    this.visitId = data.visitId;
    this.dealId = data.dealId;
    this.number = data.number;
    this.productType = data.productType;
    this.generalStatus = data.generalStatus;
    this.statusComplete = data.statusComplete;
    this.afterBlockCorsetPlasticThickness = data.afterBlockCorsetPlasticThickness;
    this.blockingExecutor1 = data.blockingExecutor1;
    this.blockingExecutor2 = data.blockingExecutor2;
    this.blockingStatus = data.blockingStatus;
    this.branch = data.branch;
    this.color = data.color;
    this.comment = data.comment;
    this.competentCutting = data.competentCutting;
    this.controlledBy = data.controlledBy;
    this.corsetFastenersInstallation = data.corsetFastenersInstallation;
    this.corsetMeasurement = data.corsetMeasurement || {} as CorsetMeasurement;
    this.corsetProblocking = data.corsetProblocking;
    this.corsetStatus = data.corsetStatus;
    this.corsetType = data.corsetType;
    this.cuttingExecutor1 = data.cuttingExecutor1;
    this.cuttingExecutor2 = data.cuttingExecutor2;
    this.cuttingStatus = data.cuttingStatus;
    this.dateOfIssue = data.dateOfIssue;
    this.dateOfIssueTurner = data.dateOfIssueTurner;
    this.dateSendingToBranch = data.dateSendingToBranch;
    this.deformationInsideCorsetLiner = data.deformationInsideCorsetLiner;
    this.execution3DModelEnd = data.execution3DModelEnd;
    this.execution3DModelStart = data.execution3DModelStart;
    this.fastenersInstallExecutor1 = data.fastenersInstallExecutor1;
    this.fastenersInstallExecutor2 = data.fastenersInstallExecutor2;
    this.fastenersInstallStatus = data.fastenersInstallStatus;
    this.isControlled = data.isControlled;
    this.issuer1 = data.issuer1;
    this.issuer2 = data.issuer2;
    this.is3DModelReady = data.is3DModelReady;
    this.levelOfAxillaryPelot = data.levelOfAxillaryPelot;
    this.model3DExecutor1 = data.model3DExecutor1;
    this.model3DExecutor2 = data.model3DExecutor2;
    this.otherDefects = data.otherDefects;
    this.paintQualityAfterBlocking = data.paintQualityAfterBlocking;
    this.participationPercent1 = data.participationPercent1;
    this.participationPercent2 = data.participationPercent2;
    this.plasticBend = data.plasticBend;
    this.plasticType = data.plasticType;
    this.productReadinessAtTime = data.productReadinessAtTime;
    this.productionTime = data.productionTime;
    this.purityBeforeLoadingInThermostol = data.purityBeforeLoadingInThermostol;
    this.sameColorFrames = data.sameColorFrames;
    this.seamPolishing = data.seamPolishing;
    this.stonesAfterTights = data.stonesAfterTights;
    this.surfaceScratches = data.surfaceScratches;
    this.turningExecutor1 = data.turningExecutor1;
    this.turningExecutor2 = data.turningExecutor2;
    this.turningQuality = data.turningQuality;
    this.turningStatus = data.turningStatus;
    this.whriteWhoInstalledFasteners = data.whriteWhoInstalledFasteners;
    this.whriteWhoTurned = data.whriteWhoTurned;
  }

}
