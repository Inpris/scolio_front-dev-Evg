import { AppointmentResponse } from '@common/models/appointment';
import { Entity } from '@common/interfaces/Entity';

export interface PatientVisit {
  id: string; // ok
  appointment: AppointmentResponse;
  dateTimeStart: string;
  dateTimeEnd: string;
  healingPlan: string;
  healingDynamic: Entity;
  patientVisit: VisitInfo;
  diagnosis: Diagnosis;
  iprPrp: IprPrp;
  stumpVicesVk?: Entity;
  comment: string;
  documents: File[];
  attachments: File[];
  rehabilitation: Rehabilitation;
  measurements: Measurement[];
  order: Order;
  wearing: Wearing;
}

export interface IprPrp {
  iprPrp: Entity;
  comment: string;
}

export interface VisitInfo {
  growth: number;
  weight: number;
  invalidGroup: Entity;
  complaints: string;
}

export interface Diagnosis {
  diagnosisOne: Entity;
  diagnosisTwo: Entity;
  main: Entity;
  attendant: string;
}

export interface File {
  id: string;
  fileName: string;
}

export interface Rehabilitation {
  type: Entity;
  comment: string;
}

export interface Measurement {
  name: string;

  [key: string]: number | string;
}

export interface Order {
  measurements: Measurement[];
}

export interface Wearing {
  recommendedCorsetWearing: string;
  actualCorsetWearing: string;
}
