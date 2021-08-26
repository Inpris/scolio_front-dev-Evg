import { CommissionMember } from '@common/models/act-mtk-template';
import { DateUtils } from '@common/utils/date';

export class ActMtk {
  id: string;
  visitId: string;
  number: string;
  actDate: string;
  comissionChairman: CommissionMember;
  comissionMembers: CommissionMember[];
  content: string;
  comissionSolution: string;
  comissionRecomendations: string;
  attachmentId?: string;

  constructor(data: ActMtk) {
    this.id = data.id;
    this.visitId = data.visitId;
    this.number = data.number;
    this.actDate = data.actDate && DateUtils.toISODateTimeString(data.actDate);
    this.comissionChairman = data.comissionChairman;
    this.comissionMembers = data.comissionMembers;
    this.content = data.content;
    this.comissionSolution = data.comissionSolution;
    this.comissionRecomendations = data.comissionRecomendations;
    this.attachmentId = data.attachmentId;
  }
}
