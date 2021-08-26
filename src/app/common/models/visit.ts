import { Room } from '@common/models/room';
import { Service } from '@common/models/service';
import { VisitReason } from '@common/models/visit-reason';
import { VisitResponse } from '@common/interfaces/Visit-response';
import { EntityWithSysName } from '@common/interfaces/EntityWithSysName';
import { Measurement } from '@common/interfaces/Measurement';
import { Entity } from '@common/interfaces/Entity';
import { MediaFile, MediaFileType } from '@common/models/media-file';
import { CorsetOrder } from '@common/models/product-order/corset-order';
import { CorsetMeasurement } from '@common/interfaces/product-order/Corset-measurement';
import { ProthesisVkMeasurement } from '@common/interfaces/product-order/Prothesis-vk-measurement';
import { ActMtk } from '@common/models/act-mtk';
import { CommonFile } from '@common/models/common-file';
import { Deal } from '@common/models/deal';
import { DealResponse } from '@common/interfaces/Deal-response';
import * as moment from 'moment';
import { ApparatLegMeasurement } from '@common/models/product-order/apparatus-order/apparat-leg-measurement';
import { ProthesisNkMeasurement } from '@modules/patients/patient/patient-visits/visit-meansurements/protez-nk-device-measurement/prothesis-nk-measurement';

export class Visit {
  branchId: string;
  dateTimeEnd: Date;
  dateTimeStart: Date;
  actualCorsetWearing: string;
  anamnesis: string;
  appointmentId: string;
  attendantDiagnosis: string;
  comment: string;
  complaints: string;
  corsetMeasurement?: CorsetMeasurement;
  prothesisVkMeasurement?: ProthesisVkMeasurement;
  prothesisNkMeasurement?: ProthesisNkMeasurement;
  apparatLegMeasurement?: ApparatLegMeasurement;
  contactId: string;
  createdBy: Entity;
  createdDate: string;
  dateTime: string;
  diagnosis1: EntityWithSysName;
  diagnosis2: EntityWithSysName;
  disabilityGroup: EntityWithSysName;
  doctor: Entity;
  growth: number;
  footSize: number;
  amputationSide: string;
  healingDynamic: Entity;
  healingPlan: string;
  id: string;
  iprPrp: EntityWithSysName;
  iprPrpActualDate: Date;
  iprPrpComment: string;
  stumpVicesVk?: Entity;
  lastModifiedBy: Entity;
  lastModifiedDate: string;
  measurements: Measurement[];
  medicalService: Service;
  mkb10: Entity;
  recommendedCorsetWearing: string;
  room: Room;
  visitReason: VisitReason;
  acceptXRay: boolean;
  weight: number;
  photos: MediaFile[];
  videos: MediaFile[];
  products: CorsetOrder[];
  actsMtk: ActMtk[];
  otherFiles: CommonFile[];
  deal: Deal;
  nextVisitDate: Date;

  get attachments() {
    return [...this.photos, ...this.videos];
  }

  constructor(data: VisitResponse) {
    this.dateTimeEnd = data.dateTimeEnd ?  new Date(moment(data.dateTimeEnd).format()) : null;
    /*
      Из за импорта базы заказчика это поле может быть null. Хотя оно всегда должно быть заполнено
      Таким образом мы инициализируем его датой посещения.
     */
    this.branchId = data.branch_Id || null
    this.dateTimeStart = data.dateTimeStart ? new Date(moment(data.dateTimeStart).format()) : new Date(moment(data.dateTime).format());
    this.nextVisitDate = data.nextVisitDate ? new Date(moment(data.nextVisitDate).format()) : null;
    this.actualCorsetWearing = data.actualCorsetWearing;
    this.anamnesis = data.anamnesis;
    this.amputationSide = data.amputationSide;
    this.footSize = data.footSize;
    this.appointmentId = data.appointmentId;
    this.attendantDiagnosis = data.attendantDiagnosis;
    this.comment = data.comment;
    this.complaints = data.complaints;
    this.corsetMeasurement = data.corsetMeasurement ? data.corsetMeasurement : null;
    this.prothesisVkMeasurement = data.prothesisVkMeasurement ? data.prothesisVkMeasurement : null;
    this.prothesisNkMeasurement = data.prothesisNkMeasurement ? data.prothesisNkMeasurement : null;
    this.apparatLegMeasurement = data.apparatLegMeasurement ? new ApparatLegMeasurement(data.apparatLegMeasurement) : null;
    this.contactId = data.contactId;
    this.createdBy = data.createdBy;
    this.createdDate = data.createdDate;
    this.dateTime = data.dateTime;
    this.diagnosis1 = data.diagnosis1;
    this.diagnosis2 = data.diagnosis2;
    this.disabilityGroup = data.disabilityGroup;
    this.doctor = data.doctor;
    this.growth = data.growth;
    this.healingDynamic = data.healingDynamic;
    this.healingPlan = data.healingPlan;
    this.id = data.id;
    this.iprPrp = data.iprPrp;
    this.iprPrpActualDate = data.iprPrpActualDate;
    this.iprPrpComment = data.iprPrpComment;
    this.stumpVicesVk = data.stumpVicesVk;
    this.lastModifiedBy = data.lastModifiedBy;
    this.lastModifiedDate = data.lastModifiedDate;
    this.measurements = data.measurements;
    this.medicalService = data.medicalService;
    this.mkb10 = data.mkb10;
    this.recommendedCorsetWearing = data.recommendedCorsetWearing;
    this.room = data.room;
    this.visitReason = data.visitReason;
    this.weight = data.weight;
    this.photos = data.photos.map(photo => new MediaFile(photo, MediaFileType.PHOTO));
    this.videos = data.videos.map(video => new MediaFile(video, MediaFileType.VIDEO));
    this.products = data.products;
    this.actsMtk = data.actsMtk ? data.actsMtk : [];
    this.otherFiles = data.otherFiles.map(file => new CommonFile(file));
    this.deal = new Deal(data.deal || {} as DealResponse);
    this.acceptXRay = data.acceptXRay;
  }

}
