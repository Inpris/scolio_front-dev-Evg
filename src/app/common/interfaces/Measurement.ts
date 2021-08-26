export interface Measurement {
  id: string;
  type: MesurementType;
  value: number;
  boundary1: number;
  vertex: number;
  boundary2: number;
  rotation: number;
}

export interface ArcAngle {
  value: number;
  type: MesurementType;
}

export interface VertebraTorsion {
  segment1Length: number;
  segment2Length: number;
}

export enum MesurementType {
  PectoralArch = 'PectoralArch',
  ThoracicArch = 'ThoracicArch',
  ThoracolumbarArch = 'ThoracolumbarArch',
  LumbarArche = 'LumbarArche',
}

export enum VertebraType {
  Th1 = 'Th1',
  Th2 = 'Th2',
  Th3 = 'Th3',
  Th4 = 'Th4',
  Th5 = 'Th5',
  Th6 =  'Th6',
  Th7 = 'Th7',
  Th8 = 'Th8',
  Th9 =  'Th9',
  Th10 =  'Th10',
  Th11 = 'Th11',
  Th12 = 'Th12',
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
  L4 = 'L4',
  L5 = 'L5',
}
