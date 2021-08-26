export interface IDayScheduleCell {
  time: any;
  records?: any[];
  status?: ECellStatus;
  roomId?: string;
  doctorId?: string;
}

export enum ECellStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  TAKEN = 'taken',
  SELF_TAKEN = 'self_taken',
  SELF_DISABLED = 'self_disabled',
}
