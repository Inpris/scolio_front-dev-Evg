import { CorsetOrderResponse } from '@common/interfaces/product-order/Corset-order-response';
import { Entity } from '@common/interfaces/Entity';
import { CorsetMeasurement } from '@common/interfaces/product-order/Corset-measurement';
import { OrderTerm } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/order-term.enum';
import { ProductOperationStatus } from '@common/enums/product-operation-status';
import { CorsetStatus } from '@modules/patients/patient/patient-visits/visit-meansurements/corset-order/models/corset-status.enum';
import { ProductOrder } from './product-order';
import { ProductOrderTypes } from '@common/enums/product-order-types';
import { extract } from '@common/utils/object';
import { DateUtils } from '@common/utils/date';
import { CorsetOrderUpdate } from '@common/interfaces/product-order/Corset-order-update';

export class CorsetOrder extends ProductOrder implements CorsetOrderResponse {
  afterBlockCorsetPlasticThickness: boolean;
  blockingExecutor1: Entity;
  blockingExecutor2: Entity;
  blockingStatus: ProductOperationStatus;
  color: string;
  carcassExecutor1: Entity;
  carcassExecutor2: Entity;
  carcassStatus: ProductOperationStatus;
  competentCutting: boolean;
  corsetFastenersInstallation: boolean;
  corsetMeasurement: CorsetMeasurement;
  corsetProblocking: boolean;
  corsetStatus: CorsetStatus;
  corsetType: Entity;
  cuttingExecutor1: Entity;
  cuttingExecutor2: Entity;
  cuttingStatus: ProductOperationStatus;
  deformationInsideCorsetLiner: boolean;
  fastenersInstallExecutor1: Entity;
  fastenersInstallExecutor2: Entity;
  fastenersInstallStatus: ProductOperationStatus;
  levelOfAxillaryPelot: boolean;
  otherDefects: string;
  paintQualityAfterBlocking: boolean;
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
  turningStatus: ProductOperationStatus;
  whriteWhoInstalledFasteners: boolean;
  whriteWhoTurned: boolean;
  statusComplete: boolean;
  guaranty: string;
  purchaseDeviceId: string;

  constructor(data: CorsetOrderResponse) {
    super(data);
    this.statusComplete = data.statusComplete;
    this.afterBlockCorsetPlasticThickness = data.afterBlockCorsetPlasticThickness;
    this.blockingExecutor1 = data.blockingExecutor1;
    this.blockingExecutor2 = data.blockingExecutor2;
    this.blockingStatus = data.blockingStatus;
    this.color = data.color;
    this.carcassStatus = data.carcassStatus;
    this.carcassExecutor1 = data.carcassExecutor1;
    this.carcassExecutor2 = data.carcassExecutor2;
    this.competentCutting = data.competentCutting;
    this.corsetFastenersInstallation = data.corsetFastenersInstallation;
    this.corsetMeasurement = data.corsetMeasurement || {} as CorsetMeasurement;
    this.corsetProblocking = data.corsetProblocking;
    this.corsetStatus = data.corsetStatus;
    this.corsetType = data.corsetType;
    this.cuttingExecutor1 = data.cuttingExecutor1;
    this.cuttingExecutor2 = data.cuttingExecutor2;
    this.cuttingStatus = data.cuttingStatus;
    this.deformationInsideCorsetLiner = data.deformationInsideCorsetLiner;
    this.fastenersInstallExecutor1 = data.fastenersInstallExecutor1;
    this.fastenersInstallExecutor2 = data.fastenersInstallExecutor2;
    this.fastenersInstallStatus = data.fastenersInstallStatus;
    this.levelOfAxillaryPelot = data.levelOfAxillaryPelot;
    this.otherDefects = data.otherDefects;
    this.paintQualityAfterBlocking = data.paintQualityAfterBlocking;
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
    this.guaranty = data.guaranty;
    this.purchaseDeviceId = data.purchaseDeviceId;
  }

  public static fromFormData(formData) {
    return new CorsetOrder({
      ...formData.corsetData,
      ...formData.issueData,
      ...formData.modelData,
      ...formData.manufacturingData,
      generalStatus: formData.generalStatus,
      corsetMeasurement: formData.measurementData,
      productType: ProductOrderTypes.CORSET,
      productionTime: formData.productionTime,
    } as CorsetOrderResponse);
  }

  public static getSchema(): { name: string, field: string, defects?: { label: string, formControl: string }[] }[] {
    return [
      { name: 'Тушка', field: 'carcass' },
      {
        name: 'Блоковка', field: 'blocking', defects: [
          { label: 'Чистота листа перед загрузкой в термостол', formControl: 'purityBeforeLoadingInThermostol' },
          { label: 'Деформация внутр. поверхности гильзы корсета', formControl: 'deformationInsideCorsetLiner' },
          { label: 'Толщина пластика корсета после блоковки', formControl: 'afterBlockCorsetPlasticThickness' },
          { label: 'Проблокованность корсета', formControl: 'corsetProblocking' },
          { label: 'Качество покраски корсета после блоковки', formControl: 'paintQualityAfterBlocking' },
          { label: 'Камни под трико', formControl: 'stonesAfterTights' },
        ],
      },
      {
        name: 'Спиливание', field: 'cutting', defects: [
          { label: 'Грамотное спиливание корсета', formControl: 'competentCutting' },
        ],
      },
      {
        name: 'Обточка', field: 'turning', defects: [
          { label: 'Поверхностные царапины', formControl: 'surfaceScratches' },
          { label: 'Уровень подмышечного пелота', formControl: 'levelOfAxillaryPelot' },
          { label: 'Писать кто точил', formControl: 'whriteWhoTurned' },
          { label: 'Качество обточки', formControl: 'turningQuality' },
          { label: 'Полировка шва', formControl: 'seamPolishing' },
          { label: 'Загиб пластика', formControl: 'plasticBend' },
        ],
      },
      {
        name: 'Установка крепления', field: 'fastenersInstall', defects: [
          { label: 'Установка креплений на корсет', formControl: 'corsetFastenersInstallation' },
          { label: 'Рамки одного цвета', formControl: 'sameColorFrames' },
          { label: 'Писать кто устанавливал крепления', formControl: 'whriteWhoInstalledFasteners' },
        ],
      },
    ];
  }

  public toFormData() {
    return {
      generalStatus: this.generalStatus,
      productionTime: this.productionTime,
      corsetData: this.getDeviceData(),
      measurementData: this.getMeasurementData(),
      issueData: this.getIssueData(),
      modelData: this.getModelData(),
      manufacturingData: this.getManufacturingData(),
    };
  }

  public getDeviceData() {
    return {
      id: this.id,
      name: this.name,
      dateOfIssue: this.dateOfIssue,
      corsetType: this.corsetType,
      plasticType: this.plasticType,
      color: this.color,
      dateOfIssueTurner: this.dateOfIssueTurner,
      dateSendingToBranch: this.dateSendingToBranch,
      branch: this.branch,
      guaranty: this.guaranty,
    };
  }

  public getMeasurementData() {
    return {
      circle1: this.corsetMeasurement.circle1,
      fas1: this.corsetMeasurement.fas1,
      circle2: this.corsetMeasurement.circle2,
      fas2: this.corsetMeasurement.fas2,
      circle3: this.corsetMeasurement.circle3,
      fas3: this.corsetMeasurement.fas3,
      circle4: this.corsetMeasurement.circle4,
      fas4: this.corsetMeasurement.fas4,
      circle5: this.corsetMeasurement.circle5,
      fas5: this.corsetMeasurement.fas5,
      hipsCirculRight: this.corsetMeasurement.hipsCirculRight,
      hipsCirculLeft: this.corsetMeasurement.hipsCirculLeft,
    };
  }

  public getManufacturingData() {
    return {
      isControlled: this.isControlled,
      controlledBy: this.controlledBy,
      comment: this.comment,
      carcassExecutor1: this.carcassExecutor1,
      carcassExecutor2: this.carcassExecutor2,
      carcassStatus: this.carcassStatus,
      blockingExecutor1: this.blockingExecutor1,
      blockingExecutor2: this.blockingExecutor2,
      blockingStatus: this.blockingStatus,
      purityBeforeLoadingInThermostol: this.purityBeforeLoadingInThermostol,
      deformationInsideCorsetLiner: this.deformationInsideCorsetLiner,
      afterBlockCorsetPlasticThickness: this.afterBlockCorsetPlasticThickness,
      corsetProblocking: this.corsetProblocking,
      paintQualityAfterBlocking: this.paintQualityAfterBlocking,
      stonesAfterTights: this.stonesAfterTights,
      cuttingExecutor1: this.cuttingExecutor1,
      cuttingExecutor2: this.cuttingExecutor2,
      cuttingStatus: this.cuttingStatus,
      competentCutting: this.competentCutting,
      fastenersInstallExecutor1: this.fastenersInstallExecutor1,
      fastenersInstallExecutor2: this.fastenersInstallExecutor2,
      fastenersInstallStatus: this.fastenersInstallStatus,
      corsetFastenersInstallation: this.corsetFastenersInstallation,
      sameColorFrames: this.sameColorFrames,
      whriteWhoInstalledFasteners: this.whriteWhoInstalledFasteners,
      turningExecutor1: this.turningExecutor1,
      turningExecutor2: this.turningExecutor2,
      turningStatus: this.turningStatus,
      surfaceScratches: this.surfaceScratches,
      levelOfAxillaryPelot: this.levelOfAxillaryPelot,
      whriteWhoTurned: this.whriteWhoTurned,
      turningQuality: this.turningQuality,
      seamPolishing: this.seamPolishing,
      plasticBend: this.plasticBend,
    };
  }

  public toUpdateModel(): CorsetOrderUpdate {
    return {
      generalStatus: this.generalStatus,
      color: this.color,
      corsetMeasurement: this.corsetMeasurement,
      corsetTypeId: extract(this, 'corsetType.id'),
      plasticTypeId: extract(this, 'plasticType.id'),
      carcassStatus: this.carcassStatus,
      carcassExecutor1Id: extract(this, 'carcassExecutor1.id'),
      carcassExecutor2Id: extract(this, 'carcassExecutor2.id'),
      corsetStatus: this.corsetStatus,
      productionTime: this.productionTime,
      statusComplete: this.statusComplete,

      blockingExecutor1Id: extract(this, 'blockingExecutor1.id'),
      blockingExecutor2Id: extract(this, 'blockingExecutor2.id'),
      blockingStatus: this.blockingStatus,

      cuttingExecutor1Id: extract(this, 'cuttingExecutor1.id'),
      cuttingExecutor2Id: extract(this, 'cuttingExecutor2.id'),
      cuttingStatus: this.cuttingStatus,

      fastenersInstallExecutor1Id: extract(this, 'fastenersInstallExecutor1.id'),
      fastenersInstallExecutor2Id: extract(this, 'fastenersInstallExecutor2.id'),
      fastenersInstallStatus: this.fastenersInstallStatus,

      turningExecutor1Id: extract(this, 'turningExecutor1.id'),
      turningExecutor2Id: extract(this, 'turningExecutor2.id'),
      turningStatus: this.turningStatus,

      purityBeforeLoadingInThermostol: this.purityBeforeLoadingInThermostol,
      deformationInsideCorsetLiner: this.deformationInsideCorsetLiner,
      afterBlockCorsetPlasticThickness: this.afterBlockCorsetPlasticThickness,
      corsetProblocking: this.corsetProblocking,
      paintQualityAfterBlocking: this.paintQualityAfterBlocking,
      stonesAfterTights: this.stonesAfterTights,
      competentCutting: this.competentCutting,
      corsetFastenersInstallation: this.corsetFastenersInstallation,
      sameColorFrames: this.sameColorFrames,
      whriteWhoInstalledFasteners: this.whriteWhoInstalledFasteners,
      surfaceScratches: this.surfaceScratches,
      levelOfAxillaryPelot: this.levelOfAxillaryPelot,
      whriteWhoTurned: this.whriteWhoTurned,
      turningQuality: this.turningQuality,
      seamPolishing: this.seamPolishing,
      plasticBend: this.plasticBend,
      otherDefects: this.otherDefects,
      productReadinessAtTime: this.productReadinessAtTime,

      name: this.name,
      model3DExecutor1Id: extract(this, 'model3DExecutor1.id'),
      model3DExecutor2Id: extract(this, 'model3DExecutor2.id'),
      participationPercent1: this.participationPercent1,
      participationPercent2: this.participationPercent2,
      execution3DModelEnd: this.execution3DModelEnd && DateUtils.toISODateTimeString(this.execution3DModelEnd),
      execution3DModelStart: this.execution3DModelStart && DateUtils.toISODateTimeString(this.execution3DModelStart),
      dateOfIssue: this.dateOfIssue && DateUtils.toISODateTimeString(this.dateOfIssue),

      issuer1Id: extract(this, 'issuer1.id'),
      issuer2Id: extract(this, 'issuer2.id'),
      dateOfIssueTurner: this.dateOfIssueTurner && DateUtils.toISODateTimeString(this.dateOfIssueTurner),
      dateSendingToBranch: this.dateSendingToBranch && DateUtils.toISODateTimeString(this.dateSendingToBranch),
      branchId: extract(this, 'branch.id'),
      isControlled: this.isControlled,
      controlledById: extract(this, 'controlledBy.id'),
      comment: this.comment,
      is3DModelReady: this.is3DModelReady,
    };
  }
}
