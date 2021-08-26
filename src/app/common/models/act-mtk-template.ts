export class ActMtkTemplate {
  id: string;
  name: string;
  content: string;
  comissionChairman: CommissionMember;
  comissionMembers: CommissionMember[];

  constructor(data: ActMtkTemplate) {
    this.id = data.id;
    this.name = data.name;
    this.content = data.content;
    this.comissionChairman = data.comissionChairman || { fio: null, position: null };
    this.comissionMembers = data.comissionMembers || [];
  }
}

export interface CommissionMember {
  fio: string;
  position: string;
}
