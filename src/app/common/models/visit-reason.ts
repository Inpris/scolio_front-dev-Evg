export interface VisitReason {
  id: string;
  name: string;
  visitReasonTime: number;
  sysName: string;
  disabled?: boolean;
}

export const DefaultVisitReason: VisitReason = { id: null, name: null, visitReasonTime: 30, sysName: null };
