import { Entity } from '@common/interfaces/Entity';

export interface ModelFormData {
  execution3DModelEnd: string;
  execution3DModelStart: string;
  is3DModelReady: boolean;
  model3DExecutor1: Entity;
  participationPercent1: number;
  model3DExecutor2: Entity;
  participationPercent2: number;
}
