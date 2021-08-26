import { IBranch } from '@common/services/dictionaries/branches.service';

export interface ProtezNkInfo {
  name: string;
  dateOfIssue: string;
  guarantee: string;
  prothesisFastening: string;
  sleeveMaterial: string;
  prothesisParts: string;
  dateSendingToBranch: string;
  branch: IBranch;
}
